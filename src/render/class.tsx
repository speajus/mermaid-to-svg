import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Theme } from '../types.js';
import type { ClassLayoutResult, ClassNodeLayout } from '../layout/class-layout.js';
import { resolveEdgeStyle } from '../themes/index.js';

function ClassBox({ node, theme }: { node: ClassNodeLayout; theme: Theme }) {
  const style = theme.nodeStyles.default;
  const fontSize = theme.fontSize;
  const lineH = fontSize * 1.5;
  const [nameH, membersH, methodsH] = node.compartmentHeights;

  return (
    <g>
      {/* Background */}
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />

      {/* Annotation */}
      {node.annotations.map((a, i) => (
        <text
          key={`a-${i}`}
          x={node.x + node.width / 2}
          y={node.y + fontSize + 2}
          textAnchor="middle"
          fontSize={fontSize * 0.8}
          fontFamily={theme.fontFamily}
          fill={style.textColor}
          fontStyle="italic"
        >
          {'«' + a + '»'}
        </text>
      ))}

      {/* Class name */}
      <text
        x={node.x + node.width / 2}
        y={node.y + (node.annotations.length > 0 ? lineH : 0) + nameH / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
        fontSize={fontSize}
        fontFamily={theme.fontFamily}
        fill={style.textColor}
      >
        {node.label}
      </text>

      {/* Divider after name */}
      <line
        x1={node.x}
        y1={node.y + nameH}
        x2={node.x + node.width}
        y2={node.y + nameH}
        stroke={style.stroke}
        strokeWidth={1}
      />

      {/* Attributes */}
      {node.members.map((m, i) => (
        <text
          key={`m-${i}`}
          x={node.x + 8}
          y={node.y + nameH + 4 + (i + 0.7) * lineH}
          fontSize={fontSize * 0.85}
          fontFamily={theme.fontFamily}
          fill={style.textColor}
        >
          {m.text}
        </text>
      ))}

      {/* Divider after attributes */}
      <line
        x1={node.x}
        y1={node.y + nameH + membersH}
        x2={node.x + node.width}
        y2={node.y + nameH + membersH}
        stroke={style.stroke}
        strokeWidth={1}
      />

      {/* Methods */}
      {node.methods.map((m, i) => (
        <text
          key={`mt-${i}`}
          x={node.x + 8}
          y={node.y + nameH + membersH + 4 + (i + 0.7) * lineH}
          fontSize={fontSize * 0.85}
          fontFamily={theme.fontFamily}
          fill={style.textColor}
        >
          {m.text}
        </text>
      ))}
    </g>
  );
}

export function renderClassElement(layout: ClassLayoutResult, theme: Theme, idPrefix: string): React.ReactElement {
  const { width, height, classNodes, edges } = layout;
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
        <marker
          id={`${idPrefix}-arrow-inherit`}
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 Z"
            fill={theme.background}
            stroke={theme.edgeStyles.default.arrowColor}
            strokeWidth="1"
          />
        </marker>
        <marker
          id={`${idPrefix}-diamond`}
          viewBox="0 0 12 8"
          refX="12"
          refY="4"
          markerWidth="12"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 4 L 6 0 L 12 4 L 6 8 Z" fill={theme.edgeStyles.default.arrowColor} />
        </marker>
        <marker
          id={`${idPrefix}-diamond-open`}
          viewBox="0 0 12 8"
          refX="12"
          refY="4"
          markerWidth="12"
          markerHeight="8"
          orient="auto"
        >
          <path
            d="M 0 4 L 6 0 L 12 4 L 6 8 Z"
            fill={theme.background}
            stroke={theme.edgeStyles.default.arrowColor}
            strokeWidth="1"
          />
        </marker>
      </defs>
      <g transform={`translate(${padding}, ${padding})`}>
        {/* Edges first */}
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
                strokeDasharray={edgeStyle.strokeDasharray}
                markerEnd={`url(#${idPrefix}-arrow-inherit)`}
              />
              {edge.label && edge.points.length >= 2 && (
                <text
                  x={(edge.points[0].x + edge.points[edge.points.length - 1].x) / 2}
                  y={(edge.points[0].y + edge.points[edge.points.length - 1].y) / 2 - 8}
                  textAnchor="middle"
                  fontSize={theme.fontSize * 0.8}
                  fontFamily={theme.fontFamily}
                  fill={theme.primaryTextColor}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
        {/* Class boxes */}
        {classNodes.map((node) => (
          <ClassBox key={node.id} node={node} theme={theme} />
        ))}
      </g>
    </svg>
  );
}

export function renderClassSvg(layout: ClassLayoutResult, theme: Theme, idPrefix: string): string {
  return renderToStaticMarkup(renderClassElement(layout, theme, idPrefix));
}
