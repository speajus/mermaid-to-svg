// ── Diagram Types ──────────────────────────────────────────────────────────

export type DiagramType = 'flowchart' | 'sequence' | 'class' | 'state' | 'er' | 'gantt' | 'pie' | 'mindmap';

export type DiagramIR = FlowchartIR; // expand union as more types are added

// ── Flowchart IR ───────────────────────────────────────────────────────────

export type NodeShape =
  | 'rect' | 'rounded' | 'circle' | 'diamond' | 'hexagon'
  | 'cylinder' | 'stadium' | 'subroutine' | 'odd'
  | 'parallelogram' | 'trapezoid';

export interface IRNode {
  id: string;
  label: string;
  shape: NodeShape;
  cssClasses?: string[];
  style?: Record<string, string>;
}

export interface IREdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'solid' | 'dotted' | 'thick';
  arrowHead: 'arrow' | 'open' | 'cross' | 'circle' | 'none';
  arrowTail?: 'arrow' | 'open' | 'cross' | 'circle' | 'none';
}

export interface IRSubgraph {
  id: string;
  label: string;
  nodeIds: string[];
}

export interface FlowchartIR {
  type: 'flowchart';
  direction: 'TB' | 'BT' | 'LR' | 'RL';
  nodes: IRNode[];
  edges: IREdge[];
  subgraphs: IRSubgraph[];
}

// ── Layout Result ──────────────────────────────────────────────────────────

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  shape: NodeShape;
}

export interface PositionedEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  points: Array<{ x: number; y: number }>;
  type: 'solid' | 'dotted' | 'thick';
  arrowHead: 'arrow' | 'open' | 'cross' | 'circle' | 'none';
}

export interface PositionedSubgraph {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutResult {
  diagramType: DiagramType;
  nodes: PositionedNode[];
  edges: PositionedEdge[];
  subgraphs: PositionedSubgraph[];
  width: number;
  height: number;
}

// ── Theme ──────────────────────────────────────────────────────────────────

export interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  rx?: number;
  ry?: number;
  textColor: string;
  padding: number;
}

export interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  arrowColor: string;
  labelBackground: string;
  labelColor: string;
}

export interface Theme {
  background: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  lineColor: string;
  borderColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string | number;
  nodeStyles: {
    default: NodeStyle;
    decision: NodeStyle;
    rounded: NodeStyle;
    circle: NodeStyle;
    cylinder: NodeStyle;
    subroutine: NodeStyle;
    [key: string]: NodeStyle;
  };
  edgeStyles: {
    default: EdgeStyle;
    dotted: EdgeStyle;
    thick: EdgeStyle;
    [key: string]: EdgeStyle;
  };
}

// ── Text Measurement ───────────────────────────────────────────────────────

export interface TextMetrics {
  width: number;
  height: number;
  ascent: number;
  descent: number;
}

export interface FontMetricsProvider {
  measureText(text: string, fontSize: number, fontFamily: string, fontWeight?: string | number): TextMetrics;
}

// ── Public API Types ───────────────────────────────────────────────────────

export interface RenderOptions {
  theme?: Theme | 'default' | 'dark' | 'forest' | 'neutral';
  width?: number;
  height?: number;
  padding?: number;
  layoutOptions?: Record<string, string>;
  fontMetrics?: FontMetricsProvider;
  idPrefix?: string;
}

export interface RenderResult {
  svg: string;
  bounds: { width: number; height: number };
  diagramType: DiagramType;
}

export interface LayoutOptions {
  layoutOptions?: Record<string, string>;
  fontMetrics?: FontMetricsProvider;
  padding?: number;
}

