import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import type { Theme } from '../themes';

let renderCounter = 0;

function themeToMermaidVars(theme: Theme): Record<string, string> {
  return {
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    tertiaryColor: theme.tertiaryColor,
    primaryTextColor: theme.primaryTextColor,
    secondaryTextColor: theme.secondaryTextColor,
    lineColor: theme.lineColor,
    primaryBorderColor: theme.borderColor,
    fontFamily: theme.fontFamily,
    fontSize: `${theme.fontSize}px`,
    nodeBorder: theme.nodeStyles.default.stroke,
    mainBkg: theme.nodeStyles.default.fill,
    nodeTextColor: theme.nodeStyles.default.textColor,
    edgeLabelBackground: theme.edgeStyles.default.labelBackground,
  };
}

export function MermaidPreview({ code, theme }: { code: string; theme: Theme }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code.trim() || !containerRef.current) return;

    const id = `mermaid-preview-${++renderCounter}`;
    setError(null);

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: themeToMermaidVars(theme),
      fontFamily: theme.fontFamily,
      securityLevel: 'loose',
    });

    let cancelled = false;

    mermaid.render(id, code.trim()).then(({ svg }) => {
      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    }).catch((err) => {
      if (!cancelled) {
        setError(err?.message || 'Failed to render diagram');
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    });

    return () => { cancelled = true; };
  }, [code, theme]);

  return (
    <div>
      {error && <div className="mermaid-error">{error}</div>}
      <div ref={containerRef} className="mermaid-output" />
    </div>
  );
}

