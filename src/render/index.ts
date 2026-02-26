import type { LayoutResult, Theme } from '../types.js';
import type { AnyLayoutResult } from '../layout/index.js';
import { renderFlowchartSvg } from './flowchart.js';
import { renderSequenceSvg } from './sequence.js';
import { renderClassSvg } from './class.js';
import { renderStateSvg } from './state.js';
import { renderERSvg } from './er.js';
import { renderGanttSvg } from './gantt.js';
import { renderPieSvg } from './pie.js';
import { renderMindmapSvg } from './mindmap.js';

/**
 * Render a positioned layout into an SVG string.
 */
export function renderSvg(layout: AnyLayoutResult, theme: Theme, idPrefix: string = 'mermaid'): string {
  switch (layout.diagramType) {
    case 'flowchart': return renderFlowchartSvg(layout as LayoutResult, theme, idPrefix);
    case 'sequence': return renderSequenceSvg(layout as any, theme, idPrefix);
    case 'class': return renderClassSvg(layout as any, theme, idPrefix);
    case 'state': return renderStateSvg(layout as any, theme, idPrefix);
    case 'er': return renderERSvg(layout as any, theme, idPrefix);
    case 'gantt': return renderGanttSvg(layout as any, theme, idPrefix);
    case 'pie': return renderPieSvg(layout as any, theme, idPrefix);
    case 'mindmap': return renderMindmapSvg(layout as any, theme, idPrefix);
    default:
      throw new Error(`Renderer not implemented for diagram type: ${(layout as any).diagramType}`);
  }
}

