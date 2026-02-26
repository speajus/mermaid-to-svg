import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Theme } from '../types.js';
import type { StateLayoutResult, StateNodeLayout } from '../layout/state-layout.js';
import { resolveEdgeStyle } from '../themes/index.js';

function StateNode({ node, theme }: { node: StateNodeLayout; theme: Theme }) {
  const style = theme.nodeStyles.default;
  const cx = node.x + node.width / 2;
  const cy = node.y + node.height / 2;

  if (node.type === 'start') {
    return <circle cx={cx} cy={cy} r={node.width / 2} fill={theme.lineColor} />;
  }
  if (node.type === 'end') {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={node.width / 2}
          fill="none"
          stroke={theme.lineColor}
          strokeWidth={2}
        />
        <circle cx={cx} cy={cy} r={node.width / 2 - 4} fill={theme.lineColor} />
      </g>
    );
  }
  if (node.type === 'fork' || node.type === 'join') {
    return (
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={theme.lineColor}
        rx={4}
        ry={4}
      />
    );
  }
  if (node.type === 'choice') {
    const points = `${cx},${node.y} ${node.x + node.width},${cy} ${cx},${node.y + node.height} ${node.x},${cy}`;
    return (
      <polygon
        points={points}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />
    );
  }

  // Default state: rounded rectangle
  return (
    <g>
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        rx={12}
        ry={12}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={theme.fontSize}
        fontFamily={theme.fontFamily}
        fill={style.textColor}
      >
        {node.label}
      </text>
    </g>
  );
}

export function renderStateElement(layout: StateLayoutResult, theme: Theme, idPrefix: string): React.ReactElement {
  const { width, height, stateNodes, edges } = layout;
  const padding = 20;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
    >
      <rect width={width} height={height} fill={theme.background} />
      <defs>
        <marker
          id={`${idPrefix}-arrow`}
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={theme.edgeStyles.default.arrowColor} />
        </marker>
      </defs>
      <g transform={`translate(${padding}, ${padding})`}>
        {/* Edges */}
        {edges.map((edge) => {
          const edgeStyle = resolveEdgeStyle(theme, edge.type);
          const d = edge.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
          return (
            <g key={edge.id}>
              <path
                d={d}
                fill="none"
                stroke={edgeStyle.stroke}
                strokeWidth={edgeStyle.strokeWidth}
                markerEnd={`url(#${idPrefix}-arrow)`}
              />
              {edge.label &&
                edge.points.length >= 2 &&
                (() => {
                  const mid = Math.floor(edge.points.length / 2);
                  const pt = edge.points[mid];
                  return (
                    <text
                      x={pt.x + 5}
                      y={pt.y - 5}
                      fontSize={theme.fontSize * 0.85}
                      fontFamily={theme.fontFamily}
                      fill={theme.primaryTextColor}
                    >
                      {edge.label}
                    </text>
                  );
                })()}
            </g>
          );
        })}
        {/* State nodes */}
        {stateNodes.map((node) => (
          <StateNode key={node.id} node={node} theme={theme} />
        ))}
      </g>
    </svg>
  );
}

export function renderStateSvg(layout: StateLayoutResult, theme: Theme, idPrefix: string): string {
  return renderToStaticMarkup(renderStateElement(layout, theme, idPrefix));
}
