import { useState, useCallback, useRef } from 'react';
import { THEMES, FONT_FAMILIES, NODE_STYLE_KEYS, type Theme } from './themes';
import { SvgPreview } from './components/SvgPreview';
import { MermaidPreview } from './components/MermaidPreview';

const DEFAULT_MERMAID = `graph TD
    A[Start] -->|Step 1| B(Process)
    B --> C{Decision}
    C -->|Yes| D[Result A]
    C -->|No| E[Result B]
    D --> F[End]
    E --> F`;

type PreviewMode = 'shapes' | 'mermaid';

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function rgbaToHex(val: string): string {
  if (!val || val.startsWith('#')) return val;
  const m = val.match(/[0-9.]+/g);
  if (!m) return '#888888';
  return (
    '#' +
    [parseInt(m[0]), parseInt(m[1]), parseInt(m[2])]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

function useToast() {
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const show = useCallback((text: string) => {
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(''), 2000);
  }, []);
  return { msg, show };
}

export function App() {
  const [baseName, setBaseName] = useState('default');
  const [theme, setTheme] = useState<Theme>(() => deepClone(THEMES.default));
  const [activeNode, setActiveNode] = useState('default');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('shapes');
  const [mermaidCode, setMermaidCode] = useState(DEFAULT_MERMAID);
  const toast = useToast();

  const update = useCallback((fn: (t: Theme) => void) => {
    setTheme((prev) => {
      const next = deepClone(prev);
      fn(next);
      return next;
    });
  }, []);

  const ns = theme.nodeStyles[activeNode] ?? theme.nodeStyles.default;
  const grad = ns.gradient ?? {
    type: 'linear' as const,
    from: '#ffffff',
    to: '#cccccc',
    direction: 180,
  };
  const es = theme.edgeStyles.default;

  const handleBaseChange = (name: string) => {
    setBaseName(name);
    setTheme(deepClone(THEMES[name]));
    setActiveNode('default');
  };

  const handleExportJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(theme, null, 2));
    toast.show('Theme JSON copied!');
  };

  const handleExportTS = () => {
    const ts = `import { createTheme } from '@speajus/mermaid-to-svg';\n\nexport const myTheme = createTheme(${JSON.stringify(theme, null, 2)});\n`;
    navigator.clipboard.writeText(ts);
    toast.show('TypeScript copied!');
  };

  return (
    <>
      <header>
        <h1>🎨 Mermaid Theme Builder</h1>
        <p>
          Customize your <code>@speajus/mermaid-to-svg</code> theme with live preview
        </p>
      </header>

      <main>
        <aside className="controls">
          <section>
            <h2>Base Theme</h2>
            <select value={baseName} onChange={(e) => handleBaseChange(e.target.value)}>
              {Object.keys(THEMES).map((k) => (
                <option key={k} value={k}>
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </option>
              ))}
            </select>
          </section>

          <section>
            <h2>Colors</h2>
            {(
              [
                'background',
                'primaryColor',
                'secondaryColor',
                'tertiaryColor',
                'primaryTextColor',
                'secondaryTextColor',
                'lineColor',
                'borderColor',
              ] as const
            ).map((key) => (
              <label key={key}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                <input
                  type="color"
                  value={rgbaToHex(theme[key] as string)}
                  onInput={(e) =>
                    update((t) => {
                      (t as any)[key] = (e.target as HTMLInputElement).value;
                    })
                  }
                />
              </label>
            ))}
          </section>

          <section>
            <h2>Font</h2>
            <label>
              Family
              <select
                value={theme.fontFamily}
                onChange={(e) =>
                  update((t) => {
                    t.fontFamily = e.target.value;
                  })
                }
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Size ({theme.fontSize}px)
              <input
                type="range"
                min={8}
                max={24}
                value={theme.fontSize}
                onInput={(e) =>
                  update((t) => {
                    t.fontSize = Number((e.target as HTMLInputElement).value);
                  })
                }
              />
            </label>
            <label>
              Weight
              <select
                value={String(theme.fontWeight)}
                onChange={(e) =>
                  update((t) => {
                    t.fontWeight = e.target.value;
                  })
                }
              >
                {['normal', 'bold', '300', '500', '700'].map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section>
            <h2>Node Styles</h2>
            <div className="node-tabs">
              {NODE_STYLE_KEYS.map((k) => (
                <button
                  key={k}
                  className={`tab${activeNode === k ? ' active' : ''}`}
                  onClick={() => setActiveNode(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <NodeStyleControls ns={ns} activeNode={activeNode} update={update} />
          </section>

          <section>
            <h2>Node Gradient</h2>
            <GradientControls grad={grad} activeNode={activeNode} update={update} />
          </section>

          <section>
            <h2>Edge Styles</h2>
            <EdgeControls es={es} update={update} />
          </section>

          <section>
            <h2>Export</h2>
            <button className="btn" onClick={handleExportJSON}>
              Copy JSON
            </button>
            <button className="btn" onClick={handleExportTS}>
              Copy TypeScript
            </button>
            <button className="btn btn-outline" onClick={() => handleBaseChange(baseName)}>
              Reset to Base
            </button>
          </section>
        </aside>

        <div className="preview">
          <div className="preview-tabs">
            <button
              className={`tab${previewMode === 'shapes' ? ' active' : ''}`}
              onClick={() => setPreviewMode('shapes')}
            >
              Shape Preview
            </button>
            <button
              className={`tab${previewMode === 'mermaid' ? ' active' : ''}`}
              onClick={() => setPreviewMode('mermaid')}
            >
              Mermaid Diagram
            </button>
          </div>

          {previewMode === 'shapes' ? (
            <div className="svg-preview">
              <SvgPreview theme={theme} />
            </div>
          ) : (
            <>
              <div className="mermaid-input">
                <label htmlFor="mermaidCode">Mermaid Code</label>
                <textarea
                  id="mermaidCode"
                  value={mermaidCode}
                  onChange={(e) => setMermaidCode(e.target.value)}
                  spellCheck={false}
                  placeholder="Enter your mermaid diagram code..."
                />
              </div>
              <div className="svg-preview">
                <MermaidPreview code={mermaidCode} theme={theme} />
              </div>
            </>
          )}

          <details>
            <summary>Theme JSON</summary>
            <pre className="theme-json">{JSON.stringify(theme, null, 2)}</pre>
          </details>
        </div>
      </main>

      <footer>
        <p>
          Built for <a href="https://github.com/speajus/mermaid-to-svg">@speajus/mermaid-to-svg</a>
        </p>
      </footer>

      {toast.msg && <div className="toast show">{toast.msg}</div>}
    </>
  );
}

function NodeStyleControls({
  ns,
  activeNode,
  update,
}: {
  ns: Theme['nodeStyles'][string];
  activeNode: string;
  update: (fn: (t: Theme) => void) => void;
}) {
  return (
    <div>
      <label>
        Fill{' '}
        <input
          type="color"
          value={rgbaToHex(ns.fill)}
          onInput={(e) =>
            update((t) => {
              t.nodeStyles[activeNode].fill = (e.target as HTMLInputElement).value;
            })
          }
        />
      </label>
      <label>
        Stroke{' '}
        <input
          type="color"
          value={rgbaToHex(ns.stroke)}
          onInput={(e) =>
            update((t) => {
              t.nodeStyles[activeNode].stroke = (e.target as HTMLInputElement).value;
            })
          }
        />
      </label>
      <label>
        Text Color{' '}
        <input
          type="color"
          value={rgbaToHex(ns.textColor)}
          onInput={(e) =>
            update((t) => {
              t.nodeStyles[activeNode].textColor = (e.target as HTMLInputElement).value;
            })
          }
        />
      </label>
      <label>
        Stroke Width ({ns.strokeWidth})
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={ns.strokeWidth}
          onInput={(e) =>
            update((t) => {
              t.nodeStyles[activeNode].strokeWidth = Number((e.target as HTMLInputElement).value);
            })
          }
        />
      </label>
      <label>
        Padding ({ns.padding})
        <input
          type="range"
          min={4}
          max={30}
          value={ns.padding}
          onInput={(e) =>
            update((t) => {
              t.nodeStyles[activeNode].padding = Number((e.target as HTMLInputElement).value);
            })
          }
        />
      </label>
      <label>
        Corner Radius ({ns.rx ?? 0})
        <input
          type="range"
          min={0}
          max={30}
          value={ns.rx ?? 0}
          onInput={(e) =>
            update((t) => {
              const v = Number((e.target as HTMLInputElement).value);
              t.nodeStyles[activeNode].rx = v;
              t.nodeStyles[activeNode].ry = v;
            })
          }
        />
      </label>
    </div>
  );
}

function GradientControls({
  grad,
  activeNode,
  update,
}: {
  grad: NonNullable<Theme['nodeStyles'][string]['gradient']>;
  activeNode: string;
  update: (fn: (t: Theme) => void) => void;
}) {
  const ensure = (t: Theme) => {
    if (!t.nodeStyles[activeNode].gradient) {
      t.nodeStyles[activeNode].gradient = {
        type: 'linear',
        from: '#ffffff',
        to: '#cccccc',
        direction: 180,
      };
    }
    return t.nodeStyles[activeNode].gradient!;
  };
  return (
    <div>
      <label>
        Type
        <select
          value={grad.type}
          onChange={(e) =>
            update((t) => {
              ensure(t).type = e.target.value as 'linear' | 'radial';
            })
          }
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </label>
      <label>
        From{' '}
        <input
          type="color"
          value={rgbaToHex(grad.from)}
          onInput={(e) =>
            update((t) => {
              ensure(t).from = (e.target as HTMLInputElement).value;
            })
          }
        />
      </label>
      <label>
        To{' '}
        <input
          type="color"
          value={rgbaToHex(grad.to)}
          onInput={(e) =>
            update((t) => {
              ensure(t).to = (e.target as HTMLInputElement).value;
            })
          }
        />
      </label>
      <label>
        Direction ({grad.direction ?? 180}°)
        <input
          type="range"
          min={0}
          max={360}
          value={grad.direction ?? 180}
          onInput={(e) =>
            update((t) => {
              ensure(t).direction = Number((e.target as HTMLInputElement).value);
            })
          }
        />
      </label>
    </div>
  );
}

function EdgeControls({
  es,
  update,
}: {
  es: Theme['edgeStyles'][string];
  update: (fn: (t: Theme) => void) => void;
}) {
  const updateAll = (key: string, val: string | number) => {
    update((t) => {
      for (const edgeKey of Object.keys(t.edgeStyles)) {
        (t.edgeStyles[edgeKey] as any)[key] = val;
      }
    });
  };
  return (
    <div>
      <label>
        Stroke{' '}
        <input
          type="color"
          value={rgbaToHex(es.stroke)}
          onInput={(e) => updateAll('stroke', (e.target as HTMLInputElement).value)}
        />
      </label>
      <label>
        Stroke Width ({es.strokeWidth})
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={es.strokeWidth}
          onInput={(e) => updateAll('strokeWidth', Number((e.target as HTMLInputElement).value))}
        />
      </label>
      <label>
        Arrow Color{' '}
        <input
          type="color"
          value={rgbaToHex(es.arrowColor)}
          onInput={(e) => updateAll('arrowColor', (e.target as HTMLInputElement).value)}
        />
      </label>
      <label>
        Label Background{' '}
        <input
          type="color"
          value={rgbaToHex(es.labelBackground)}
          onInput={(e) => updateAll('labelBackground', (e.target as HTMLInputElement).value)}
        />
      </label>
      <label>
        Label Color{' '}
        <input
          type="color"
          value={rgbaToHex(es.labelColor)}
          onInput={(e) => updateAll('labelColor', (e.target as HTMLInputElement).value)}
        />
      </label>
    </div>
  );
}
