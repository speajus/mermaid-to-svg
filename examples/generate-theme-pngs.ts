import { renderMermaid } from '../src/index.js';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');
mkdirSync(OUTPUT_DIR, { recursive: true });

const DIAGRAM = `
flowchart TD
  A[Christmas] -->|Get money| B(Go shopping)
  B --> C{Let me think}
  C -->|One| D[Laptop]
  C -->|Two| E[iPhone]
  C -->|Three| F[fa:fa-car Car]
  D --> G((Done))
  E --> G
  F --> G
`;

const themes = ['default', 'dark', 'forest', 'neutral'] as const;

async function main() {
  for (const themeName of themes) {
    const { svg, bounds } = await renderMermaid(DIAGRAM, { theme: themeName });

    // Save SVG
    writeFileSync(join(OUTPUT_DIR, `${themeName}.svg`), svg);

    // Save PNG via resvg
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width' as const, value: Math.max(bounds.width * 2, 800) },
    });
    const pngData = resvg.render();
    writeFileSync(join(OUTPUT_DIR, `${themeName}.png`), pngData.asPng());

    console.log(`✓ ${themeName} → ${bounds.width}x${bounds.height}`);
  }

  console.log(`\nAll PNGs saved to ${OUTPUT_DIR}`);
}

main().catch(console.error);

