import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/mermaid-to-svg/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@mermaid-to-svg': path.resolve(__dirname, '../src'),
      // elkjs tries to require('web-worker') for Node; stub it in the browser
      'web-worker': path.resolve(__dirname, 'src/stubs/web-worker.ts'),
    },
  },
});
