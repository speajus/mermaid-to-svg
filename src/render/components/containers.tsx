import React from 'react';
import type { Theme } from '../../types.js';

interface SvgRootProps {
  width: number;
  height: number;
  padding: number;
  background: string;
  idPrefix: string;
  children: React.ReactNode;
}

export function SvgRoot({ width, height, padding, background, idPrefix, children }: SvgRootProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
    >
      <rect width={width} height={height} fill={background} />
      <g transform={`translate(${padding}, ${padding})`}>
        {children}
      </g>
    </svg>
  );
}

interface ArrowDefsProps {
  idPrefix: string;
  theme: Theme;
}

export function ArrowDefs({ idPrefix, theme }: ArrowDefsProps) {
  const color = theme.edgeStyles.default.arrowColor;
  return (
    <defs>
      <marker
        id={`${idPrefix}-arrow`}
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
      </marker>
      <marker
        id={`${idPrefix}-arrow-open`}
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke={color} strokeWidth="1.5" />
      </marker>
      <marker
        id={`${idPrefix}-arrow-cross`}
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <path d="M 2 2 L 8 8 M 8 2 L 2 8" fill="none" stroke={color} strokeWidth="1.5" />
      </marker>
      <marker
        id={`${idPrefix}-arrow-circle`}
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
      >
        <circle cx="5" cy="5" r="4" fill={color} />
      </marker>
    </defs>
  );
}

