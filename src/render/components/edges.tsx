import React from 'react';
import type { EdgeStyle, PositionedEdge } from '../../types.js';
import { EdgeLabel } from './text.js';

interface EdgePathProps {
  edge: PositionedEdge;
  style: EdgeStyle;
  idPrefix: string;
  fontSize: number;
  fontFamily: string;
}

/** Build an SVG path from edge points */
function buildPathData(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  const parts = [`M ${points[0].x},${points[0].y}`];
  for (let i = 1; i < points.length; i++) {
    parts.push(`L ${points[i].x},${points[i].y}`);
  }
  return parts.join(' ');
}

/** Resolve marker URL for the arrow head type */
function resolveMarkerEnd(arrowHead: string, idPrefix: string): string | undefined {
  switch (arrowHead) {
    case 'arrow': return `url(#${idPrefix}-arrow)`;
    case 'open': return `url(#${idPrefix}-arrow-open)`;
    case 'cross': return `url(#${idPrefix}-arrow-cross)`;
    case 'circle': return `url(#${idPrefix}-arrow-circle)`;
    case 'none': return undefined;
    default: return `url(#${idPrefix}-arrow)`;
  }
}

export function EdgePath({ edge, style, idPrefix, fontSize, fontFamily }: EdgePathProps) {
  const pathData = buildPathData(edge.points);
  const markerEnd = resolveMarkerEnd(edge.arrowHead, idPrefix);

  // Compute label position at midpoint of edge
  let labelElement = null;
  if (edge.label && edge.points.length >= 2) {
    const midIdx = Math.floor(edge.points.length / 2);
    const midPoint = edge.points.length % 2 === 0
      ? {
          x: (edge.points[midIdx - 1].x + edge.points[midIdx].x) / 2,
          y: (edge.points[midIdx - 1].y + edge.points[midIdx].y) / 2,
        }
      : edge.points[midIdx];

    labelElement = (
      <EdgeLabel
        x={midPoint.x}
        y={midPoint.y}
        text={edge.label}
        fontSize={fontSize * 0.9}
        fontFamily={fontFamily}
        fill={style.labelColor}
        background={style.labelBackground}
      />
    );
  }

  return (
    <g>
      <path
        d={pathData}
        fill="none"
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.strokeDasharray}
        markerEnd={markerEnd}
      />
      {labelElement}
    </g>
  );
}

