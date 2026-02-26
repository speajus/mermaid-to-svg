import type { MindmapIR, MindmapNode, MindmapNodeType } from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

const NODE_TYPE_MAP: Record<number, MindmapNodeType> = {
  0: 'default',
  1: 'rounded_rect',
  2: 'rect',
  3: 'circle',
  4: 'cloud',
  5: 'bang',
  6: 'hexagon',
};

function convertNode(raw: any): MindmapNode {
  return {
    id: raw.id ?? 0,
    nodeId: raw.nodeId ?? '',
    label: raw.descr ?? raw.nodeId ?? '',
    type: NODE_TYPE_MAP[raw.type] ?? 'default',
    level: raw.level ?? 0,
    isRoot: raw.isRoot ?? false,
    children: (raw.children ?? []).map(convertNode),
  };
}

export async function parseMindmap(text: string): Promise<MindmapIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  const rawRoot = db.getMindmap?.();
  if (!rawRoot) {
    throw new Error('Mindmap parser: no root node found');
  }

  return { type: 'mindmap', root: convertNode(rawRoot) };
}
