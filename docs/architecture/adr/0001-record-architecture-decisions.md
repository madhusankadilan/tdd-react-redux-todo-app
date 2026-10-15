# 0001. Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-10-15

## Context
This repository is a reference project. People studying it need to understand not only *what* was built but *why* each technical choice was made. Without a record, decisions live only in chat history and memory, and they get re-argued or silently reversed.

## Decision
We record significant decisions as Architecture Decision Records in `docs/architecture/adr/`, using the template in the [ADR index](README.md). ADRs are numbered, short, and immutable once accepted. A changed decision gets a new ADR that supersedes the old one.

## Alternatives considered
- **Decisions in the README or wiki:** these get edited in place, so the history of *why* is lost.
- **No written record:** decisions become unclear to newcomers and get re-argued.

## Consequences
- Every significant decision has a short, findable explanation.
- Contributors must write an ADR when they make such a decision (see [CONTRIBUTING](../../../CONTRIBUTING.md)).
