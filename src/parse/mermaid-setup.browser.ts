/**
 * Browser-specific mermaid setup.
 * In the browser, window and document already exist — no jsdom needed.
 */

let mermaidInstance: typeof import('mermaid').default | null = null;

export async function fetchMermaid() {
  if (mermaidInstance) return mermaidInstance;
  const mod = await import('mermaid');
  mermaidInstance = mod.default;
  await mermaidInstance.initialize({ startOnLoad: false });
  return mermaidInstance;
}

/**
 * No-op in the browser — there's no jsdom to clean up.
 */
export function cleanup() {
  mermaidInstance = null;
}

