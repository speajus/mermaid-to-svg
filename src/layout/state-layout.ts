import ELK from 'elkjs';
import type { StateIR, StateDef, StateTransition, LayoutOptions, PositionedEdge } from '../types.js';
import { estimationFontMetrics } from './text-measure.js';

export interface StateNodeLayout {
  id: string;
  label: string;
  type: StateDef['type'];
  x: number; y: number; width: number; height: number;
  children?: StateNodeLayout[];
}

export interface StateLayoutResult {
  diagramType: 'state';
  stateNodes: StateNodeLayout[];
  edges: PositionedEdge[];
  width: number; height: number;
  nodes: []; subgraphs: [];
}

const elk = new ELK();

function computeNodeSize(state: StateDef, fontSize: number, fontFamily: string, metrics: any): { width: number; height: number } {
  if (state.type === 'start' || state.type === 'end') return { width: 24, height: 24 };
  if (state.type === 'fork' || state.type === 'join') return { width: 80, height: 8 };
  if (state.type === 'choice') return { width: 32, height: 32 };
  const m = metrics.measureText(state.label, fontSize, fontFamily);
  return { width: Math.max(m.width + 30, 80), height: Math.max(m.height + 20, 40) };
}

export async function layoutState(ir: StateIR, options?: LayoutOptions): Promise<StateLayoutResult> {
  const fontSize = 14;
  const fontFamily = 'Arial, Helvetica, sans-serif';
  const padding = options?.padding ?? 20;
  const metrics = options?.fontMetrics ?? estimationFontMetrics;

  const children = ir.states.map(s => {
    const size = computeNodeSize(s, fontSize, fontFamily, metrics);
    return { id: s.id, width: size.width, height: size.height, labels: [{ text: s.label }] };
  });

  const edges = ir.transitions.map(t => ({
    id: t.id, sources: [t.source], targets: [t.target],
    labels: t.label ? [{ text: t.label }] : [],
  }));

  const graph = {
    id: 'root', children, edges,
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': '40',
      'elk.layered.spacing.nodeNodeBetweenLayers': '60',
      'elk.edgeRouting': 'ORTHOGONAL',
      ...options?.layoutOptions,
    },
  };

  const result = await elk.layout(graph);

  const stateNodes: StateNodeLayout[] = (result.children ?? []).map(child => {
    const state = ir.states.find(s => s.id === child.id)!;
    return {
      id: child.id, label: state.label, type: state.type,
      x: child.x ?? 0, y: child.y ?? 0,
      width: child.width ?? 80, height: child.height ?? 40,
    };
  });

  const posEdges: PositionedEdge[] = (result.edges ?? []).map(edge => {
    const trans = ir.transitions.find(t => t.id === edge.id)!;
    const sections = (edge as any).sections ?? [];
    const points: Array<{ x: number; y: number }> = [];
    for (const s of sections) {
      if (s.startPoint) points.push(s.startPoint);
      if (s.bendPoints) points.push(...s.bendPoints);
      if (s.endPoint) points.push(s.endPoint);
    }
    return {
      id: edge.id, source: trans.source, target: trans.target, label: trans.label,
      points, type: 'solid' as const, arrowHead: 'arrow' as const,
    };
  });

  let maxX = 0, maxY = 0;
  for (const n of stateNodes) { maxX = Math.max(maxX, n.x + n.width); maxY = Math.max(maxY, n.y + n.height); }

  return {
    diagramType: 'state', stateNodes, edges: posEdges,
    width: maxX + padding * 2, height: maxY + padding * 2,
    nodes: [], subgraphs: [],
  };
}

