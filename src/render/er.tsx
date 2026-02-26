import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Theme } from '../types.js';
import type { ERLayoutResult, EREntityLayout } from '../layout/er-layout.js';
import { resolveEdgeStyle } from '../themes/index.js';

function EREntity({ entity, theme }: { entity: EREntityLayout; theme: Theme }) {
  const style = theme.nodeStyles.default;
  const headerH = 32;
  const rowH = 20;

  return (
    <g>
      <rect x={entity.x} y={entity.y} width={entity.width} height={entity.height}
        fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} rx={2} ry={2} />
      {/* Header */}
      <rect x={entity.x} y={entity.y} width={entity.width} height={headerH}
        fill={style.fill} stroke={style.stroke} strokeWidth={style.strokeWidth} rx={2} ry={2} />
      <text x={entity.x + entity.width / 2} y={entity.y + headerH / 2}
        textAnchor="middle" dominantBaseline="central"
        fontSize={theme.fontSize} fontWeight="bold" fontFamily={theme.fontFamily}
        fill={style.textColor}>{entity.label}</text>
      {/* Separator */}
      <line x1={entity.x} y1={entity.y + headerH} x2={entity.x + entity.width} y2={entity.y + headerH}
        stroke={style.stroke} strokeWidth={1} />
      {/* Attributes */}
      {entity.attributes.map((attr, i) => (
        <text key={i} x={entity.x + 8} y={entity.y + headerH + (i + 0.5) * rowH + 4}
          fontSize={theme.fontSize * 0.85} fontFamily={theme.fontFamily}
          fill={style.textColor} dominantBaseline="central">
          {attr.keys.length > 0 ? `${attr.keys.join(',')} ` : ''}{attr.type} {attr.name}
        </text>
      ))}
    </g>
  );
}

function cardinalityMarker(card: string): string {
  switch (card) {
    case 'ZERO_OR_ONE': return '|o';
    case 'ZERO_OR_MORE': return '}o';
    case 'ONE_OR_MORE': return '}|';
    case 'ONLY_ONE': return '||';
    default: return '';
  }
}

export function renderERSvg(layout: ERLayoutResult, theme: Theme, idPrefix: string = 'mermaid'): string {
  const edgeStyle = resolveEdgeStyle(theme, 'default');

  const svg = (
    <svg xmlns="http://www.w3.org/2000/svg" width={layout.width} height={layout.height}
      style={{ background: theme.background }}>
      <defs>
        <marker id={`${idPrefix}-er-arrow`} viewBox="0 0 10 10" refX="10" refY="5"
          markerWidth={8} markerHeight={8} orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={edgeStyle.stroke} />
        </marker>
      </defs>
      {/* Edges */}
      {layout.relationships.map((r, i) => {
        if (r.points.length < 2) return null;
        const d = r.points.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
        const midIdx = Math.floor(r.points.length / 2);
        const mid = r.points[midIdx];
        const isDotted = r.relType === 'NON_IDENTIFYING';
        return (
          <g key={`edge-${i}`}>
            <path d={d} fill="none" stroke={edgeStyle.stroke} strokeWidth={edgeStyle.strokeWidth}
              strokeDasharray={isDotted ? '5,5' : undefined} />
            {/* Cardinality labels */}
            <text x={r.points[0].x} y={r.points[0].y - 8} fontSize={theme.fontSize * 0.75}
              fontFamily={theme.fontFamily} fill={theme.primaryTextColor} textAnchor="middle">
              {cardinalityMarker(r.cardB)}
            </text>
            <text x={r.points[r.points.length - 1].x} y={r.points[r.points.length - 1].y - 8}
              fontSize={theme.fontSize * 0.75} fontFamily={theme.fontFamily}
              fill={theme.primaryTextColor} textAnchor="middle">
              {cardinalityMarker(r.cardA)}
            </text>
            {/* Role label */}
            {r.roleLabel && (
              <text x={mid.x} y={mid.y - 10} textAnchor="middle"
                fontSize={theme.fontSize * 0.8} fontFamily={theme.fontFamily}
                fill={theme.primaryTextColor}>{r.roleLabel}</text>
            )}
          </g>
        );
      })}
      {/* Entities */}
      {layout.entities.map(e => <EREntity key={e.id} entity={e} theme={theme} />)}
    </svg>
  );

  return renderToStaticMarkup(svg);
}

