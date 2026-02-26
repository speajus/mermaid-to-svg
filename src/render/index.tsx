import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { LayoutResult, Theme } from '../types.js';
import type { AnyLayoutResult } from '../layout/index.js';
import { SvgRoot } from './components/containers.js';
import { renderFlowchartElement } from './flowchart.js';
import { renderSequenceElement } from './sequence.js';
import { renderClassElement } from './class.js';
import { renderStateElement } from './state.js';
import { renderERElement } from './er.js';
import { renderGanttElement } from './gantt.js';
import { renderPieElement } from './pie.js';
import { renderMindmapElement } from './mindmap.js';

function DiagramContent({
  layout,
  theme,
  idPrefix,
}: {
  layout: AnyLayoutResult;
  theme: Theme;
  idPrefix: string;
}): React.ReactElement {
  switch (layout.diagramType) {
    case 'flowchart':
      return <>{renderFlowchartElement(layout as LayoutResult, theme, idPrefix)}</>;
    case 'sequence':
      return <>{renderSequenceElement(layout as any, theme, idPrefix)}</>;
    case 'class':
      return <>{renderClassElement(layout as any, theme, idPrefix)}</>;
    case 'state':
      return <>{renderStateElement(layout as any, theme, idPrefix)}</>;
    case 'er':
      return <>{renderERElement(layout as any, theme, idPrefix)}</>;
    case 'gantt':
      return <>{renderGanttElement(layout as any, theme, idPrefix)}</>;
    case 'pie':
      return <>{renderPieElement(layout as any, theme, idPrefix)}</>;
    case 'mindmap':
      return <>{renderMindmapElement(layout as any, theme, idPrefix)}</>;
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
  return (
    <SvgRoot
      width={layout.width}
      height={layout.height}
      background={theme.background}
      idPrefix={idPrefix}
    >
      <DiagramContent layout={layout} theme={theme} idPrefix={idPrefix} />
    </SvgRoot>
  );
}

/**
 * Render a positioned layout into an SVG string.
 */
export function renderSvg(
  layout: AnyLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): string {
  return renderToStaticMarkup(
    <SvgRoot
      width={layout.width}
      height={layout.height}
      background={theme.background}
      idPrefix={idPrefix}
    >
      <DiagramContent layout={layout} theme={theme} idPrefix={idPrefix} />
    </SvgRoot>,
  );
}
