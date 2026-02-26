import React from 'react';
import type { LayoutResult, Theme } from '../types.js';
import type { AnyLayoutResult } from '../layout/index.js';
import { renderFlowchartSvg, renderFlowchartElement } from './flowchart.js';
import { renderSequenceSvg, renderSequenceElement } from './sequence.js';
import { renderClassSvg, renderClassElement } from './class.js';
import { renderStateSvg, renderStateElement } from './state.js';
import { renderERSvg, renderERElement } from './er.js';
import { renderGanttSvg, renderGanttElement } from './gantt.js';
import { renderPieSvg, renderPieElement } from './pie.js';
import { renderMindmapSvg, renderMindmapElement } from './mindmap.js';

/**
 * Render a positioned layout into an SVG string.
 */
export function renderSvg(
  layout: AnyLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): string {
  switch (layout.diagramType) {
    case 'flowchart':
      return renderFlowchartSvg(layout as LayoutResult, theme, idPrefix);
    case 'sequence':
      return renderSequenceSvg(layout as any, theme, idPrefix);
    case 'class':
      return renderClassSvg(layout as any, theme, idPrefix);
    case 'state':
      return renderStateSvg(layout as any, theme, idPrefix);
    case 'er':
      return renderERSvg(layout as any, theme, idPrefix);
    case 'gantt':
      return renderGanttSvg(layout as any, theme, idPrefix);
    case 'pie':
      return renderPieSvg(layout as any, theme, idPrefix);
    case 'mindmap':
      return renderMindmapSvg(layout as any, theme, idPrefix);
    default:
      throw new Error(`Renderer not implemented for diagram type: ${(layout as any).diagramType}`);
  }
}

/**
 * Render a positioned layout into a React element tree (for use in React apps).
 */
export function renderElement(
  layout: AnyLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): React.ReactElement {
  switch (layout.diagramType) {
    case 'flowchart':
      return renderFlowchartElement(layout as LayoutResult, theme, idPrefix);
    case 'sequence':
      return renderSequenceElement(layout as any, theme, idPrefix);
    case 'class':
      return renderClassElement(layout as any, theme, idPrefix);
    case 'state':
      return renderStateElement(layout as any, theme, idPrefix);
    case 'er':
      return renderERElement(layout as any, theme, idPrefix);
    case 'gantt':
      return renderGanttElement(layout as any, theme, idPrefix);
    case 'pie':
      return renderPieElement(layout as any, theme, idPrefix);
    case 'mindmap':
      return renderMindmapElement(layout as any, theme, idPrefix);
    default:
      throw new Error(`Renderer not implemented for diagram type: ${(layout as any).diagramType}`);
  }
}
