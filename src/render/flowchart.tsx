import React from 'react';
import type { LayoutResult, Theme } from '../types.js';
import { resolveNodeStyleKey, resolveEdgeStyle } from '../themes/index.js';
import { ArrowDefs } from './components/containers.js';
import { NodeShape } from './components/shapes.js';
import { EdgePath } from './components/edges.js';

export function renderFlowchartElement(layout: LayoutResult, theme: Theme, idPrefix: string): React.ReactElement {
  const { nodes, edges } = layout;

  return (
    <>
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
        const styleKey = resolveNodeStyleKey(node.shape);
        const nodeStyle = theme.nodeStyles[styleKey] ?? theme.nodeStyles.default;
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
            idPrefix={idPrefix}
            styleKey={theme.nodeStyles[styleKey] ? styleKey : 'default'}
          />
        );
      })}
    </>
  );
}

