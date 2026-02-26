import { renderMermaid } from '../src/index.js';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');
mkdirSync(OUTPUT_DIR, { recursive: true });

const DIAGRAM_NAMES = ['flowchart', 'sequence', 'class', 'state', 'er', 'gantt', 'pie', 'mindmap'];

function loadDiagram(name: string): string {
  return readFileSync(join(__dirname, `${name}.mmd`), 'utf-8');
}

const DIAGRAMS: Record<string, string> = Object.fromEntries(
  DIAGRAM_NAMES.map((name) => [name, loadDiagram(name)]),
);

const themes = ['default', 'dark', 'forest', 'neutral'] as const;

async function main() {
  // Generate theme variants (flowchart only, for backward compat)
  for (const theme of themes) {
    // Generate one sample per diagram type (default theme)
    for (const [name, diagram] of Object.entries(DIAGRAMS)) {
      const { svg, bounds } = await renderMermaid(diagram, { theme });
      writeFileSync(join(OUTPUT_DIR, `${name}-${theme}.svg`), svg);
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width' as const, value: Math.max(bounds.width * 2, 800) },
      });
      writeFileSync(join(OUTPUT_DIR, `${name}-${theme}.png`), resvg.render().asPng());
      console.log(`✓ sample/${name} → ${bounds.width}x${bounds.height}`);
    }
  }
  console.log(`\nAll outputs saved to ${OUTPUT_DIR}`);
}

main().catch(console.error);
