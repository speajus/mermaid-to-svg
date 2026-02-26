import type { FlowchartIR, IRNode, IREdge, IRSubgraph, NodeShape } from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

/** Map mermaid's internal vertex type names to our IR shapes */
const SHAPE_MAP: Record<string, NodeShape> = {
  square: 'rect',
  round: 'rounded',
  diamond: 'diamond',
  circle: 'circle',
  stadium: 'stadium',
  subroutine: 'subroutine',
  cylinder: 'cylinder',
  hexagon: 'hexagon',
  odd: 'odd',
  lean_right: 'parallelogram',
  lean_left: 'parallelogram',
  trapezoid: 'trapezoid',
  inv_trapezoid: 'trapezoid',
};

/** Map mermaid's stroke type to our edge type */
function resolveEdgeType(stroke: string): IREdge['type'] {
  switch (stroke) {
    case 'dotted':
      return 'dotted';
    case 'thick':
      return 'thick';
    default:
      return 'solid';
  }
}

/** Map mermaid's arrow type to our arrow head type */
function resolveArrowHead(type: string): IREdge['arrowHead'] {
  switch (type) {
    case 'arrow_point':
      return 'arrow';
    case 'arrow_open':
      return 'open';
    case 'arrow_cross':
      return 'cross';
    case 'arrow_circle':
      return 'circle';
    default:
      return 'arrow';
  }
}

/** Normalize direction string */
function resolveDirection(dir: string): FlowchartIR['direction'] {
  const d = dir?.toUpperCase();
  if (d === 'TB' || d === 'TD') return 'TB';
  if (d === 'BT') return 'BT';
  if (d === 'LR') return 'LR';
  if (d === 'RL') return 'RL';
  return 'TB';
}

export async function parseFlowchart(text: string): Promise<FlowchartIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  // Extract vertices
  const vertexMap: Map<string, any> = db.getVertices();
  const nodes: IRNode[] = [];
  for (const [id, v] of vertexMap) {
    nodes.push({
      id,
      label: v.text ?? id,
      shape: SHAPE_MAP[v.type] ?? 'rect',
      cssClasses: v.classes ? [...v.classes] : undefined,
      style: v.styles
        ? Object.fromEntries(
            v.styles.map((s: string) => {
              const [k, ...rest] = s.split(':');
              return [k.trim(), rest.join(':').trim()];
            }),
          )
        : undefined,
    });
  }

  // Extract edges
  const rawEdges: any[] = db.getEdges();
  const edges: IREdge[] = rawEdges.map((e) => ({
    id: e.id ?? `${e.start}-${e.end}`,
    source: e.start,
    target: e.end,
    label: e.text || undefined,
    type: resolveEdgeType(e.stroke),
    arrowHead: resolveArrowHead(e.type),
  }));

  // Extract subgraphs
  const rawSubgraphs: any[] = db.getSubGraphs?.() ?? [];
  const subgraphs: IRSubgraph[] = rawSubgraphs.map((sg) => ({
    id: sg.id,
    label: sg.title ?? sg.id,
    nodeIds: sg.nodes ?? [],
  }));

  // Direction
  const direction = resolveDirection(db.getDirection?.() ?? 'TB');

  return {
    type: 'flowchart',
    direction,
    nodes,
    edges,
    subgraphs,
  };
}
