import { defineConfig } from 'tsup';
import type { Plugin } from 'esbuild';
import path from 'path';

/**
 * esbuild plugin that redirects mermaid-setup imports to the browser version.
 * This removes jsdom from the browser bundle entirely.
 */
const browserMermaidSetupPlugin: Plugin = {
  name: 'browser-mermaid-setup',
  setup(build) {
    build.onResolve({ filter: /mermaid-setup/ }, (args) => {
      if (
        args.importer &&
        !args.path.includes('.browser') &&
        (args.path.includes('mermaid-setup') || args.path === './mermaid-setup.js')
      ) {
        return {
          path: path.resolve(path.dirname(args.importer), 'mermaid-setup.browser.ts'),
        };
      }
      return undefined;
    });
  },
};

export default defineConfig([
  // Node build (default)
  {
    entry: {
      index: 'src/index.ts',
      'themes/index': 'src/themes/index.ts',
      cli: 'src/cli.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    clean: true,
    target: 'es2020',
    outDir: 'dist',
  },
  // Browser build (no jsdom)
  {
    entry: {
      'browser/index': 'src/index.ts',
    },
    format: ['esm'],
    dts: true,
    splitting: false,
    clean: false,
    target: 'es2020',
    outDir: 'dist',
    platform: 'browser',
    external: ['jsdom'],
    esbuildPlugins: [browserMermaidSetupPlugin],
  },
]);
