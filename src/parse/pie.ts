import type { PieIR, PieSection } from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

export async function parsePie(text: string): Promise<PieIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  const title: string = db.getDiagramTitle?.() ?? '';
  const showData: boolean = db.getShowData?.() ?? false;

  // getSections() returns a Map<string, number>
  const rawSections: Map<string, number> = db.getSections?.() ?? new Map();
  const sections: PieSection[] = [];
  for (const [label, value] of rawSections) {
    sections.push({ label, value });
  }

  return { type: 'pie', title, showData, sections };
}
