import type { GanttIR, GanttTask } from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

export async function parseGantt(text: string): Promise<GanttIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  const title: string = db.getDiagramTitle?.() ?? db.getTitle?.() ?? '';
  const dateFormat: string = db.getDateFormat?.() ?? 'YYYY-MM-DD';
  const sections: string[] = db.getSections?.() ?? [];
  const rawTasks: any[] = db.getTasks?.() ?? [];

  const tasks: GanttTask[] = rawTasks.map((t, i) => ({
    id: t.id ?? `task-${i}`,
    label: (t.task ?? '').trim(),
    section: t.section ?? '',
    startTime: t.startTime instanceof Date ? t.startTime.toISOString()
      : typeof t.startTime === 'string' ? t.startTime : '',
    endTime: t.endTime instanceof Date ? t.endTime.toISOString()
      : typeof t.endTime === 'string' ? t.endTime : '',
    classes: t.classes ?? [],
    order: t.order ?? i,
  }));

  return { type: 'gantt', title, dateFormat, sections, tasks };
}

