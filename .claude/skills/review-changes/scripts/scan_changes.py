#!/usr/bin/env python3
"""Scan changes for secrets, personal data and forbidden files.

Usage:
  scan_changes.py uncommitted        # staged + unstaged + untracked (not ignored) changes
  scan_changes.py branch [BASE]      # changes on this branch since it split from BASE (default: main)
  scan_changes.py auto [BASE]        # uncommitted if there are any, otherwise branch

Only ADDED lines are scanned (what this change introduces). Untracked files are scanned in full.
Matched values are masked in the output. Exit code: 0 = clean, 1 = findings, 2 = usage error.
"""
import os
import re
import subprocess
import sys

ROOT = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip()
SELF_DIR = ".claude/skills/review-changes/"  # this skill documents the patterns, so skip it

SECRET_PATTERNS = [
    ("AWS access key id", r"\b(AKIA|ASIA)[0-9A-Z]{16}\b"),
    ("AWS account id in ARN", r"arn:aws:[a-z0-9-]*:[a-z0-9-]*:\d{12}"),
    ("AWS account id in ECR host", r"\b\d{12}\.dkr\.ecr\."),
    ("GitHub token", r"\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b"),
    ("Slack token", r"\bxox[abprs]-[A-Za-z0-9-]{10,}"),
    ("Google API key", r"\bAIza[0-9A-Za-z_\-]{35}\b"),
    ("Stripe live key", r"\b(sk|rk)_live_[0-9A-Za-z]{16,}"),
    ("Private key block", r"-----BEGIN ([A-Z]+ )?PRIVATE KEY-----"),
    ("JSON Web Token", r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),
    ("Penpot MCP user token", r"userToken=[A-Za-z0-9_\-]{8,}"),
    ("Credentials in connection string", r"\b[a-z][a-z0-9+.-]*://[^\s:/@]+:[^\s@/]+@"),
    ("Hard-coded secret assignment",
     r"(?i)\b(api[_-]?key|secret|token|passwd|password|pwd|client[_-]?secret|access[_-]?key)\b[\"']?\s*[:=]\s*[\"'][^\"'\s]{8,}[\"']"),
]

ALLOWED_EMAIL_DOMAINS = ("example.com", "example.org", "example.net", "users.noreply.github.com", "anthropic.com")
PERSONAL_PATTERNS = [
    ("Email address", r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
    ("Local machine path", r"(/Users/[A-Za-z0-9._-]+/|/home/[A-Za-z0-9._-]+/|[A-Za-z]:\\\\?Users\\\\?[A-Za-z0-9._-]+)"),
    ("Phone number", r"(?<![\w.])\+\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}(?![\w.])"),
]
# Placeholders used in docs and examples are fine.
PLACEHOLDER = re.compile(r"/Users/(<name>|<user>|USER|you|me|name)/|/home/(<name>|<user>|USER|you|user)/", re.I)

FORBIDDEN_FILES = [
    (r"(^|/)\.env(\..*)?$", "Environment file"),
    (r"\.(pem|key|p12|pfx|keystore|jks)$", "Key or certificate file"),
    (r"(^|/)id_(rsa|dsa|ecdsa|ed25519)(\.pub)?$", "SSH key"),
    (r"^\.claude/settings\.local\.json$", "Personal Claude settings"),
    (r"^\.mcp\.json$", "Local MCP config"),
    (r"(^|/)\.idea/", "IDE config"),
    (r"\.iml$", "IDE module file"),
    (r"(^|/)\.DS_Store$", "macOS metadata file"),
    (r"(^|/)(npm-debug|yarn-error)\.log", "Debug log"),
]
LARGE_FILE_BYTES = 1_000_000
SKIP_CONTENT = re.compile(r"(^|/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$|\.(png|jpe?g|gif|webp|ico|pdf|fig|woff2?|ttf|zip)$")


def git(*args):
    r = subprocess.run(["git", *args], capture_output=True, text=True, cwd=ROOT)
    if r.returncode != 0:
        sys.exit(f"git {' '.join(args)} failed: {r.stderr.strip()}")
    return r.stdout


def mask(value):
    return value if len(value) <= 8 else f"{value[:4]}…{value[-2:]} ({len(value)} chars)"


def added_lines_from_diff(diff_text):
    """Yield (file, line_no, text) for each added line in a unified diff."""
    path, line_no = None, 0
    for raw in diff_text.splitlines():
        if raw.startswith("+++ "):
            p = raw[4:]
            path = None if p == "/dev/null" else p[2:] if p.startswith("b/") else p
        elif raw.startswith("@@"):
            m = re.search(r"\+(\d+)", raw)
            line_no = int(m.group(1)) if m else 0
        elif path and raw.startswith("+") and not raw.startswith("+++"):
            yield path, line_no, raw[1:]
            line_no += 1
        elif path and not raw.startswith("-"):
            line_no += 1


def collect(mode, base):
    """Return (description, changed_files, added_lines, deleted_files)."""
    if mode == "auto":
        mode = "uncommitted" if git("status", "--porcelain").strip() else "branch"
    if mode == "uncommitted":
        diff = git("diff", "HEAD", "--no-color", "-U0")
        untracked = [f for f in git("ls-files", "--others", "--exclude-standard").splitlines() if f]
        lines = list(added_lines_from_diff(diff))
        for f in untracked:
            full = os.path.join(ROOT, f)
            if os.path.isdir(full) or SKIP_CONTENT.search(f):
                continue
            try:
                with open(full, encoding="utf-8") as fh:
                    lines += [(f, i, t.rstrip("\n")) for i, t in enumerate(fh, 1)]
            except (UnicodeDecodeError, OSError):
                pass
        status = git("diff", "HEAD", "--name-status", "--no-renames")
        changed = [l.split("\t", 1)[1] for l in status.splitlines() if l and not l.startswith("D")] + untracked
        deleted = [l.split("\t", 1)[1] for l in status.splitlines() if l.startswith("D")]
        return "uncommitted changes (staged + unstaged + untracked)", changed, lines, deleted
    if mode == "branch":
        merge_base = git("merge-base", base, "HEAD").strip()
        diff = git("diff", f"{merge_base}..HEAD", "--no-color", "-U0")
        status = git("diff", f"{merge_base}..HEAD", "--name-status", "--no-renames")
        changed = [l.split("\t", 1)[1] for l in status.splitlines() if l and not l.startswith("D")]
        deleted = [l.split("\t", 1)[1] for l in status.splitlines() if l.startswith("D")]
        branch = git("rev-parse", "--abbrev-ref", "HEAD").strip()
        return f"branch '{branch}' vs {base} (since {merge_base[:8]})", changed, list(added_lines_from_diff(diff)), deleted
    sys.exit(__doc__)


def main():
    args = sys.argv[1:] or ["auto"]
    mode, base = args[0], (args[1] if len(args) > 1 else "main")
    if mode not in ("auto", "uncommitted", "branch"):
        print(__doc__)
        sys.exit(2)
    scope, changed, lines, deleted = collect(mode, base)

    findings = []
    for f in changed:
        for pattern, label in FORBIDDEN_FILES:
            if re.search(pattern, f):
                findings.append(("BLOCKER", "Forbidden file", f, 0, label))
        full = os.path.join(ROOT, f)
        if os.path.isfile(full) and os.path.getsize(full) > LARGE_FILE_BYTES:
            findings.append(("WARNING", "Large file", f, 0, f"{os.path.getsize(full) // 1024} KB"))

    for f, n, text in lines:
        if f.startswith(SELF_DIR) or SKIP_CONTENT.search(f):
            continue
        for label, pattern in SECRET_PATTERNS:
            for m in re.finditer(pattern, text):
                findings.append(("BLOCKER", f"Secret: {label}", f, n, mask(m.group(0))))
        for label, pattern in PERSONAL_PATTERNS:
            for m in re.finditer(pattern, text):
                value = m.group(0)
                if label == "Email address" and value.lower().split("@")[-1].endswith(ALLOWED_EMAIL_DOMAINS):
                    continue
                if label == "Local machine path" and PLACEHOLDER.search(text):
                    continue
                findings.append(("BLOCKER", f"Personal data: {label}", f, n, mask(value)))

    print(f"Scope: {scope}")
    print(f"Files changed: {len(changed)} · deleted: {len(deleted)} · added lines scanned: {len(lines)}")
    if not findings:
        print("Result: CLEAN — no secrets, personal data or forbidden files found.")
        return 0
    print(f"Result: {len(findings)} finding(s)\n")
    for sev, cat, f, n, detail in sorted(findings, key=lambda x: (x[0] != "BLOCKER", x[2], x[3])):
        loc = f"{f}:{n}" if n else f
        print(f"[{sev}] {cat} — {loc} — {detail}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
