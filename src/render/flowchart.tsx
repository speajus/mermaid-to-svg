import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { LayoutResult, Theme } from '../types.js';
import { resolveNodeStyle, resolveEdgeStyle } from '../themes/index.js';
import { SvgRoot, ArrowDefs } from './components/containers.js';
import { NodeShape } from './components/shapes.js';
import { EdgePath } from './components/edges.js';

export function renderFlowchartSvg(layout: LayoutResult, theme: Theme, idPrefix: string): string {
  const { nodes, edges, width, height } = layout;
  const padding = 20;

  const element = (
    <SvgRoot
      width={width}
      height={height}
      padding={padding}
      background={theme.background}
      idPrefix={idPrefix}
    >
      <ArrowDefs idPrefix={idPrefix} theme={theme} />

      {/* Render edges first (behind nodes) */}
      {edges.map((edge) => {
        const edgeStyle = resolveEdgeStyle(theme, edge.type);
        return (
          <EdgePath
            key={edge.id}
            edge={edge}
            style={edgeStyle}
            idPrefix={idPrefix}
            fontSize={theme.fontSize}
            fontFamily={theme.fontFamily}
          />
        );
      })}

      {/* Render nodes */}
      {nodes.map((node) => {
        const nodeStyle = resolveNodeStyle(theme, node.shape);
        return (
          <NodeShape
            key={node.id}
            shape={node.shape}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            label={node.label}
            style={nodeStyle}
            fontSize={theme.fontSize}
            fontFamily={theme.fontFamily}
          />
        );
      })}
    </SvgRoot>
  );

  return renderToStaticMarkup(element);
}

