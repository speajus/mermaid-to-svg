import type { LayoutResult, Theme } from '../types.js';
import { renderFlowchartSvg } from './flowchart.js';

/**
 * Render a positioned layout into an SVG string.
 */
export function renderSvg(layout: LayoutResult, theme: Theme, idPrefix: string = 'mermaid'): string {
  switch (layout.diagramType) {
    case 'flowchart':
      return renderFlowchartSvg(layout, theme, idPrefix);
    default:
      throw new Error(`Renderer not implemented for diagram type: ${layout.diagramType}`);
  }
}

