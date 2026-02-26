import ELK from 'elkjs';
import type {
  FlowchartIR,
  LayoutResult,
  LayoutOptions,
  PositionedNode,
  PositionedEdge,
  PositionedSubgraph,
  FontMetricsProvider,
} from '../types.js';
import { estimationFontMetrics } from './text-measure.js';

const elk = new ELK();

/** Map our direction to ELK direction */
function resolveElkDirection(direction: string): string {
  switch (direction) {
    case 'LR':
      return 'RIGHT';
    case 'RL':
      return 'LEFT';
    case 'BT':
      return 'UP';
    default:
      return 'DOWN'; // TB
  }
}

/** Compute node dimensions based on label text and shape padding */
function computeNodeSize(
  label: string,
  fontSize: number,
  fontFamily: string,
  padding: number,
  metrics: FontMetricsProvider,
): { width: number; height: number } {
  const m = metrics.measureText(label, fontSize, fontFamily);
  return {
    width: Math.max(m.width + padding * 2, 60),
    height: Math.max(m.height + padding * 2, 40),
  };
}

export async function layoutFlowchart(
  ir: FlowchartIR,
  options?: LayoutOptions,
): Promise<LayoutResult> {
  const fontSize = 14;
  const fontFamily = 'Arial, Helvetica, sans-serif';
  const padding = options?.padding ?? 20;
  const metrics = options?.fontMetrics ?? estimationFontMetrics;
  const nodePadding = 12;

  // Build ELK graph
  const children = ir.nodes.map((node) => {
    const size = computeNodeSize(node.label, fontSize, fontFamily, nodePadding, metrics);
    // Diamond/hexagon nodes need extra space
    if (node.shape === 'diamond') {
      size.width *= 1.4;
      size.height *= 1.4;
    }
    return {
      id: node.id,
      width: size.width,
      height: size.height,
      labels: [{ text: node.label, width: size.width - nodePadding * 2, height: fontSize * 1.2 }],
    };
  });

  const edges = ir.edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
    labels: edge.label
      ? [{ text: edge.label, width: edge.label.length * fontSize * 0.6, height: fontSize * 1.2 }]
      : [],
  }));

  const elkGraph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': resolveElkDirection(ir.direction),
      'elk.spacing.nodeNode': '40',
      'elk.layered.spacing.nodeNodeBetweenLayers': '60',
      'elk.edgeRouting': 'ORTHOGONAL',
      ...options?.layoutOptions,
    },
    children,
    edges,
  };

  const layoutResult = await elk.layout(elkGraph);

  // Extract positioned nodes
  const positionedNodes: PositionedNode[] = (layoutResult.children ?? []).map((child) => {
    const irNode = ir.nodes.find((n) => n.id === child.id)!;
    return {
      id: child.id,
      x: child.x ?? 0,
      y: child.y ?? 0,
      width: child.width ?? 60,
      height: child.height ?? 40,
      label: irNode.label,
      shape: irNode.shape,
    };
  });

  // Extract positioned edges with routing points
  const positionedEdges: PositionedEdge[] = (layoutResult.edges ?? []).map((edge) => {
    const irEdge = ir.edges.find((e) => e.id === edge.id)!;
    const sections = (edge as any).sections ?? [];
    const points: Array<{ x: number; y: number }> = [];
    for (const section of sections) {
      if (section.startPoint) points.push(section.startPoint);
      if (section.bendPoints) points.push(...section.bendPoints);
      if (section.endPoint) points.push(section.endPoint);
    }
    // Fallback: if no sections, use source/target center
    if (points.length === 0) {
      const src = positionedNodes.find((n) => n.id === irEdge.source);
      const tgt = positionedNodes.find((n) => n.id === irEdge.target);
      if (src) points.push({ x: src.x + src.width / 2, y: src.y + src.height / 2 });
      if (tgt) points.push({ x: tgt.x + tgt.width / 2, y: tgt.y + tgt.height / 2 });
    }
    return {
      id: edge.id,
      source: irEdge.source,
      target: irEdge.target,
      label: irEdge.label,
      points,
      type: irEdge.type,
      arrowHead: irEdge.arrowHead,
    };
  });

  // Compute total bounds
  let maxX = 0,
    maxY = 0;
  for (const n of positionedNodes) {
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  }

  return {
    diagramType: 'flowchart',
    nodes: positionedNodes,
    edges: positionedEdges,
    subgraphs: [], // TODO: subgraph layout
    width: maxX + padding * 2,
    height: maxY + padding * 2,
  };
}
