import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { renderMermaid, parse, layout, renderSvg, createTheme, defaultTheme, darkTheme, forestTheme, neutralTheme, cleanup } from '../src/index.js';

// Clean up jsdom after all tests to allow the process to exit
after(() => cleanup());

describe('parse', () => {
  it('parses a simple flowchart', async () => {
    const ir = await parse('flowchart LR\n  A[Start] --> B[End]');
    assert.equal(ir.type, 'flowchart');
    assert.equal(ir.direction, 'LR');
    assert.equal(ir.nodes.length, 2);
    assert.equal(ir.edges.length, 1);

    assert.equal(ir.nodes[0].id, 'A');
    assert.equal(ir.nodes[0].label, 'Start');
    assert.equal(ir.nodes[0].shape, 'rect');

    assert.equal(ir.nodes[1].id, 'B');
    assert.equal(ir.nodes[1].label, 'End');

    assert.equal(ir.edges[0].source, 'A');
    assert.equal(ir.edges[0].target, 'B');
    assert.equal(ir.edges[0].arrowHead, 'arrow');
  });

  it('parses various node shapes', async () => {
    const ir = await parse(`flowchart TD
      A[Rectangle]
      B(Rounded)
      C{Diamond}
      D([Stadium])
      E[[Subroutine]]
      F[(Cylinder)]
      G((Circle))
    `);
    assert.equal(ir.nodes.length, 7);

    const shapes = ir.nodes.map((n) => n.shape);
    assert.ok(shapes.includes('rect'));
    assert.ok(shapes.includes('rounded'));
    assert.ok(shapes.includes('diamond'));
    assert.ok(shapes.includes('stadium'));
    assert.ok(shapes.includes('subroutine'));
    assert.ok(shapes.includes('cylinder'));
    assert.ok(shapes.includes('circle'));
  });

  it('parses edge labels', async () => {
    const ir = await parse('flowchart LR\n  A -->|Yes| B');
    assert.equal(ir.edges[0].label, 'Yes');
  });

  it('parses subgraphs', async () => {
    const ir = await parse(`flowchart TD
      subgraph sub1[My Sub]
        A --> B
      end
    `);
    assert.equal(ir.subgraphs.length, 1);
    assert.equal(ir.subgraphs[0].label, 'My Sub');
    assert.ok(ir.subgraphs[0].nodeIds.length >= 2);
  });

  it('detects direction', async () => {
    const lr = await parse('flowchart LR\n  A --> B');
    assert.equal(lr.direction, 'LR');

    const tb = await parse('flowchart TD\n  A --> B');
    assert.equal(tb.direction, 'TB');
  });

  it('throws on unsupported diagram types', async () => {
    await assert.rejects(
      () => parse('journey\n  title My Journey'),
      /Unsupported diagram type/,
    );
  });
});

describe('layout', () => {
  it('positions nodes with non-zero coordinates', async () => {
    const ir = await parse('flowchart LR\n  A[Start] --> B[End]');
    const result = await layout(ir);

    assert.equal(result.diagramType, 'flowchart');
    assert.equal(result.nodes.length, 2);
    assert.ok(result.width > 0);
    assert.ok(result.height > 0);

    for (const node of result.nodes) {
      assert.ok(node.width > 0, `Node ${node.id} should have positive width`);
      assert.ok(node.height > 0, `Node ${node.id} should have positive height`);
    }
  });

  it('produces edge points', async () => {
    const ir = await parse('flowchart LR\n  A[Start] --> B[End]');
    const result = await layout(ir);

    assert.equal(result.edges.length, 1);
    assert.ok(result.edges[0].points.length >= 2, 'Edge should have at least 2 points');
  });
});

describe('renderSvg', () => {
  it('produces valid SVG markup', async () => {
    const ir = await parse('flowchart LR\n  A[Start] --> B[End]');
    const result = await layout(ir);
    const svg = renderSvg(result);

    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'));
    assert.ok(svg.includes('</svg>'));
    assert.ok(svg.includes('Start'));
    assert.ok(svg.includes('End'));
  });
});

describe('renderMermaid (full pipeline)', () => {
  it('renders a flowchart to SVG', async () => {
    const result = await renderMermaid(`
      flowchart LR
        A[Start] --> B{Decision}
        B -->|Yes| C[OK]
        B -->|No| D[Cancel]
    `);

    assert.equal(result.diagramType, 'flowchart');
    assert.ok(result.svg.startsWith('<svg'));
    assert.ok(result.svg.includes('Start'));
    assert.ok(result.svg.includes('Decision'));
    assert.ok(result.svg.includes('Yes'));
    assert.ok(result.svg.includes('No'));
    assert.ok(result.bounds.width > 0);
    assert.ok(result.bounds.height > 0);
  });

  it('accepts a custom theme', async () => {
    const theme = createTheme({
      background: '#1a1a2e',
      primaryColor: '#e94560',
    });

    const result = await renderMermaid('flowchart LR\n  A --> B', { theme });
    assert.ok(result.svg.includes('#1a1a2e'));
  });

  it('accepts an idPrefix', async () => {
    const result = await renderMermaid('flowchart LR\n  A --> B', { idPrefix: 'custom' });
    assert.ok(result.svg.includes('custom-arrow'));
  });

  it('renders with dark theme by name', async () => {
    const result = await renderMermaid('flowchart LR\n  A --> B', { theme: 'dark' });
    assert.ok(result.svg.includes('#333333'), 'dark background');
    assert.ok(result.svg.includes('#1f2020'), 'dark node fill');
  });

  it('renders with forest theme by name', async () => {
    const result = await renderMermaid('flowchart LR\n  A --> B', { theme: 'forest' });
    assert.ok(result.svg.includes('#cde498'), 'forest node fill');
    assert.ok(result.svg.includes('#13540c'), 'forest node border');
  });

  it('renders with neutral theme by name', async () => {
    const result = await renderMermaid('flowchart LR\n  A --> B', { theme: 'neutral' });
    assert.ok(result.svg.includes('#eeeeee'), 'neutral node fill');
    assert.ok(result.svg.includes('#999999'), 'neutral node border');
  });

  it('renders with dark theme object', async () => {
    const result = await renderMermaid('flowchart LR\n  A --> B', { theme: darkTheme });
    assert.ok(result.svg.includes('#333333'));
  });

  it('renders with forest theme object', async () => {
    const result = await renderMermaid('flowchart LR\n  A --> B', { theme: forestTheme });
    assert.ok(result.svg.includes('#cde498'));
  });

  it('renders with neutral theme object', async () => {
    const result = await renderMermaid('flowchart LR\n  A --> B', { theme: neutralTheme });
    assert.ok(result.svg.includes('#eeeeee'));
  });
});

describe('theme system', () => {
  it('createTheme merges with default', () => {
    const custom = createTheme({ background: '#111' });
    assert.equal(custom.background, '#111');
    // Inherits rest from default
    assert.equal(custom.fontFamily, defaultTheme.fontFamily);
    assert.equal(custom.nodeStyles.default.fill, defaultTheme.nodeStyles.default.fill);
  });

  it('createTheme deep merges nodeStyles', () => {
    const custom = createTheme({
      nodeStyles: {
        ...defaultTheme.nodeStyles,
        default: { ...defaultTheme.nodeStyles.default, fill: '#ff0000' },
      },
    });
    assert.equal(custom.nodeStyles.default.fill, '#ff0000');
    assert.equal(custom.nodeStyles.default.stroke, defaultTheme.nodeStyles.default.stroke);
  });

  it('all built-in themes have required fields', () => {
    const themes = [defaultTheme, darkTheme, forestTheme, neutralTheme];
    for (const theme of themes) {
      assert.ok(theme.background);
      assert.ok(theme.primaryColor);
      assert.ok(theme.fontFamily);
      assert.ok(theme.nodeStyles.default);
      assert.ok(theme.nodeStyles.decision);
      assert.ok(theme.nodeStyles.rounded);
      assert.ok(theme.nodeStyles.circle);
      assert.ok(theme.nodeStyles.cylinder);
      assert.ok(theme.nodeStyles.subroutine);
      assert.ok(theme.edgeStyles.default);
      assert.ok(theme.edgeStyles.dotted);
      assert.ok(theme.edgeStyles.thick);
    }
  });
});

