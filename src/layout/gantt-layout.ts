import type { GanttIR, LayoutOptions } from '../types.js';

export interface GanttTaskLayout {
  id: string;
  label: string;
  section: string;
  x: number; y: number; width: number; height: number;
  startTime: string; endTime: string;
}

export interface GanttLayoutResult {
  diagramType: 'gantt';
  title: string;
  sections: string[];
  tasks: GanttTaskLayout[];
  timelineStart: number;
  timelineEnd: number;
  width: number; height: number;
  nodes: []; edges: []; subgraphs: [];
}

const BAR_HEIGHT = 28;
const BAR_GAP = 6;
const SECTION_HEADER_HEIGHT = 30;
const LEFT_LABEL_WIDTH = 160;
const CHART_WIDTH = 600;
const TOP_MARGIN = 40;

export async function layoutGantt(ir: GanttIR, options?: LayoutOptions): Promise<GanttLayoutResult> {
  const padding = options?.padding ?? 20;

  // Compute time range
  let minTime = Infinity;
  let maxTime = -Infinity;
  for (const t of ir.tasks) {
    const s = new Date(t.startTime).getTime();
    const e = new Date(t.endTime).getTime();
    if (isFinite(s) && s < minTime) minTime = s;
    if (isFinite(e) && e > maxTime) maxTime = e;
  }
  if (!isFinite(minTime)) { minTime = 0; maxTime = 1; }
  const timeRange = maxTime - minTime || 1;

  // Group tasks by section
  const sectionOrder = ir.sections.length > 0 ? ir.sections : [...new Set(ir.tasks.map(t => t.section))];

  let currentY = TOP_MARGIN + padding;
  const tasks: GanttTaskLayout[] = [];

  for (const section of sectionOrder) {
    currentY += SECTION_HEADER_HEIGHT;
    const sectionTasks = ir.tasks.filter(t => t.section === section);
    for (const t of sectionTasks) {
      const s = new Date(t.startTime).getTime();
      const e = new Date(t.endTime).getTime();
      const x = LEFT_LABEL_WIDTH + ((s - minTime) / timeRange) * CHART_WIDTH + padding;
      const w = Math.max(((e - s) / timeRange) * CHART_WIDTH, 4);
      tasks.push({
        id: t.id, label: t.label, section: t.section,
        x, y: currentY, width: w, height: BAR_HEIGHT,
        startTime: t.startTime, endTime: t.endTime,
      });
      currentY += BAR_HEIGHT + BAR_GAP;
    }
  }

  const totalWidth = LEFT_LABEL_WIDTH + CHART_WIDTH + padding * 2;
  const totalHeight = currentY + padding;

  return {
    diagramType: 'gantt', title: ir.title, sections: sectionOrder,
    tasks, timelineStart: minTime, timelineEnd: maxTime,
    width: totalWidth, height: totalHeight,
    nodes: [], edges: [], subgraphs: [],
  };
}

