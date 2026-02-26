import React from 'react';
import type { Theme } from '../types.js';
import type { PieLayoutResult } from '../layout/pie-layout.js';

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle) };
  const end = { x: cx + r * Math.cos(endAngle), y: cy + r * Math.sin(endAngle) };
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${cx},${cy} L ${start.x},${start.y} A ${r},${r} 0 ${largeArc} 1 ${end.x},${end.y} Z`;
}

export function renderPieElement(
  layout: PieLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): React.ReactElement {
  const { centerX, centerY, radius, slices, title } = layout;
  const legendX = centerX + radius + 30;
  const legendItemH = 22;

  return (
    <>
      {/* Title */}
      {title && (
        <text
          x={layout.width / 2}
          y={24}
          textAnchor="middle"
          fontSize={theme.fontSize * 1.2}
          fontWeight="bold"
          fontFamily={theme.fontFamily}
          fill={theme.primaryTextColor}
        >
          {title}
        </text>
      )}
      {/* Slices */}
      {slices.map((s, i) => {
        const d = describeArc(centerX, centerY, radius, s.startAngle, s.endAngle);
        return <path key={i} d={d} fill={s.color} stroke={theme.background} strokeWidth={2} />;
      })}
      {/* Percentage labels on slices */}
      {slices.map((s, i) => {
        const midAngle = (s.startAngle + s.endAngle) / 2;
        const labelR = radius * 0.65;
        const lx = centerX + labelR * Math.cos(midAngle);
        const ly = centerY + labelR * Math.sin(midAngle);
        const pct = (s.percentage * 100).toFixed(1);
        return s.percentage > 0.04 ? (
          <text
            key={`lbl-${i}`}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={theme.fontSize * 0.8}
            fontWeight="bold"
            fontFamily={theme.fontFamily}
            fill="#fff"
          >
            {pct}%
          </text>
        ) : null;
      })}
      {/* Legend */}
      {slices.map((s, i) => (
        <g key={`legend-${i}`}>
          <rect
            x={legendX}
            y={centerY - (slices.length * legendItemH) / 2 + i * legendItemH}
            width={14}
            height={14}
            fill={s.color}
            rx={2}
          />
          <text
            x={legendX + 20}
            y={centerY - (slices.length * legendItemH) / 2 + i * legendItemH + 10}
            fontSize={theme.fontSize * 0.85}
            fontFamily={theme.fontFamily}
            fill={theme.primaryTextColor}
          >
            {s.label}
          </text>
        </g>
      ))}
    </>
  );
}
