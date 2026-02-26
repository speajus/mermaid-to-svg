import type { MindmapIR, MindmapNode, LayoutOptions } from '../types.js';
import { estimationFontMetrics } from './text-measure.js';

export interface MindmapNodeLayout {
  id: number;
  nodeId: string;
  label: string;
  type: MindmapNode['type'];
  isRoot: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  children: MindmapNodeLayout[];
}

export interface MindmapLayoutResult {
  diagramType: 'mindmap';
  root: MindmapNodeLayout;
  width: number;
  height: number;
  nodes: [];
  edges: [];
  subgraphs: [];
}

const H_GAP = 40;
const V_GAP = 16;

function measureNode(
  node: MindmapNode,
  fontSize: number,
  fontFamily: string,
  metrics: any,
): { width: number; height: number } {
  const m = metrics.measureText(node.label, fontSize, fontFamily);
  const pad = node.isRoot ? 40 : 24;
  return { width: Math.max(m.width + pad, 60), height: Math.max(m.height + 16, 36) };
}

/** Simple tree layout: root on left, children to the right, stacked vertically */
function layoutTree(
  node: MindmapNode,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  metrics: any,
): MindmapNodeLayout {
  const size = measureNode(node, fontSize, fontFamily, metrics);
  const childLayouts: MindmapNodeLayout[] = [];

  if (node.children.length > 0) {
    const childX = x + size.width + H_GAP;
    let childY = y;
    // First pass: lay out children to compute total height
    const tempLayouts: MindmapNodeLayout[] = [];
    for (const child of node.children) {
      const cl = layoutTree(child, childX, childY, fontSize * 0.92, fontFamily, metrics);
      tempLayouts.push(cl);
      childY = cl.y + computeSubtreeHeight(cl) + V_GAP;
    }
    // Center the parent vertically relative to children span
    const firstChild = tempLayouts[0];
    const lastChild = tempLayouts[tempLayouts.length - 1];
    const childrenSpan = lastChild.y + computeSubtreeHeight(lastChild) - firstChild.y;
    const parentY = firstChild.y + childrenSpan / 2 - size.height / 2;

    return {
      id: node.id,
      nodeId: node.nodeId,
      label: node.label,
      type: node.type,
      isRoot: node.isRoot,
      x,
      y: parentY,
      width: size.width,
      height: size.height,
      children: tempLayouts,
    };
  }

  return {
    id: node.id,
    nodeId: node.nodeId,
    label: node.label,
    type: node.type,
    isRoot: node.isRoot,
    x,
    y,
    width: size.width,
    height: size.height,
    children: childLayouts,
  };
}

function computeSubtreeHeight(node: MindmapNodeLayout): number {
  if (node.children.length === 0) return node.height;
  const first = node.children[0];
  const last = node.children[node.children.length - 1];
  return Math.max(node.height, last.y + computeSubtreeHeight(last) - first.y);
}

function computeBounds(node: MindmapNodeLayout): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let b = { minX: node.x, minY: node.y, maxX: node.x + node.width, maxY: node.y + node.height };
  for (const child of node.children) {
    const cb = computeBounds(child);
    b = {
      minX: Math.min(b.minX, cb.minX),
      minY: Math.min(b.minY, cb.minY),
      maxX: Math.max(b.maxX, cb.maxX),
      maxY: Math.max(b.maxY, cb.maxY),
    };
  }
  return b;
}

function offsetTree(node: MindmapNodeLayout, dx: number, dy: number): void {
  node.x += dx;
  node.y += dy;
  for (const c of node.children) offsetTree(c, dx, dy);
}

export async function layoutMindmap(
  ir: MindmapIR,
  options?: LayoutOptions,
): Promise<MindmapLayoutResult> {
  const fontSize = 14;
  const fontFamily = 'arial';
  const metrics = options?.fontMetrics ?? estimationFontMetrics;
  const padding = options?.padding ?? 20;

  const root = layoutTree(ir.root, 0, 0, fontSize, fontFamily, metrics);
  const bounds = computeBounds(root);
  offsetTree(root, -bounds.minX + padding, -bounds.minY + padding);

  const finalBounds = computeBounds(root);
  const width = finalBounds.maxX + padding;
  const height = finalBounds.maxY + padding;

  return { diagramType: 'mindmap', root, width, height, nodes: [], edges: [], subgraphs: [] };
}
