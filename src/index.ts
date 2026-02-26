export type {
  DiagramType, DiagramIR, FlowchartIR,
  SequenceIR, SequenceParticipant, SequenceMessage, SequenceNote, SequenceActivation, SequenceBlock,
  ClassIR, ClassDef, ClassMember, ClassRelationship,
  StateIR, StateDef, StateTransition,
  IRNode, IREdge, IRSubgraph, NodeShape,
  LayoutResult, PositionedNode, PositionedEdge, PositionedSubgraph,
  Theme, NodeStyle, EdgeStyle,
  FontMetricsProvider, TextMetrics,
  RenderOptions, RenderResult, LayoutOptions,
} from './types.js';

export { createTheme, mergeThemes, defaultTheme, darkTheme, forestTheme, neutralTheme } from './themes/index.js';

import { parse as parseDiagram } from './parse/index.js';
import { layout as layoutDiagram } from './layout/index.js';
import { renderSvg as renderDiagramSvg } from './render/index.js';
import { resolveTheme } from './themes/index.js';
import type { DiagramIR, LayoutOptions, RenderOptions, RenderResult, Theme } from './types.js';
import type { AnyLayoutResult } from './layout/index.js';

export { parseDiagram as parse };
export { layoutDiagram as layout };

/**
 * Render a layout result to SVG string.
 */
export function renderSvg(layoutResult: AnyLayoutResult, theme?: Theme, idPrefix?: string): string {
  const resolvedTheme = resolveTheme(theme ?? 'default');
  return renderDiagramSvg(layoutResult, resolvedTheme, idPrefix);
}

/**
 * Main API: Render mermaid text to SVG in one call.
 *
 * Pipeline: parse → layout → render
 */
export async function renderMermaid(input: string, options?: RenderOptions): Promise<RenderResult> {
  const theme = resolveTheme(options?.theme);
  const idPrefix = options?.idPrefix ?? 'mermaid';

  // 1. Parse
  const ir: DiagramIR = await parseDiagram(input);

  // 2. Layout
  const layoutOptions: LayoutOptions = {
    layoutOptions: options?.layoutOptions,
    fontMetrics: options?.fontMetrics,
    padding: options?.padding,
  };
  const layoutResult = await layoutDiagram(ir, layoutOptions);

  // 3. Render
  const svg = renderDiagramSvg(layoutResult, theme, idPrefix);

  return {
    svg,
    bounds: { width: layoutResult.width, height: layoutResult.height },
    diagramType: ir.type,
  };
}

