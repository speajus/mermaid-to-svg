import ELK from 'elkjs';
import type { ERIR, LayoutOptions, PositionedEdge } from '../types.js';
import { estimationFontMetrics } from './text-measure.js';

export interface EREntityLayout {
  id: string;
  label: string;
  attributes: Array<{ type: string; name: string; keys: string[] }>;
  x: number; y: number; width: number; height: number;
}

export interface ERLayoutResult {
  diagramType: 'er';
  entities: EREntityLayout[];
  relationships: Array<{
    entityA: string; entityB: string; roleLabel: string;
    cardA: string; cardB: string; relType: string;
    points: Array<{ x: number; y: number }>;
  }>;
  edges: PositionedEdge[];
  width: number; height: number;
  nodes: []; subgraphs: [];
}

const elk = new ELK();

export async function layoutER(ir: ERIR, options?: LayoutOptions): Promise<ERLayoutResult> {
  const fontSize = 14;
  const fontFamily = 'arial';
  const metrics = options?.fontMetrics ?? estimationFontMetrics;
  const padding = options?.padding ?? 20;

  const ROW_HEIGHT = 22;
  const ATTR_PAD = 20;

  const elkNodes = ir.entities.map(e => {
    const labelW = metrics.measureText(e.label, fontSize, fontFamily).width + 30;
    const attrsW = e.attributes.reduce((max, a) => {
      const w = metrics.measureText(`${a.type} ${a.name} ${a.keys.join(',')}`, fontSize * 0.85, fontFamily).width;
      return Math.max(max, w);
    }, 0) + ATTR_PAD;
    const width = Math.max(labelW, attrsW, 100);
    const height = 36 + e.attributes.length * ROW_HEIGHT;
    return { id: e.id, width, height };
  });

  const elkEdges = ir.relationships.map((r, i) => ({
    id: `er-edge-${i}`,
    sources: [r.entityA],
    targets: [r.entityB],
  }));

  const graph = await elk.layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '60',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
      ...options?.layoutOptions,
    },
    children: elkNodes,
    edges: elkEdges,
  });

  const entityMap = new Map(ir.entities.map(e => [e.id, e]));
  const entities: EREntityLayout[] = (graph.children ?? []).map(n => {
    const e = entityMap.get(n.id)!;
    return {
      id: n.id, label: e.label, attributes: e.attributes,
      x: (n.x ?? 0) + padding, y: (n.y ?? 0) + padding,
      width: n.width ?? 100, height: n.height ?? 60,
    };
  });

  const entityLookup = new Map(entities.map(e => [e.id, e]));
  const posEdges: PositionedEdge[] = [];
  const layoutRels = ir.relationships.map((r, i) => {
    const eA = entityLookup.get(r.entityA);
    const eB = entityLookup.get(r.entityB);
    const gEdge = graph.edges?.[i];
    const points = gEdge?.sections?.[0]
      ? [
          { x: (gEdge.sections[0].startPoint?.x ?? 0) + padding, y: (gEdge.sections[0].startPoint?.y ?? 0) + padding },
          ...(gEdge.sections[0].bendPoints ?? []).map(p => ({ x: p.x + padding, y: p.y + padding })),
          { x: (gEdge.sections[0].endPoint?.x ?? 0) + padding, y: (gEdge.sections[0].endPoint?.y ?? 0) + padding },
        ]
      : eA && eB
        ? [{ x: eA.x + eA.width, y: eA.y + eA.height / 2 }, { x: eB.x, y: eB.y + eB.height / 2 }]
        : [];

    posEdges.push({
      id: `er-edge-${i}`, source: r.entityA, target: r.entityB,
      label: r.roleLabel, points, type: r.relType === 'NON_IDENTIFYING' ? 'dotted' : 'solid',
      arrowHead: 'none',
    });

    return { ...r, points };
  });

  const w = (graph.width ?? 400) + padding * 2;
  const h = (graph.height ?? 300) + padding * 2;

  return { diagramType: 'er', entities, relationships: layoutRels, edges: posEdges, width: w, height: h, nodes: [], subgraphs: [] };
}

