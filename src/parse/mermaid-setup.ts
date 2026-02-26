/**
 * Mermaid requires DOM globals (DOMPurify) even for parsing.
 * This module sets up a minimal jsdom environment and lazily imports mermaid.
 * All DOM access is internal — consumers never need to provide a DOM.
 */

let mermaidInstance: typeof import('mermaid').default | null = null;
let setupDone = false;
let jsdomWindow: { close(): void } | null = null;

async function ensureDomGlobals() {
  if (setupDone) return;
  // Only set up DOM globals if we're in a non-browser environment
  if (!('window' in globalThis) || !('document' in globalThis)) {
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    jsdomWindow = dom.window;
    (globalThis as Record<string, unknown>).window = dom.window;
    (globalThis as Record<string, unknown>).document = dom.window.document;
    (globalThis as Record<string, unknown>).self = globalThis;
  }
  setupDone = true;
}

export async function fetchMermaid() {
  if (mermaidInstance) return mermaidInstance;
  await ensureDomGlobals();
  const mod = await import('mermaid');
  mermaidInstance = mod.default;
  await mermaidInstance.initialize({ startOnLoad: false });
  return mermaidInstance;
}

/**
 * Close the jsdom window and clean up global DOM polyfills.
 * Call this after all rendering is complete to allow the Node.js process to exit.
 */
export function cleanup() {
  if (jsdomWindow) {
    jsdomWindow.close();
    jsdomWindow = null;
  }
  mermaidInstance = null;
  setupDone = false;
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).document;
  delete (globalThis as Record<string, unknown>).self;
}
