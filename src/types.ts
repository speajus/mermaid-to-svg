// ── Diagram Types ──────────────────────────────────────────────────────────

export type DiagramType =
  | 'flowchart'
  | 'sequence'
  | 'class'
  | 'state'
  | 'er'
  | 'gantt'
  | 'pie'
  | 'mindmap';

export type DiagramIR =
  | FlowchartIR
  | SequenceIR
  | ClassIR
  | StateIR
  | ERIR
  | GanttIR
  | PieIR
  | MindmapIR;

// ── Flowchart IR ───────────────────────────────────────────────────────────

export type NodeShape =
  | 'rect'
  | 'rounded'
  | 'circle'
  | 'diamond'
  | 'hexagon'
  | 'cylinder'
  | 'stadium'
  | 'subroutine'
  | 'odd'
  | 'parallelogram'
  | 'trapezoid';

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

// ── Sequence Diagram IR ────────────────────────────────────────────────────

export type SequenceMessageType =
  | 'solid'
  | 'dotted'
  | 'solid_cross'
  | 'dotted_cross'
  | 'solid_open'
  | 'dotted_open'
  | 'solid_point'
  | 'dotted_point'
  | 'bidirectional_solid'
  | 'bidirectional_dotted';

export interface SequenceParticipant {
  id: string;
  label: string;
  type: 'participant' | 'actor';
}

export interface SequenceMessage {
  id: string;
  from: string;
  to: string;
  label: string;
  messageType: SequenceMessageType;
}

export interface SequenceNote {
  from: string;
  to?: string;
  message: string;
  placement: 'left' | 'right' | 'over';
}

export interface SequenceActivation {
  participant: string;
  startMessageId: string;
  endMessageId: string;
}

export interface SequenceBlock {
  type: 'loop' | 'alt' | 'opt' | 'par' | 'critical' | 'break' | 'rect';
  label: string;
  sections: SequenceBlockSection[];
}

export interface SequenceBlockSection {
  label?: string;
  messages: SequenceMessage[];
}

export interface SequenceIR {
  type: 'sequence';
  participants: SequenceParticipant[];
  messages: SequenceMessage[];
  notes: SequenceNote[];
  activations: SequenceActivation[];
  blocks: SequenceBlock[];
}

// ── Class Diagram IR ──────────────────────────────────────────────────────

export interface ClassMember {
  id: string;
  text: string;
  visibility: '+' | '-' | '#' | '~' | '';
  memberType: 'attribute' | 'method';
  returnType?: string;
  parameters?: string;
  classifier?: string;
}

export interface ClassDef {
  id: string;
  label: string;
  members: ClassMember[];
  methods: ClassMember[];
  annotations: string[];
  type: string;
}

export type ClassRelationType =
  | 'inheritance'
  | 'composition'
  | 'aggregation'
  | 'association'
  | 'dependency'
  | 'realization'
  | 'lollipop';
export type ClassLineType = 'solid' | 'dotted';

export interface ClassRelationship {
  id: string;
  source: string;
  target: string;
  relationType: ClassRelationType;
  lineType: ClassLineType;
  sourceLabel?: string;
  targetLabel?: string;
  label?: string;
}

export interface ClassIR {
  type: 'class';
  classes: ClassDef[];
  relationships: ClassRelationship[];
  direction: 'TB' | 'BT' | 'LR' | 'RL';
}

// ── State Diagram IR ──────────────────────────────────────────────────────

export interface StateDef {
  id: string;
  label: string;
  type: 'default' | 'start' | 'end' | 'fork' | 'join' | 'choice' | 'note';
  description?: string;
  children?: StateDef[];
  transitions?: StateTransition[];
}

export interface StateTransition {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface StateIR {
  type: 'state';
  states: StateDef[];
  transitions: StateTransition[];
}

// ── ER Diagram IR ─────────────────────────────────────────────────────────

export interface ERAttribute {
  type: string;
  name: string;
  keys: string[]; // e.g. ['PK'], ['FK']
  comment?: string;
}

export interface EREntity {
  id: string;
  label: string;
  attributes: ERAttribute[];
}

export type ERCardinality = 'ZERO_OR_ONE' | 'ZERO_OR_MORE' | 'ONE_OR_MORE' | 'ONLY_ONE';
export type ERRelType = 'IDENTIFYING' | 'NON_IDENTIFYING';

export interface ERRelationship {
  entityA: string;
  entityB: string;
  roleLabel: string;
  cardA: ERCardinality;
  cardB: ERCardinality;
  relType: ERRelType;
}

export interface ERIR {
  type: 'er';
  entities: EREntity[];
  relationships: ERRelationship[];
}

// ── Gantt Chart IR ────────────────────────────────────────────────────────

export interface GanttTask {
  id: string;
  label: string;
  section: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  classes: string[];
  order: number;
}

export interface GanttIR {
  type: 'gantt';
  title: string;
  dateFormat: string;
  sections: string[];
  tasks: GanttTask[];
}

// ── Pie Chart IR ──────────────────────────────────────────────────────────

export interface PieSection {
  label: string;
  value: number;
}

export interface PieIR {
  type: 'pie';
  title: string;
  showData: boolean;
  sections: PieSection[];
}

// ── Mindmap IR ────────────────────────────────────────────────────────────

export type MindmapNodeType =
  | 'default'
  | 'rounded_rect'
  | 'rect'
  | 'circle'
  | 'cloud'
  | 'bang'
  | 'hexagon';

export interface MindmapNode {
  id: number;
  nodeId: string;
  label: string;
  type: MindmapNodeType;
  level: number;
  isRoot: boolean;
  children: MindmapNode[];
}

export interface MindmapIR {
  type: 'mindmap';
  root: MindmapNode;
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
  measureText(
    text: string,
    fontSize: number,
    fontFamily: string,
    fontWeight?: string | number,
  ): TextMetrics;
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
