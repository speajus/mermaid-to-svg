import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
/**
 * Vite plugin that swaps mermaid-setup.js imports for the browser version.
 * This removes the jsdom dependency from the browser bundle.
 */
function browserMermaidSetup(): Plugin {
  return {
    name: 'browser-mermaid-setup',
    enforce: 'pre',
    resolveId(source, importer) {
      if (
        importer &&
        !source.includes('.browser') &&
        source.includes('mermaid-setup')
      ) {
        return path.resolve(path.dirname(importer), 'mermaid-setup.browser.ts');
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), browserMermaidSetup()],
  base: '/mermaid-to-svg/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      // Resolve to raw source so no pre-build step is needed
      '@speajus/mermaid-to-svg/browser': path.resolve(rootDir, 'src/index.ts'),
      // elkjs tries to require('web-worker') for Node; stub it in the browser
      'web-worker': path.resolve(__dirname, 'src/stubs/web-worker.ts'),
    },
  },
});
