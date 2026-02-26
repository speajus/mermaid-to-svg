import type {
  SequenceIR, SequenceParticipant, SequenceMessage, SequenceNote,
  SequenceActivation, SequenceBlock, SequenceBlockSection, SequenceMessageType,
} from '../types.js';
import { fetchMermaid } from './mermaid-setup.js';

/** Map mermaid LINETYPE numbers to our message types */
const LINE_TYPE_MAP: Record<number, SequenceMessageType> = {
  0: 'solid',          // SOLID
  1: 'dotted',         // DOTTED
  3: 'solid_cross',    // SOLID_CROSS
  4: 'dotted_cross',   // DOTTED_CROSS
  5: 'solid_open',     // SOLID_OPEN
  6: 'dotted_open',    // DOTTED_OPEN
  24: 'solid_point',   // SOLID_POINT
  25: 'dotted_point',  // DOTTED_POINT
  33: 'bidirectional_solid',
  34: 'bidirectional_dotted',
};

/** Mermaid LINETYPE constants for structural messages */
const STRUCT = {
  NOTE: 2,
  LOOP_START: 10, LOOP_END: 11,
  ALT_START: 12, ALT_ELSE: 13, ALT_END: 14,
  OPT_START: 15, OPT_END: 16,
  ACTIVE_START: 17, ACTIVE_END: 18,
  PAR_START: 19, PAR_AND: 20, PAR_END: 21,
  RECT_START: 22, RECT_END: 23,
  CRITICAL_START: 27, CRITICAL_OPTION: 28, CRITICAL_END: 29,
  BREAK_START: 30, BREAK_END: 31,
} as const;

const PLACEMENT_MAP: Record<number, 'left' | 'right' | 'over'> = { 0: 'left', 1: 'right', 2: 'over' };

export async function parseSequence(text: string): Promise<SequenceIR> {
  const mermaid = await fetchMermaid();
  const diagram = await (mermaid.mermaidAPI as any).getDiagramFromText(text);
  const db = diagram.db;

  // Participants
  const actorKeys: string[] = db.getActorKeys();
  const participants: SequenceParticipant[] = actorKeys.map((key: string) => {
    const actor = db.getActor(key);
    return {
      id: key,
      label: actor.description ?? key,
      type: actor.type === 'actor' ? 'actor' as const : 'participant' as const,
    };
  });

  // Process raw messages into messages, notes, activations, blocks
  const rawMsgs: any[] = db.getMessages();
  const messages: SequenceMessage[] = [];
  const notes: SequenceNote[] = [];
  const activations: SequenceActivation[] = [];
  const blocks: SequenceBlock[] = [];

  // Track activation starts
  const activeStarts: Map<string, string> = new Map();
  // Track block nesting
  const blockStack: Array<{ type: string; label: string; sections: SequenceBlockSection[] }> = [];

  let msgCounter = 0;
  for (const raw of rawMsgs) {
    const t = raw.type as number;

    if (t === STRUCT.NOTE) {
      notes.push({
        from: raw.from,
        to: raw.to !== raw.from ? raw.to : undefined,
        message: raw.message ?? '',
        placement: PLACEMENT_MAP[raw.placement] ?? 'right',
      });
    } else if (t === STRUCT.ACTIVE_START) {
      activeStarts.set(raw.from, `msg-${msgCounter}`);
    } else if (t === STRUCT.ACTIVE_END) {
      const startId = activeStarts.get(raw.from);
      if (startId) {
        activations.push({ participant: raw.from, startMessageId: startId, endMessageId: `msg-${msgCounter}` });
        activeStarts.delete(raw.from);
      }
    } else if (isBlockStart(t)) {
      blockStack.push({ type: resolveBlockType(t), label: raw.message ?? '', sections: [{ messages: [] }] });
    } else if (isBlockElse(t)) {
      const current = blockStack[blockStack.length - 1];
      if (current) current.sections.push({ label: raw.message ?? undefined, messages: [] });
    } else if (isBlockEnd(t)) {
      const finished = blockStack.pop();
      if (finished) blocks.push(finished as SequenceBlock);
    } else if (LINE_TYPE_MAP[t] !== undefined) {
      const msg: SequenceMessage = {
        id: `msg-${msgCounter++}`,
        from: raw.from,
        to: raw.to,
        label: raw.message ?? '',
        messageType: LINE_TYPE_MAP[t],
      };
      messages.push(msg);
      // Also add to current block section if inside a block
      const currentBlock = blockStack[blockStack.length - 1];
      if (currentBlock) {
        const section = currentBlock.sections[currentBlock.sections.length - 1];
        section.messages.push(msg);
      }
    }
  }

  return { type: 'sequence', participants, messages, notes, activations, blocks };
}

function isBlockStart(t: number): boolean {
  return [STRUCT.LOOP_START, STRUCT.ALT_START, STRUCT.OPT_START, STRUCT.PAR_START, STRUCT.RECT_START, STRUCT.CRITICAL_START, STRUCT.BREAK_START].includes(t as any);
}
function isBlockElse(t: number): boolean {
  return [STRUCT.ALT_ELSE, STRUCT.PAR_AND, STRUCT.CRITICAL_OPTION].includes(t as any);
}
function isBlockEnd(t: number): boolean {
  return [STRUCT.LOOP_END, STRUCT.ALT_END, STRUCT.OPT_END, STRUCT.PAR_END, STRUCT.RECT_END, STRUCT.CRITICAL_END, STRUCT.BREAK_END].includes(t as any);
}
function resolveBlockType(t: number): string {
  if (t === STRUCT.LOOP_START) return 'loop';
  if (t === STRUCT.ALT_START) return 'alt';
  if (t === STRUCT.OPT_START) return 'opt';
  if (t === STRUCT.PAR_START) return 'par';
  if (t === STRUCT.RECT_START) return 'rect';
  if (t === STRUCT.CRITICAL_START) return 'critical';
  if (t === STRUCT.BREAK_START) return 'break';
  return 'loop';
}

