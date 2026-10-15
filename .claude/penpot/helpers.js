// Penpot helper library for the penpot-designer agent.
//
// Usage: read this file and pass its full contents to `mcp__penpot__execute_code`
// at the start of every task (the plugin `storage` object can be reset at any time).
// Afterwards, use `storage.K.*` in later execute_code calls. If `storage.K` is
// missing in a later call, load this file again.
//
// Conventions baked in here (learned the hard way):
// - Only non-archived library items are used (paths starting with "Archived" are ignored).
// - Fonts: exact name match via penpot.fonts.all (findByName is fuzzy: "Roboto" matched "Roboto Mono").
// - Boards: resize BEFORE setting flex sizing, otherwise auto-height gets lost.
// - Text: after building, call K.remeasure(root) so auto-width boxes are measured with the loaded font.
// - Pages: always use K.goto(name), which verifies the page switch actually happened.

const lib = penpot.library.local;
const K = (storage.K = {});
const notArchived = x => !String(x.path || "").startsWith("Archived");

K.colors = {
  primary: "#5B4CF0", primaryDark: "#4A3BD6", primaryLight: "#EEECFE",
  success: "#12B76A", successDark: "#067647", successLight: "#E8F8F0",
  warning: "#F79009", warningDark: "#B54708", warningLight: "#FEF4E6",
  danger: "#E5484D", dangerDark: "#C9353A", dangerLight: "#FDECEC",
  white: "#FFFFFF", n50: "#F6F6FA", n100: "#F2F2F7", n200: "#E7E7EF", n300: "#C9C7D6",
  n500: "#9A97AA", n600: "#6E6B80", n700: "#3D3A4F", n800: "#4B4860", n900: "#1E1B2E",
};

K.typo = Object.fromEntries(lib.typographies.filter(notArchived).map(t => [`${t.path}/${t.name}`, t]));

K.goto = async name => {
  const page = penpotUtils.getPageByName(name);
  if (!page) throw new Error(`Page not found: ${name}`);
  await penpot.openPage(page);
  await new Promise(r => setTimeout(r, 300));
  if (penpot.currentPage.name !== name) throw new Error(`Page switch failed: active page is "${penpot.currentPage.name}", wanted "${name}"`);
  return page;
};

K.fill = (s, hex, o = 1) => { s.fills = [{ fillColor: hex, fillOpacity: o }]; };
K.stroke = (s, hex, w = 1) => { s.strokes = [{ strokeColor: hex, strokeOpacity: 1, strokeWidth: w, strokeAlignment: "inner" }]; };

// Text with a library typography (e.g. "Heading/Page", "Body/Regular", "Label/Pill").
K.text = (chars, key, hex = K.colors.n900) => {
  if (!K.typo[key]) throw new Error(`Unknown typography ${key}. Known: ${Object.keys(K.typo).join(", ")}`);
  const t = penpot.createText(chars);
  K.typo[key].applyToText(t);
  t.fills = [{ fillColor: hex, fillOpacity: 1 }];
  t.growType = "auto-width";
  return t;
};

// Flex board. o: { w, h, py, px, gap, align, justify, bg, border, r }
K.box = (name, dir = "row", gap = 8, o = {}) => {
  const b = penpot.createBoard(); b.name = name; b.fills = [];
  if (o.w || o.h) b.resize(o.w || 100, o.h || 100);
  const f = b.addFlexLayout();
  f.dir = dir; f.rowGap = gap; f.columnGap = gap; f.alignItems = o.align || "center";
  if (o.justify) f.justifyContent = o.justify;
  f.verticalPadding = o.py ?? 0; f.horizontalPadding = o.px ?? 0;
  f.horizontalSizing = o.w ? "fix" : "auto"; f.verticalSizing = o.h ? "fix" : "auto";
  if (o.bg) K.fill(b, o.bg);
  if (o.border) K.stroke(b, o.border);
  if (o.r != null) b.borderRadius = o.r;
  return b;
};

K.add = (parent, child, fillW = false, fillH = false) => {
  parent.appendChild(child);
  if (fillW) child.layoutChild.horizontalSizing = "fill";
  if (fillH) child.layoutChild.verticalSizing = "fill";
  return child;
};

K.spacer = (parent, vertical = false) => {
  const s = penpot.createBoard(); s.name = "Spacer"; s.fills = []; s.resize(1, 1);
  parent.appendChild(s);
  if (vertical) s.layoutChild.verticalSizing = "fill"; else s.layoutChild.horizontalSizing = "fill";
  return s;
};

// Absolute child inside a flex parent, positioned relative to the parent.
K.absolute = (parent, child, x, y) => { parent.appendChild(child); child.layoutChild.absolute = true; penpotUtils.setParentXY(child, x, y); return child; };

// Bind a token from the active "core" set, e.g. K.tok(shape, "color.primary.main", ["fill"]).
// Note: penpotUtils.getTokenSet(token) returns null, so look the token up in the set directly.
K.tok = (shape, name, props) => {
  const set = lib.tokens.sets.find(s => s.name === "core");
  const t = set?.tokens.find(t => t.name === name);
  if (!t) throw new Error(`Token not found in set core: ${name}`);
  shape.applyToken(t, props);
};

// Components
K.comp = name => {
  const c = lib.components.find(c => c.name === name && notArchived(c) && !c.isVariant?.());
  if (!c) throw new Error(`Component not found: ${name}`);
  return c;
};
// Variant lookup. The library lists ONE component per variant group, so go through .variants.
K.v = (group, props) => {
  const c = lib.components.find(c => c.isVariant?.() && c.name === group && notArchived(c));
  if (!c) throw new Error(`Variant group not found: ${group}`);
  const vc = c.variants.variantComponents().find(vc => Object.entries(props).every(([k, val]) => vc.variantProps?.[k] === val));
  if (!vc) throw new Error(`No ${group} variant with ${JSON.stringify(props)}. Available: ${c.variants.variantComponents().map(x => JSON.stringify(x.variantProps)).join(" ")}`);
  return vc;
};
// component.instance() can land inside an existing board (e.g. a screen at 0,0) instead of the page root.
// Always place new instances explicitly: K.place(inst) puts it on the page root, or pass a parent.
K.place = (inst, parent = penpot.root, x = null, y = null) => {
  parent.appendChild(inst);
  if (x != null && y != null) {
    if (parent === penpot.root) { inst.x = x; inst.y = y; } else penpotUtils.setParentXY(inst, x, y);
  }
  return inst;
};
K.setText = (root, name, chars) => {
  const t = penpotUtils.findShape(s => s.type === "text" && s.name === name, root);
  if (!t) throw new Error(`Text "${name}" not found`);
  t.characters = chars;
  return t;
};

// Re-measure auto-width texts (fixes clipped labels such as "Buttor").
K.remeasure = async root => {
  const ts = penpotUtils.findShapes(s => s.type === "text" && s.growType === "auto-width", root);
  ts.forEach(t => { t.growType = "fixed"; });
  await new Promise(r => setTimeout(r, 80));
  ts.forEach(t => { t.growType = "auto-width"; });
  await new Promise(r => setTimeout(r, 250));
  return ts.length;
};

// Lay out the children of a variant container in a grid (natural order) and fit the container.
K.tidy = (c, cols, gx = 24, gy = 24, pad = 24) => {
  const kids = [...c.children].reverse(); const cw = [], rh = [];
  kids.forEach((k, i) => { const col = i % cols, row = Math.floor(i / cols); cw[col] = Math.max(cw[col] || 0, k.width); rh[row] = Math.max(rh[row] || 0, k.height); });
  kids.forEach((k, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    k.x = c.x + pad + cw.slice(0, col).reduce((s, w) => s + w + gx, 0);
    k.y = c.y + pad + rh.slice(0, row).reduce((s, h) => s + h + gy, 0);
  });
  c.resize(pad * 2 + cw.reduce((s, w) => s + w, 0) + gx * (cw.length - 1), pad * 2 + rh.reduce((s, h) => s + h, 0) + gy * (rh.length - 1));
};

// Create a variant set from [{ shape, props }] and return the container.
K.variantSet = async (name, items, cols = 1) => {
  const mains = items.map(it => ({ shape: lib.createComponent([it.shape]).mainInstance(), properties: it.props }));
  const c = penpotUtils.createVariantContainer(mains);
  c.name = name;
  await new Promise(r => setTimeout(r, 150));
  await K.remeasure(c);
  K.tidy(c, cols);
  return c;
};

// A 1440x900 desktop screen board.
K.screenBoard = (name, x, y) => {
  const s = penpot.createBoard(); s.name = name; s.resize(1440, 900); s.x = x; s.y = y; s.clipContent = true;
  K.fill(s, K.colors.n50);
  return s;
};

return {
  loaded: true,
  page: penpot.currentPage.name,
  pages: penpotUtils.getPages().map(p => p.name),
  typographies: Object.keys(K.typo),
  components: lib.components.filter(notArchived).map(c => c.name),
};
