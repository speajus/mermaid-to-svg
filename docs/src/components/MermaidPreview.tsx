import { useEffect, useRef, useState, useMemo } from 'react';
import mermaid from 'mermaid';
import type { Theme } from '../themes';

let renderCounter = 0;

function buildThemeVars(theme: Theme): Record<string, string> {
  const ns = theme.nodeStyles.default;
  const es = theme.edgeStyles.default;
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
    nodeBorder: ns.stroke,
    mainBkg: ns.fill,
    nodeTextColor: ns.textColor,
    edgeLabelBackground: es.labelBackground,
  };
}

export function MermaidPreview({ code, theme }: { code: string; theme: Theme }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Serialize theme to a string so we get a stable dependency for the effect
  const themeKey = useMemo(() => JSON.stringify(buildThemeVars(theme)), [theme]);

  useEffect(() => {
    if (!code.trim() || !containerRef.current) return;

    const id = `mermaid-preview-${++renderCounter}`;
    setError(null);

    // Re-initialize mermaid with fresh config each render
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: buildThemeVars(theme),
      fontFamily: theme.fontFamily,
      securityLevel: 'loose',
    });

    let cancelled = false;

    mermaid.render(id, code.trim()).then(({ svg }) => {
      if (!cancelled && containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
      // Clean up the temp sandbox element mermaid inserts into the body
      // (this is separate from the SVG we just copied into our container)
      const sandbox = document.querySelector(`#d${id}`);
      sandbox?.remove();
    }).catch((err) => {
      if (!cancelled) {
        setError(err?.message || 'Failed to render diagram');
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, themeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {error && <div className="mermaid-error">{error}</div>}
      <div ref={containerRef} className="mermaid-output" />
    </div>
  );
}

