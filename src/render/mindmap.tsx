import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Theme } from '../types.js';
import type { MindmapLayoutResult, MindmapNodeLayout } from '../layout/mindmap-layout.js';

const LEVEL_COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949'];

function MindmapNodeComponent({
  node,
  theme,
  depth,
}: {
  node: MindmapNodeLayout;
  theme: Theme;
  depth: number;
}) {
  const color = LEVEL_COLORS[depth % LEVEL_COLORS.length];
  const cx = node.x + node.width / 2;
  const cy = node.y + node.height / 2;

  let shape: React.ReactNode;
  if (node.type === 'circle' || node.isRoot) {
    const r = Math.max(node.width, node.height) / 2;
    shape = (
      <ellipse
        cx={cx}
        cy={cy}
        rx={node.width / 2}
        ry={node.height / 2}
        fill={color}
        stroke={theme.borderColor}
        strokeWidth={1.5}
        opacity={0.85}
      />
    );
  } else if (node.type === 'rect') {
    shape = (
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={color}
        stroke={theme.borderColor}
        strokeWidth={1.5}
        opacity={0.85}
      />
    );
  } else if (node.type === 'hexagon') {
    const pad = 8;
    const pts = `${node.x + pad},${node.y} ${node.x + node.width - pad},${node.y} ${node.x + node.width},${cy} ${node.x + node.width - pad},${node.y + node.height} ${node.x + pad},${node.y + node.height} ${node.x},${cy}`;
    shape = (
      <polygon
        points={pts}
        fill={color}
        stroke={theme.borderColor}
        strokeWidth={1.5}
        opacity={0.85}
      />
    );
  } else if (node.type === 'cloud') {
    shape = (
      <ellipse
        cx={cx}
        cy={cy}
        rx={node.width / 2 + 4}
        ry={node.height / 2 + 4}
        fill={color}
        stroke={theme.borderColor}
        strokeWidth={1.5}
        opacity={0.85}
        strokeDasharray="4,3"
      />
    );
  } else if (node.type === 'bang') {
    shape = (
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={color}
        stroke={theme.borderColor}
        strokeWidth={2}
        opacity={0.85}
        rx={0}
        ry={0}
      />
    );
  } else {
    // default / rounded_rect
    shape = (
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={color}
        stroke={theme.borderColor}
        strokeWidth={1.5}
        opacity={0.85}
        rx={10}
        ry={10}
      />
    );
  }

  return (
    <g>
      {/* Connector lines to children */}
      {node.children.map((child) => (
        <line
          key={`link-${child.id}`}
          x1={node.x + node.width}
          y1={cy}
          x2={child.x}
          y2={child.y + child.height / 2}
          stroke={theme.lineColor}
          strokeWidth={1.5}
          opacity={0.6}
        />
      ))}
      {shape}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={node.isRoot ? theme.fontSize * 1.1 : theme.fontSize * 0.9}
        fontWeight={node.isRoot ? 'bold' : 'normal'}
        fontFamily={theme.fontFamily}
        fill="#fff"
      >
        {node.label}
      </text>
      {node.children.map((child) => (
        <MindmapNodeComponent key={child.id} node={child} theme={theme} depth={depth + 1} />
      ))}
    </g>
  );
}

export function renderMindmapElement(
  layout: MindmapLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={layout.width}
      height={layout.height}
      style={{ background: theme.background }}
    >
      <MindmapNodeComponent node={layout.root} theme={theme} depth={0} />
    </svg>
  );
}

export function renderMindmapSvg(
  layout: MindmapLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): string {
  return renderToStaticMarkup(renderMindmapElement(layout, theme, idPrefix));
}
