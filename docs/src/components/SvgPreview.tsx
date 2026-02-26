import type { Theme, Gradient } from '../themes';

function buildGradientDef(id: string, grad: Gradient) {
  if (grad.type === 'radial') {
    return (
      <radialGradient key={id} id={id} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={grad.from} />
        <stop offset="100%" stopColor={grad.to} />
      </radialGradient>
    );
  }
  const angle = grad.direction ?? 180;
  const rad = (angle * Math.PI) / 180;
  const x1 = `${50 - 50 * Math.sin(rad)}%`;
  const y1 = `${50 - 50 * Math.cos(rad)}%`;
  const x2 = `${50 + 50 * Math.sin(rad)}%`;
  const y2 = `${50 + 50 * Math.cos(rad)}%`;
  return (
    <linearGradient key={id} id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0%" stopColor={grad.from} />
      <stop offset="100%" stopColor={grad.to} />
    </linearGradient>
  );
}

export function SvgPreview({ theme }: { theme: Theme }) {
  const { nodeStyles: ns, edgeStyles, fontFamily: ff, fontSize: fs, fontWeight: fw } = theme;
  const es = edgeStyles.default;
  const d = ns.default;
  const r = ns.rounded;
  const ci = ns.circle;

  const gradients = Object.entries(ns)
    .filter(([, s]) => s.gradient)
    .map(([key, s]) => buildGradientDef(`grad-${key}`, s.gradient!));

  const W = 620, H = 420;
  const textProps = { fontFamily: ff, fontSize: fs, fontWeight: String(fw) };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ background: theme.background }}>
      <defs>
        {gradients}
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={es.arrowColor} />
        </marker>
      </defs>

      {/* Default rect */}
      <rect x={40} y={30} width={140} height={50} rx={d.rx ?? 0} ry={d.ry ?? 0}
        fill={d.gradient ? 'url(#grad-default)' : d.fill} stroke={d.stroke} strokeWidth={d.strokeWidth} />
      <text x={110} y={60} textAnchor="middle" fill={d.textColor} {...textProps}>Default</text>

      {/* Rounded */}
      <rect x={240} y={30} width={140} height={50} rx={r.rx ?? 0} ry={r.ry ?? 0}
        fill={r.gradient ? 'url(#grad-rounded)' : r.fill} stroke={r.stroke} strokeWidth={r.strokeWidth} />
      <text x={310} y={60} textAnchor="middle" fill={r.textColor} {...textProps}>Rounded</text>

      {/* Circle */}
      <circle cx={500} cy={55} r={30}
        fill={ci.gradient ? 'url(#grad-circle)' : ci.fill} stroke={ci.stroke} strokeWidth={ci.strokeWidth} />
      <text x={500} y={60} textAnchor="middle" fill={ci.textColor} {...textProps}>Circle</text>

      {/* Decision diamond */}
      {(() => {
        const dn = ns.decision;
        return <>
          <polygon points="310,130 380,170 310,210 240,170"
            fill={dn.gradient ? 'url(#grad-decision)' : dn.fill} stroke={dn.stroke} strokeWidth={dn.strokeWidth} />
          <text x={310} y={175} textAnchor="middle" fill={dn.textColor} {...textProps}>Decision</text>
        </>;
      })()}

      {/* Cylinder */}
      {(() => {
        const cy = ns.cylinder;
        return <>
          <ellipse cx={100} cy={140} rx={55} ry={12}
            fill={cy.gradient ? 'url(#grad-cylinder)' : cy.fill} stroke={cy.stroke} strokeWidth={cy.strokeWidth} />
          <rect x={45} y={140} width={110} height={50}
            fill={cy.gradient ? 'url(#grad-cylinder)' : cy.fill} stroke="none" />
          <line x1={45} y1={140} x2={45} y2={190} stroke={cy.stroke} strokeWidth={cy.strokeWidth} />
          <line x1={155} y1={140} x2={155} y2={190} stroke={cy.stroke} strokeWidth={cy.strokeWidth} />
          <ellipse cx={100} cy={190} rx={55} ry={12}
            fill={cy.gradient ? 'url(#grad-cylinder)' : cy.fill} stroke={cy.stroke} strokeWidth={cy.strokeWidth} />
          <text x={100} y={170} textAnchor="middle" fill={cy.textColor} {...textProps}>Cylinder</text>
        </>;
      })()}

      {/* Subroutine */}
      {(() => {
        const sub = ns.subroutine;
        return <>
          <rect x={430} y={145} width={150} height={50}
            fill={sub.gradient ? 'url(#grad-subroutine)' : sub.fill} stroke={sub.stroke} strokeWidth={sub.strokeWidth} />
          <line x1={442} y1={145} x2={442} y2={195} stroke={sub.stroke} strokeWidth={sub.strokeWidth} />
          <line x1={568} y1={145} x2={568} y2={195} stroke={sub.stroke} strokeWidth={sub.strokeWidth} />
          <text x={505} y={175} textAnchor="middle" fill={sub.textColor} {...textProps}>Subroutine</text>
        </>;
      })()}

      {/* Edges */}
      <line x1={180} y1={55} x2={240} y2={55} stroke={es.stroke} strokeWidth={es.strokeWidth} markerEnd="url(#arrowhead)" />
      <line x1={110} y1={80} x2={110} y2={128} stroke={es.stroke} strokeWidth={es.strokeWidth} markerEnd="url(#arrowhead)" />
      <line x1={155} y1={165} x2={240} y2={170} stroke={es.stroke} strokeWidth={es.strokeWidth} markerEnd="url(#arrowhead)" />

      {/* Edge label */}
      <rect x={170} y={88} width={40} height={18} rx={3} fill={es.labelBackground} />
      <text x={190} y={101} textAnchor="middle" fill={es.labelColor} fontSize={fs - 2}>yes</text>

      {/* Subgraph */}
      <rect x={20} y={290} width={580} height={100} rx={8} fill="none"
        stroke={theme.borderColor} strokeWidth={1} strokeDasharray="6,3" />
      <text x={30} y={310} fill={theme.secondaryTextColor} {...textProps} fontSize={fs - 2}>Subgraph</text>

      <rect x={40} y={325} width={120} height={40} rx={d.rx ?? 0} ry={d.ry ?? 0}
        fill={d.gradient ? 'url(#grad-default)' : d.fill} stroke={d.stroke} strokeWidth={d.strokeWidth} />
      <text x={100} y={350} textAnchor="middle" fill={d.textColor} {...textProps}>Node A</text>

      <rect x={240} y={325} width={120} height={40} rx={r.rx ?? 0} ry={r.ry ?? 0}
        fill={r.gradient ? 'url(#grad-rounded)' : r.fill} stroke={r.stroke} strokeWidth={r.strokeWidth} />
      <text x={300} y={350} textAnchor="middle" fill={r.textColor} {...textProps}>Node B</text>

      <line x1={160} y1={345} x2={240} y2={345} stroke={es.stroke} strokeWidth={es.strokeWidth} markerEnd="url(#arrowhead)" />
    </svg>
  );
}

