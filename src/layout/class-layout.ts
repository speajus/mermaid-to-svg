import ELK from 'elkjs';
import type { ClassIR, LayoutOptions, FontMetricsProvider, PositionedEdge } from '../types.js';
import { estimationFontMetrics } from './text-measure.js';

const elk = new ELK();

export interface ClassNodeLayout {
  id: string;
  label: string;
  x: number; y: number; width: number; height: number;
  members: Array<{ text: string; visibility: string }>;
  methods: Array<{ text: string; visibility: string }>;
  annotations: string[];
  /** Heights for the 3 compartments: name, attributes, methods */
  compartmentHeights: [number, number, number];
}

export interface ClassLayoutResult {
  diagramType: 'class';
  classNodes: ClassNodeLayout[];
  edges: PositionedEdge[];
  width: number; height: number;
  // Satisfy LayoutResult shape
  nodes: []; subgraphs: [];
}

function resolveElkDirection(dir: string): string {
  if (dir === 'LR') return 'RIGHT';
  if (dir === 'RL') return 'LEFT';
  if (dir === 'BT') return 'UP';
  return 'DOWN';
}

export async function layoutClass(ir: ClassIR, options?: LayoutOptions): Promise<ClassLayoutResult> {
  const fontSize = 14;
  const fontFamily = 'Arial, Helvetica, sans-serif';
  const padding = options?.padding ?? 20;
  const metrics = options?.fontMetrics ?? estimationFontMetrics;
  const lineH = fontSize * 1.5;
  const headerH = lineH + 12;

  // Compute node sizes based on class content
  const children = ir.classes.map(cls => {
    const memberCount = cls.members.length;
    const methodCount = cls.methods.length;
    const nameH = headerH + (cls.annotations.length > 0 ? lineH : 0);
    const membersH = Math.max(memberCount * lineH + 8, lineH);
    const methodsH = Math.max(methodCount * lineH + 8, lineH);
    const totalH = nameH + membersH + methodsH;

    // Width from longest text
    const texts = [cls.label, ...cls.members.map(m => m.text), ...cls.methods.map(m => m.text)];
    const maxTextW = Math.max(...texts.map(t => metrics.measureText(t, fontSize, fontFamily).width));
    const w = Math.max(maxTextW + 30, 140);

    return { id: cls.id, width: w, height: totalH, labels: [{ text: cls.label }],
      compartmentHeights: [nameH, membersH, methodsH] as [number, number, number] };
  });

  const edges = ir.relationships.map(r => ({
    id: r.id, sources: [r.source], targets: [r.target],
    labels: r.label ? [{ text: r.label }] : [],
  }));

  const graph = {
    id: 'root', children, edges,
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': resolveElkDirection(ir.direction),
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
      'elk.edgeRouting': 'ORTHOGONAL',
      ...options?.layoutOptions,
    },
  };

  const result = await elk.layout(graph);

  const classNodes: ClassNodeLayout[] = (result.children ?? []).map(child => {
    const cls = ir.classes.find(c => c.id === child.id)!;
    const elkChild = children.find(c => c.id === child.id)!;
    return {
      id: child.id, label: cls.label,
      x: child.x ?? 0, y: child.y ?? 0,
      width: child.width ?? 140, height: child.height ?? 80,
      members: cls.members.map(m => ({ text: m.text, visibility: m.visibility })),
      methods: cls.methods.map(m => ({ text: m.text, visibility: m.visibility })),
      annotations: cls.annotations,
      compartmentHeights: elkChild.compartmentHeights,
    };
  });

  const posEdges: PositionedEdge[] = (result.edges ?? []).map(edge => {
    const rel = ir.relationships.find(r => r.id === edge.id)!;
    const sections = (edge as any).sections ?? [];
    const points: Array<{ x: number; y: number }> = [];
    for (const s of sections) {
      if (s.startPoint) points.push(s.startPoint);
      if (s.bendPoints) points.push(...s.bendPoints);
      if (s.endPoint) points.push(s.endPoint);
    }
    return {
      id: edge.id, source: rel.source, target: rel.target, label: rel.label,
      points, type: rel.lineType === 'dotted' ? 'dotted' as const : 'solid' as const,
      arrowHead: 'arrow' as const,
    };
  });

  let maxX = 0, maxY = 0;
  for (const n of classNodes) { maxX = Math.max(maxX, n.x + n.width); maxY = Math.max(maxY, n.y + n.height); }

  return {
    diagramType: 'class', classNodes, edges: posEdges,
    width: maxX + padding * 2, height: maxY + padding * 2,
    nodes: [], subgraphs: [],
  };
}

