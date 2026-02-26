import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');

export default defineConfig({
  plugins: [react()],
  base: '/mermaid-to-svg/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      // jsdom is dynamically imported with a browser guard — never runs in the browser
      external: ['jsdom'],
    },
  },
  resolve: {
    alias: {
      '@mermaid-to-svg': path.resolve(rootDir, 'src'),
      // elkjs tries to require('web-worker') for Node; stub it in the browser
      'web-worker': path.resolve(__dirname, 'src/stubs/web-worker.ts'),
      // Resolve deps from root node_modules since theme-builder aliases @mermaid-to-svg to raw source
      'elkjs': path.resolve(rootDir, 'node_modules/elkjs'),
      'mermaid': path.resolve(rootDir, 'node_modules/mermaid'),
    },
  },
});
