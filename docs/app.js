// ── Theme Definitions ─────────────────────────────────────────────────────
const THEMES = {
  default: {
    background: '#ffffff', primaryColor: '#ECECFF', secondaryColor: '#ffffde',
    tertiaryColor: '#f5f5f0', primaryTextColor: '#131300', secondaryTextColor: '#000021',
    lineColor: '#333333', borderColor: '#9370DB',
    fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
    nodeStyles: {
      default: { fill: '#ECECFF', stroke: '#9370DB', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#f8f8ff', to: '#DCDCFF', direction: 180 } },
      decision: { fill: '#ECECFF', stroke: '#9370DB', strokeWidth: 1.5, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#f8f8ff', to: '#DCDCFF', direction: 180 } },
      rounded: { fill: '#ffffde', stroke: '#aaaa33', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#fffff0', to: '#f5f5c0', direction: 180 } },
      circle: { fill: '#ECECFF', stroke: '#9370DB', strokeWidth: 1.5, textColor: '#131300', padding: 12, gradient: { type: 'radial', from: '#f8f8ff', to: '#DCDCFF' } },
      cylinder: { fill: '#ffffde', stroke: '#aaaa33', strokeWidth: 1.5, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#fffff0', to: '#f5f5c0', direction: 180 } },
      subroutine: { fill: '#f5f5f0', stroke: '#9370DB', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#fafaf5', to: '#eaeae0', direction: 180 } },
    },
    edgeStyles: {
      default: { stroke: '#333333', strokeWidth: 1.5, arrowColor: '#333333', labelBackground: 'rgba(232,232,232,0.8)', labelColor: '#333333' },
      dotted: { stroke: '#333333', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#333333', labelBackground: 'rgba(232,232,232,0.8)', labelColor: '#333333' },
      thick: { stroke: '#333333', strokeWidth: 3, arrowColor: '#333333', labelBackground: 'rgba(232,232,232,0.8)', labelColor: '#131300' },
    },
  },
  dark: {
    background: '#333333', primaryColor: '#1f2020', secondaryColor: '#484848',
    tertiaryColor: '#1f1f1f', primaryTextColor: '#e0dfdf', secondaryTextColor: '#b8b8b8',
    lineColor: '#d3d3d3', borderColor: '#cccccc',
    fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
    nodeStyles: {
      default: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#2a2b2b', to: '#161717', direction: 180 } },
      decision: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#2a2b2b', to: '#161717', direction: 180 } },
      rounded: { fill: '#484848', stroke: '#cccccc', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#555555', to: '#3a3a3a', direction: 180 } },
      circle: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'radial', from: '#2a2b2b', to: '#161717' } },
      cylinder: { fill: '#484848', stroke: '#cccccc', strokeWidth: 1.5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#555555', to: '#3a3a3a', direction: 180 } },
      subroutine: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#2a2b2b', to: '#161717', direction: 180 } },
    },
    edgeStyles: {
      default: { stroke: '#d3d3d3', strokeWidth: 1.5, arrowColor: '#d3d3d3', labelBackground: '#585858', labelColor: '#cccccc' },
      dotted: { stroke: '#d3d3d3', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#d3d3d3', labelBackground: '#585858', labelColor: '#cccccc' },
      thick: { stroke: '#d3d3d3', strokeWidth: 3, arrowColor: '#d3d3d3', labelBackground: '#585858', labelColor: '#e0dfdf' },
    },
  },
  forest: {
    background: '#ffffff', primaryColor: '#cde498', secondaryColor: '#cdffb2',
    tertiaryColor: '#d8e8c8', primaryTextColor: '#000000', secondaryTextColor: '#333333',
    lineColor: '#000000', borderColor: '#13540c',
    fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
    nodeStyles: {
      default: { fill: '#cde498', stroke: '#13540c', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#e0f0b0', to: '#b8d480', direction: 180 } },
      decision: { fill: '#cde498', stroke: '#13540c', strokeWidth: 1.5, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#e0f0b0', to: '#b8d480', direction: 180 } },
      rounded: { fill: '#cdffb2', stroke: '#6eaa49', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#ddffc8', to: '#b0e890', direction: 180 } },
      circle: { fill: '#cde498', stroke: '#13540c', strokeWidth: 1.5, textColor: '#000000', padding: 12, gradient: { type: 'radial', from: '#e0f0b0', to: '#b8d480' } },
      cylinder: { fill: '#cdffb2', stroke: '#6eaa49', strokeWidth: 1.5, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#ddffc8', to: '#b0e890', direction: 180 } },
      subroutine: { fill: '#d8e8c8', stroke: '#13540c', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#e8f0d8', to: '#c8d8b0', direction: 180 } },
    },
    edgeStyles: {
      default: { stroke: '#000000', strokeWidth: 1.5, arrowColor: '#008000', labelBackground: '#e8e8e8', labelColor: '#333333' },
      dotted: { stroke: '#000000', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#008000', labelBackground: '#e8e8e8', labelColor: '#333333' },
      thick: { stroke: '#000000', strokeWidth: 3, arrowColor: '#008000', labelBackground: '#e8e8e8', labelColor: '#000000' },
    },
  },
  neutral: {
    background: '#ffffff', primaryColor: '#eeeeee', secondaryColor: '#fcfcfc',
    tertiaryColor: '#eeeeee', primaryTextColor: '#111111', secondaryTextColor: '#333333',
    lineColor: '#666666', borderColor: '#999999',
    fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
    nodeStyles: {
      default: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#f8f8f8', to: '#e0e0e0', direction: 180 } },
      decision: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#f8f8f8', to: '#e0e0e0', direction: 180 } },
      rounded: { fill: '#fcfcfc', stroke: '#707070', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#ffffff', to: '#f0f0f0', direction: 180 } },
      circle: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, textColor: '#111111', padding: 12, gradient: { type: 'radial', from: '#f8f8f8', to: '#e0e0e0' } },
      cylinder: { fill: '#fcfcfc', stroke: '#707070', strokeWidth: 1.5, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#ffffff', to: '#f0f0f0', direction: 180 } },
      subroutine: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#f8f8f8', to: '#e0e0e0', direction: 180 } },
    },
    edgeStyles: {
      default: { stroke: '#666666', strokeWidth: 1.5, arrowColor: '#333333', labelBackground: '#ffffff', labelColor: '#333333' },
      dotted: { stroke: '#666666', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#333333', labelBackground: '#ffffff', labelColor: '#333333' },
      thick: { stroke: '#666666', strokeWidth: 3, arrowColor: '#333333', labelBackground: '#ffffff', labelColor: '#111111' },
    },
  },
};

// ── State ─────────────────────────────────────────────────────────────────
let currentTheme = structuredClone(THEMES.default);

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── SVG Preview Renderer ──────────────────────────────────────────────────
function buildGradientDef(id, grad) {
  if (!grad) return '';
  if (grad.type === 'radial') {
    return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${grad.from}"/>
      <stop offset="100%" stop-color="${grad.to}"/>
    </radialGradient>`;
  }
  const angle = grad.direction ?? 180;
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - 50 * Math.sin(rad);
  const y1 = 50 - 50 * Math.cos(rad);
  const x2 = 50 + 50 * Math.sin(rad);
  const y2 = 50 + 50 * Math.cos(rad);
  return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
    <stop offset="0%" stop-color="${grad.from}"/>
    <stop offset="100%" stop-color="${grad.to}"/>
  </linearGradient>`;
}

function renderPreview() {
  const t = currentTheme;
  const ns = t.nodeStyles;
  const es = t.edgeStyles.default;
  const defs = [];
  const shapes = [];

  // Collect gradient defs for each node style used in preview
  const styleKeys = ['default', 'decision', 'rounded', 'circle', 'cylinder', 'subroutine'];
  styleKeys.forEach((key) => {
    const s = ns[key];
    if (s && s.gradient) {
      defs.push(buildGradientDef(`grad-${key}`, s.gradient));
    }
  });

  const W = 620, H = 420;
  const ff = t.fontFamily;
  const fs = t.fontSize;

  // Default rect node
  const d = ns.default;
  shapes.push(`<rect x="40" y="30" width="140" height="50" rx="${d.rx ?? 0}" ry="${d.ry ?? 0}"
    fill="${d.gradient ? `url(#grad-default)` : d.fill}" stroke="${d.stroke}" stroke-width="${d.strokeWidth}"/>
    <text x="110" y="60" text-anchor="middle" fill="${d.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Default</text>`);

  // Rounded node
  const r = ns.rounded;
  shapes.push(`<rect x="240" y="30" width="140" height="50" rx="${r.rx ?? 0}" ry="${r.ry ?? 0}"
    fill="${r.gradient ? `url(#grad-rounded)` : r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>
    <text x="310" y="60" text-anchor="middle" fill="${r.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Rounded</text>`);

  // Circle node
  const c = ns.circle;
  shapes.push(`<circle cx="510" cy="55" r="35"
    fill="${c.gradient ? `url(#grad-circle)` : c.fill}" stroke="${c.stroke}" stroke-width="${c.strokeWidth}"/>
    <text x="510" y="60" text-anchor="middle" fill="${c.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Circle</text>`);

  // Decision (diamond)
  const dc = ns.decision;
  shapes.push(`<polygon points="110,160 180,200 110,240 40,200"
    fill="${dc.gradient ? `url(#grad-decision)` : dc.fill}" stroke="${dc.stroke}" stroke-width="${dc.strokeWidth}"/>
    <text x="110" y="205" text-anchor="middle" fill="${dc.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Decision</text>`);

  // Cylinder
  const cy = ns.cylinder;
  shapes.push(`<path d="M250,160 L250,230 Q250,250 310,250 Q370,250 370,230 L370,160 Q370,180 310,180 Q250,180 250,160 Z"
    fill="${cy.gradient ? `url(#grad-cylinder)` : cy.fill}" stroke="${cy.stroke}" stroke-width="${cy.strokeWidth}"/>
    <ellipse cx="310" cy="160" rx="60" ry="18"
    fill="${cy.gradient ? `url(#grad-cylinder)` : cy.fill}" stroke="${cy.stroke}" stroke-width="${cy.strokeWidth}"/>
    <text x="310" y="215" text-anchor="middle" fill="${cy.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Cylinder</text>`);

  // Subroutine
  const sb = ns.subroutine;
  shapes.push(`<rect x="430" y="170" width="150" height="50" rx="${sb.rx ?? 0}" ry="${sb.ry ?? 0}"
    fill="${sb.gradient ? `url(#grad-subroutine)` : sb.fill}" stroke="${sb.stroke}" stroke-width="${sb.strokeWidth}"/>
    <line x1="442" y1="170" x2="442" y2="220" stroke="${sb.stroke}" stroke-width="${sb.strokeWidth}"/>
    <line x1="568" y1="170" x2="568" y2="220" stroke="${sb.stroke}" stroke-width="${sb.strokeWidth}"/>
    <text x="505" y="200" text-anchor="middle" fill="${sb.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Subroutine</text>`);

  // Edges
  // Default edge: from Default to Rounded
  shapes.push(`<line x1="180" y1="55" x2="240" y2="55" stroke="${es.stroke}" stroke-width="${es.strokeWidth}" marker-end="url(#arrowhead)"/>`);
  // Edge from Rounded to Circle
  shapes.push(`<line x1="380" y1="55" x2="475" y2="55" stroke="${es.stroke}" stroke-width="${es.strokeWidth}" marker-end="url(#arrowhead)"/>`);
  // Edge from Default down to Decision
  shapes.push(`<line x1="110" y1="80" x2="110" y2="160" stroke="${es.stroke}" stroke-width="${es.strokeWidth}" marker-end="url(#arrowhead)"/>`);
  // Dotted edge
  const ed = t.edgeStyles.dotted;
  shapes.push(`<line x1="180" y1="200" x2="250" y2="200" stroke="${ed.stroke}" stroke-width="${ed.strokeWidth}" stroke-dasharray="${ed.strokeDasharray || ''}" marker-end="url(#arrowhead)"/>`);
  // Edge label
  shapes.push(`<rect x="190" y="185" width="40" height="16" rx="3" fill="${es.labelBackground}"/>
    <text x="210" y="197" text-anchor="middle" fill="${es.labelColor}" font-size="10" font-family="${ff}">yes</text>`);
  // Thick edge
  const et = t.edgeStyles.thick;
  shapes.push(`<line x1="370" y1="210" x2="430" y2="195" stroke="${et.stroke}" stroke-width="${et.strokeWidth}" marker-end="url(#arrowhead)"/>`);

  // Subgraph box
  shapes.push(`<rect x="20" y="290" width="580" height="100" rx="8" fill="none" stroke="${t.borderColor}" stroke-width="1" stroke-dasharray="6,3"/>
    <text x="30" y="310" fill="${t.secondaryTextColor}" font-family="${ff}" font-size="${fs - 2}" font-weight="${t.fontWeight}">Subgraph</text>`);
  // Nodes inside subgraph
  shapes.push(`<rect x="40" y="325" width="120" height="40" rx="${d.rx ?? 0}" ry="${d.ry ?? 0}"
    fill="${d.gradient ? `url(#grad-default)` : d.fill}" stroke="${d.stroke}" stroke-width="${d.strokeWidth}"/>
    <text x="100" y="350" text-anchor="middle" fill="${d.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Node A</text>`);
  shapes.push(`<rect x="240" y="325" width="120" height="40" rx="${r.rx ?? 0}" ry="${r.ry ?? 0}"
    fill="${r.gradient ? `url(#grad-rounded)` : r.fill}" stroke="${r.stroke}" stroke-width="${r.strokeWidth}"/>
    <text x="300" y="350" text-anchor="middle" fill="${r.textColor}" font-family="${ff}" font-size="${fs}" font-weight="${t.fontWeight}">Node B</text>`);
  shapes.push(`<line x1="160" y1="345" x2="240" y2="345" stroke="${es.stroke}" stroke-width="${es.strokeWidth}" marker-end="url(#arrowhead)"/>`);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="background:${t.background}">
    <defs>
      ${defs.join('\n')}
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="${es.arrowColor}"/>
      </marker>
    </defs>
    ${shapes.join('\n')}
  </svg>`;

  $('#svgPreview').innerHTML = svg;
  $('#themeJSON').textContent = JSON.stringify(currentTheme, null, 2);
}

// ── Helpers ───────────────────────────────────────────────────────────────
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

function rgbaToHex(rgba) {
  if (!rgba || rgba.startsWith('#')) return rgba;
  const m = rgba.match(/[0-9.]+/g);
  if (!m) return '#888888';
  const r = parseInt(m[0]); const g = parseInt(m[1]); const b = parseInt(m[2]);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ── Sync Controls → Theme ─────────────────────────────────────────────────
function syncControlsFromTheme() {
  // Top-level color/select inputs
  $$('[data-path]').forEach(el => {
    const key = el.dataset.path;
    const val = currentTheme[key];
    if (val === undefined) return;
    if (el.type === 'color') {
      el.value = rgbaToHex(String(val));
    } else if (el.type === 'range') {
      el.value = val;
      const span = el.nextElementSibling;
      if (span) span.textContent = val;
    } else {
      el.value = val;
    }
  });

  // Node style controls
  const ns = currentTheme.nodeStyles[activeNodeStyle] || currentTheme.nodeStyles.default;
  $$('[data-node-path]').forEach(el => {
    const key = el.dataset.nodePath;
    const val = ns[key];
    if (val === undefined) return;
    if (el.type === 'color') {
      el.value = rgbaToHex(String(val));
    } else if (el.type === 'range') {
      el.value = val;
      const span = el.nextElementSibling;
      if (span) span.textContent = val;
    }
  });

  // Gradient controls
  const grad = ns.gradient || { type: 'linear', from: '#ffffff', to: '#cccccc', direction: 180 };
  $$('[data-gradient-path]').forEach(el => {
    const key = el.dataset.gradientPath;
    const val = grad[key];
    if (val === undefined) return;
    if (el.type === 'color') {
      el.value = rgbaToHex(String(val));
    } else if (el.type === 'range') {
      el.value = val;
      const span = el.nextElementSibling;
      if (span) span.textContent = val;
    } else {
      el.value = val;
    }
  });

  // Edge style controls
  const es = currentTheme.edgeStyles.default;
  $$('[data-edge-path]').forEach(el => {
    const key = el.dataset.edgePath;
    const val = es[key];
    if (val === undefined) return;
    if (el.type === 'color') {
      el.value = rgbaToHex(String(val));
    } else if (el.type === 'range') {
      el.value = val;
      const span = el.nextElementSibling;
      if (span) span.textContent = val;
    }
  });

  // Active tab
  $$('#nodeStyleTabs .tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.node === activeNodeStyle);
  });
}


// ── Event Wiring ──────────────────────────────────────────────────────────
function init() {
  // Base theme selector
  document.querySelector('#baseTheme').addEventListener('change', (e) => {
    currentTheme = deepClone(THEMES[e.target.value]);
    syncControlsFromTheme();
    renderPreview();
  });

  // Top-level theme properties
  document.querySelectorAll('[data-path]').forEach(el => {
    const evt = el.type === 'color' ? 'input' : 'change';
    el.addEventListener(evt, () => {
      let val = el.value;
      if (el.type === 'range') {
        val = Number(val);
        const span = el.nextElementSibling;
        if (span) span.textContent = val;
      }
      currentTheme[el.dataset.path] = val;
      renderPreview();
    });
  });

  // Node style tabs
  document.querySelectorAll('#nodeStyleTabs .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeNodeStyle = btn.dataset.node;
      syncControlsFromTheme();
    });
  });

  // Node style controls
  document.querySelectorAll('[data-node-path]').forEach(el => {
    const evt = el.type === 'color' ? 'input' : 'input';
    el.addEventListener(evt, () => {
      let val = el.value;
      if (el.type === 'range') {
        val = Number(val);
        const span = el.nextElementSibling;
        if (span) span.textContent = val;
      }
      if (!currentTheme.nodeStyles[activeNodeStyle]) return;
      currentTheme.nodeStyles[activeNodeStyle][el.dataset.nodePath] = val;
      // Also update ry to match rx
      if (el.dataset.nodePath === 'rx') {
        currentTheme.nodeStyles[activeNodeStyle].ry = val;
      }
      renderPreview();
    });
  });

  // Gradient controls
  document.querySelectorAll('[data-gradient-path]').forEach(el => {
    const evt = el.type === 'color' ? 'input' : 'input';
    el.addEventListener(evt, () => {
      let val = el.value;
      if (el.type === 'range') {
        val = Number(val);
        const span = el.nextElementSibling;
        if (span) span.textContent = val;
      }
      const ns = currentTheme.nodeStyles[activeNodeStyle];
      if (!ns) return;
      if (!ns.gradient) ns.gradient = { type: 'linear', from: '#ffffff', to: '#cccccc', direction: 180 };
      ns.gradient[el.dataset.gradientPath] = val;
      renderPreview();
    });
  });

  // Edge style controls (apply to all edge styles)
  document.querySelectorAll('[data-edge-path]').forEach(el => {
    const evt = el.type === 'color' ? 'input' : 'input';
    el.addEventListener(evt, () => {
      let val = el.value;
      if (el.type === 'range') {
        val = Number(val);
        const span = el.nextElementSibling;
        if (span) span.textContent = val;
      }
      const key = el.dataset.edgePath;
      for (const edgeKey of Object.keys(currentTheme.edgeStyles)) {
        currentTheme.edgeStyles[edgeKey][key] = val;
      }
      renderPreview();
    });
  });

  // Export buttons
  document.querySelector('#exportJSON').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(currentTheme, null, 2));
    toast('Theme JSON copied to clipboard!');
  });

  document.querySelector('#exportTS').addEventListener('click', () => {
    const ts = `import { createTheme } from '@speajus/mermaid-to-svg';\n\nexport const myTheme = createTheme(${JSON.stringify(currentTheme, null, 2)});\n`;
    navigator.clipboard.writeText(ts);
    toast('TypeScript copied to clipboard!');
  });

  document.querySelector('#resetTheme').addEventListener('click', () => {
    const base = document.querySelector('#baseTheme').value;
    currentTheme = deepClone(THEMES[base]);
    activeNodeStyle = 'default';
    syncControlsFromTheme();
    renderPreview();
  });

  // Initial render
  syncControlsFromTheme();
  renderPreview();
}

document.addEventListener('DOMContentLoaded', init);

