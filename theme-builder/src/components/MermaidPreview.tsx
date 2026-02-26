import { useEffect, useState, type ReactElement } from 'react';
import { parse, layout, renderElement } from '@mermaid-to-svg/index';
import type { Theme } from '../themes';

export function MermaidPreview({ code, theme }: { code: string; theme: Theme }) {
  const [element, setElement] = useState<ReactElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code.trim()) {
      setElement(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function renderDiagram() {
      try {
        // Parse mermaid text → IR
        const ir = await parse(code.trim());

        // Layout IR → positioned nodes/edges
        const layoutResult = await layout(ir);

        // Render to React element tree
        const el = renderElement(layoutResult, theme as any);

        if (!cancelled) {
          setElement(el);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to render diagram';
          setError(message);
          setElement(null);
        }
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, theme]);

  return (
    <div>
      {error && <div className="mermaid-error">{error}</div>}
      <div className="mermaid-output">{element}</div>
    </div>
  );
}
