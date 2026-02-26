import type {
  ClassIR, ClassDef, ClassMember, ClassRelationship,
  ClassRelationType, ClassLineType,
} from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

/** Map mermaid's numeric relation type1/type2 to our types */
const RELATION_TYPE_MAP: Record<number, ClassRelationType> = {
  0: 'aggregation',    // type1=0 → open diamond
  1: 'inheritance',    // type1=1 → filled arrow (extension)
  2: 'composition',    // type1=2 → filled diamond
  3: 'dependency',     // type2=3 → open arrow
};

function resolveRelationType(type1: any, type2: any, lineType: number): { relationType: ClassRelationType; lineType: ClassLineType } {
  const line: ClassLineType = lineType === 1 ? 'dotted' : 'solid';

  // type1 is the source-side marker, type2 is the target-side marker
  if (type1 === 1 && line === 'dotted') return { relationType: 'realization', lineType: line };
  if (type1 === 1) return { relationType: 'inheritance', lineType: line };
  if (type1 === 2) return { relationType: 'composition', lineType: line };
  if (type1 === 0) return { relationType: 'aggregation', lineType: line };
  if (type2 === 3) return { relationType: 'dependency', lineType: line };
  if (type2 === 1) return { relationType: 'inheritance', lineType: line };
  return { relationType: 'association', lineType: line };
}

function cleanMemberText(text: string): string {
  // Mermaid escapes + and - with backslash
  return text.replace(/^\\[+\-#~]/, m => m[1]);
}

export async function parseClass(text: string): Promise<ClassIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  // Classes
  const rawClasses: Map<string, any> = db.getClasses();
  const classes: ClassDef[] = [];
  for (const [id, raw] of rawClasses) {
    const members: ClassMember[] = (raw.members ?? []).map((m: any) => ({
      id: m.id ?? m.text,
      text: cleanMemberText(m.text ?? ''),
      visibility: (m.visibility ?? '') as ClassMember['visibility'],
      memberType: 'attribute' as const,
      classifier: m.classifier,
    }));
    const methods: ClassMember[] = (raw.methods ?? []).map((m: any) => ({
      id: m.id ?? m.text,
      text: cleanMemberText(m.text ?? ''),
      visibility: (m.visibility ?? '') as ClassMember['visibility'],
      memberType: 'method' as const,
      returnType: m.returnType,
      parameters: m.parameters,
      classifier: m.classifier,
    }));
    classes.push({
      id,
      label: raw.label ?? raw.text ?? id,
      members,
      methods,
      annotations: raw.annotations ?? [],
      type: raw.type ?? '',
    });
  }

  // Relationships
  const rawRelations: any[] = db.getRelations();
  const relationships: ClassRelationship[] = rawRelations.map((r, i) => {
    const { relationType, lineType } = resolveRelationType(
      r.relation?.type1, r.relation?.type2, r.relation?.lineType ?? 0,
    );
    return {
      id: `rel-${i}`,
      source: r.id1,
      target: r.id2,
      relationType,
      lineType,
      sourceLabel: r.relationTitle1 !== 'none' ? r.relationTitle1 : undefined,
      targetLabel: r.relationTitle2 !== 'none' ? r.relationTitle2 : undefined,
      label: r.title,
    };
  });

  // Direction
  const dir = db.getDirection?.() ?? 'TB';
  const direction = (['TB', 'BT', 'LR', 'RL'].includes(dir) ? dir : 'TB') as ClassIR['direction'];

  return { type: 'class', classes, relationships, direction };
}

