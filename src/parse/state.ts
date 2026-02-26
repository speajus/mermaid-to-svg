import type { StateIR, StateDef, StateTransition } from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

/**
 * Map mermaid's shape names to our state types.
 */
function resolveStateType(shape: string): StateDef['type'] {
  if (shape === 'stateStart') return 'start';
  if (shape === 'stateEnd') return 'end';
  if (shape === 'fork' || shape === 'join') return shape as 'fork' | 'join';
  if (shape === 'choice') return 'choice';
  if (shape === 'note') return 'note';
  return 'default';
}

export async function parseState(text: string): Promise<StateIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  // Use the pre-processed nodes and edges from the db
  const rawNodes: any[] = db.nodes ?? [];
  const rawEdges: any[] = db.edges ?? [];

  const states: StateDef[] = rawNodes.map(node => ({
    id: node.id,
    label: resolveStateType(node.shape) === 'start' || resolveStateType(node.shape) === 'end'
      ? '' : (node.label ?? node.id),
    type: resolveStateType(node.shape),
    description: node.label,
  }));

  const transitions: StateTransition[] = rawEdges.map((edge, i) => ({
    id: edge.id ?? `trans-${i}`,
    source: edge.start,
    target: edge.end,
    label: edge.label || undefined,
  }));

  return { type: 'state', states, transitions };
}

