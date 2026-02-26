import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMermaid, cleanup } from '../src/index.js';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = join(__dirname, '..', 'examples');
const OUTPUT_DIR = join(EXAMPLES_DIR, 'output');

/**
 * Render mermaid text to a PNG buffer using the given theme.
 */
async function renderToPng(
  mermaidText: string,
  theme: 'default' | 'dark' | 'forest' | 'neutral',
): Promise<Buffer> {
  const { svg, bounds } = await renderMermaid(mermaidText, { theme });
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width' as const, value: Math.max(bounds.width * 2, 800) },
  });
  return Buffer.from(resvg.render().asPng());
}

/**
 * The same diagram used in examples/generate-theme-pngs.ts.
 * Keep in sync — this is the source of truth for snapshot comparison.
 */
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

const THEMES = ['default', 'dark', 'forest', 'neutral'] as const;
const isCI = !!process.env.CI;

describe('example PNG snapshots', { skip: isCI ? 'snapshot tests are skipped in CI' : false }, () => {
  after(() => cleanup());

  for (const theme of THEMES) {
    it(`${theme} theme matches snapshot`, async () => {
      const snapshotPath = join(OUTPUT_DIR, `${theme}.png`);

      const png = await renderToPng(DIAGRAM, theme);

      if (!existsSync(snapshotPath)) {
        mkdirSync(dirname(snapshotPath), { recursive: true });
        writeFileSync(snapshotPath, png);
        return;
      }

      const expected = createHash('sha1').update(readFileSync(snapshotPath)).digest('hex');
      const actual = createHash('sha1').update(png).digest('hex');

      assert.strictEqual(
        actual,
        expected,
        `PNG snapshot mismatch for "${theme}" theme. ` +
          `Expected hash ${expected}, got ${actual}. ` +
          `Run with UPDATE_SNAPSHOTS=1 to update, or regenerate with "node --import tsx examples/generate-theme-pngs.ts".`,
      );
    });
  }

  it('all expected snapshot files exist', () => {
    for (const theme of THEMES) {
      const snapshotPath = join(OUTPUT_DIR, `${theme}.png`);
      assert.ok(existsSync(snapshotPath), `Missing snapshot: ${snapshotPath}`);
    }
  });
});
