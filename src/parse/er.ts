import type { ERIR, EREntity, ERRelationship, ERCardinality, ERRelType } from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

function resolveCardinality(card: string): ERCardinality {
  const map: Record<string, ERCardinality> = {
    ZERO_OR_ONE: 'ZERO_OR_ONE',
    ZERO_OR_MORE: 'ZERO_OR_MORE',
    ONE_OR_MORE: 'ONE_OR_MORE',
    ONLY_ONE: 'ONLY_ONE',
  };
  return map[card] ?? 'ONLY_ONE';
}

export async function parseER(text: string): Promise<ERIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  // Entities is a Map<string, {...}>
  const rawEntities: Map<string, any> = db.entities ?? new Map();
  const entities: EREntity[] = [];
  for (const [, raw] of rawEntities) {
    entities.push({
      id: raw.id,
      label: raw.label ?? raw.id,
      attributes: (raw.attributes ?? []).map((a: any) => ({
        type: a.type ?? '',
        name: a.name ?? '',
        keys: a.keys ?? [],
        comment: a.comment || undefined,
      })),
    });
  }

  // Relationships
  const rawRels: any[] = db.relationships ?? [];
  const relationships: ERRelationship[] = rawRels.map((r) => ({
    entityA: r.entityA,
    entityB: r.entityB,
    roleLabel: r.roleA ?? '',
    cardA: resolveCardinality(r.relSpec?.cardA),
    cardB: resolveCardinality(r.relSpec?.cardB),
    relType: (r.relSpec?.relType === 'NON_IDENTIFYING'
      ? 'NON_IDENTIFYING'
      : 'IDENTIFYING') as ERRelType,
  }));

  // If entities map was empty, derive from relationships
  if (entities.length === 0) {
    const seen = new Set<string>();
    for (const r of rawRels) {
      for (const eId of [r.entityA, r.entityB]) {
        if (!seen.has(eId)) {
          seen.add(eId);
          // Extract display name from id like "entity-CUSTOMER-0"
          const label = eId.replace(/^entity-/, '').replace(/-\d+$/, '');
          entities.push({ id: eId, label, attributes: [] });
        }
      }
    }
  }

  return { type: 'er', entities, relationships };
}
