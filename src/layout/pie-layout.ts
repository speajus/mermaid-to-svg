import type { PieIR, LayoutOptions } from '../types.js';

export interface PieSliceLayout {
  label: string;
  value: number;
  percentage: number;
  startAngle: number;
  endAngle: number;
  color: string;
}

export interface PieLayoutResult {
  diagramType: 'pie';
  title: string;
  showData: boolean;
  slices: PieSliceLayout[];
  centerX: number; centerY: number; radius: number;
  width: number; height: number;
  nodes: []; edges: []; subgraphs: [];
}

const COLORS = [
  '#4e79a7', '#f28e2c', '#e15759', '#76b7b2',
  '#59a14f', '#edc949', '#af7aa1', '#ff9da7',
  '#9c755f', '#bab0ab',
];

export async function layoutPie(ir: PieIR, options?: LayoutOptions): Promise<PieLayoutResult> {
  const padding = options?.padding ?? 20;
  const radius = 150;
  const titleHeight = ir.title ? 40 : 0;
  const legendWidth = 160;

  const total = ir.sections.reduce((sum, s) => sum + s.value, 0) || 1;
  let currentAngle = -Math.PI / 2; // start at top

  const slices: PieSliceLayout[] = ir.sections.map((s, i) => {
    const percentage = s.value / total;
    const startAngle = currentAngle;
    const endAngle = currentAngle + percentage * 2 * Math.PI;
    currentAngle = endAngle;
    return {
      label: s.label,
      value: s.value,
      percentage,
      startAngle,
      endAngle,
      color: COLORS[i % COLORS.length],
    };
  });

  const centerX = radius + padding;
  const centerY = radius + padding + titleHeight;
  const width = radius * 2 + legendWidth + padding * 2;
  const height = radius * 2 + titleHeight + padding * 2;

  return {
    diagramType: 'pie', title: ir.title, showData: ir.showData,
    slices, centerX, centerY, radius,
    width, height,
    nodes: [], edges: [], subgraphs: [],
  };
}

