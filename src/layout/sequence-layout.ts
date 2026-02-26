import type {
  SequenceIR, LayoutOptions, FontMetricsProvider,
} from '../types.js';
import { estimationFontMetrics } from './text-measure.js';

/** Layout result specific to sequence diagrams */
export interface SequenceLayoutResult {
  diagramType: 'sequence';
  participants: Array<{ id: string; label: string; type: string; x: number; y: number; width: number; height: number }>;
  messages: Array<{
    id: string; from: string; to: string; label: string; messageType: string;
    fromX: number; toX: number; y: number;
    isSelf: boolean;
  }>;
  notes: Array<{ from: string; to?: string; message: string; placement: string; x: number; y: number; width: number; height: number }>;
  activations: Array<{ participant: string; startY: number; endY: number; x: number; width: number }>;
  blocks: Array<{ type: string; label: string; x: number; y: number; width: number; height: number; sections: Array<{ label?: string; y: number }> }>;
  width: number;
  height: number;
  nodes: []; edges: []; subgraphs: [];
}

const PARTICIPANT_WIDTH = 120;
const PARTICIPANT_HEIGHT = 40;
const PARTICIPANT_GAP = 60;
const MESSAGE_GAP = 50;
const NOTE_WIDTH = 120;
const NOTE_HEIGHT = 40;
const ACTIVATION_WIDTH = 12;
const PADDING = 40;
const HEADER_Y = 20;

export function layoutSequence(ir: SequenceIR, options?: LayoutOptions): SequenceLayoutResult {
  const metrics = options?.fontMetrics ?? estimationFontMetrics;
  const fontSize = 14;
  const fontFamily = 'Arial, Helvetica, sans-serif';

  // Compute participant widths based on label
  const pWidths = ir.participants.map(p => {
    const m = metrics.measureText(p.label, fontSize, fontFamily);
    return Math.max(m.width + 24, PARTICIPANT_WIDTH);
  });

  // Position participants horizontally
  const pPositions: Array<{ id: string; x: number; centerX: number; width: number }> = [];
  let currentX = PADDING;
  for (let i = 0; i < ir.participants.length; i++) {
    const w = pWidths[i];
    pPositions.push({ id: ir.participants[i].id, x: currentX, centerX: currentX + w / 2, width: w });
    currentX += w + PARTICIPANT_GAP;
  }
  const participantLookup = new Map(pPositions.map(p => [p.id, p]));

  // Layout messages vertically
  let currentY = HEADER_Y + PARTICIPANT_HEIGHT + 30;
  const layoutMessages: SequenceLayoutResult['messages'] = [];
  const layoutNotes: SequenceLayoutResult['notes'] = [];

  let noteIdx = 0;
  let msgIdx = 0;

  // Interleave messages and notes in order
  for (const msg of ir.messages) {
    const fromP = participantLookup.get(msg.from);
    const toP = participantLookup.get(msg.to);
    if (!fromP || !toP) continue;

    const isSelf = msg.from === msg.to;
    layoutMessages.push({
      id: msg.id, from: msg.from, to: msg.to, label: msg.label,
      messageType: msg.messageType,
      fromX: fromP.centerX, toX: toP.centerX,
      y: currentY, isSelf,
    });
    currentY += isSelf ? MESSAGE_GAP + 20 : MESSAGE_GAP;
  }

  // Layout notes (placed after messages for simplicity)
  for (const note of ir.notes) {
    const fromP = participantLookup.get(note.from);
    if (!fromP) continue;
    const toP = note.to ? participantLookup.get(note.to) : undefined;

    let noteX: number;
    if (note.placement === 'left') {
      noteX = fromP.centerX - NOTE_WIDTH - 10;
    } else if (note.placement === 'over' && toP) {
      noteX = (fromP.centerX + toP.centerX) / 2 - NOTE_WIDTH / 2;
    } else {
      noteX = fromP.centerX + 10;
    }

    layoutNotes.push({
      from: note.from, to: note.to, message: note.message, placement: note.placement,
      x: noteX, y: currentY, width: NOTE_WIDTH, height: NOTE_HEIGHT,
    });
    currentY += NOTE_HEIGHT + 10;
  }

  // Layout activations
  const layoutActivations: SequenceLayoutResult['activations'] = [];
  for (const act of ir.activations) {
    const p = participantLookup.get(act.participant);
    const startMsg = layoutMessages.find(m => m.id === act.startMessageId);
    const endMsg = layoutMessages.find(m => m.id === act.endMessageId);
    if (p && startMsg && endMsg) {
      layoutActivations.push({
        participant: act.participant,
        startY: startMsg.y, endY: endMsg.y,
        x: p.centerX - ACTIVATION_WIDTH / 2, width: ACTIVATION_WIDTH,
      });
    }
  }

  // Layout blocks
  const layoutBlocks: SequenceLayoutResult['blocks'] = [];
  for (const block of ir.blocks) {
    const allMsgs = block.sections.flatMap(s => s.messages);
    const msgLayouts = allMsgs.map(m => layoutMessages.find(lm => lm.id === m.id)).filter(Boolean) as typeof layoutMessages;
    if (msgLayouts.length === 0) continue;

    const minY = Math.min(...msgLayouts.map(m => m.y)) - 25;
    const maxY = Math.max(...msgLayouts.map(m => m.y)) + 25;
    const minX = Math.min(...msgLayouts.map(m => Math.min(m.fromX, m.toX))) - 30;
    const maxX = Math.max(...msgLayouts.map(m => Math.max(m.fromX, m.toX))) + 30;

    layoutBlocks.push({
      type: block.type, label: block.label,
      x: minX, y: minY, width: maxX - minX, height: maxY - minY,
      sections: block.sections.map(s => {
        const sectionMsgs = s.messages.map(m => layoutMessages.find(lm => lm.id === m.id)).filter(Boolean) as typeof layoutMessages;
        return { label: s.label, y: sectionMsgs.length > 0 ? sectionMsgs[0].y - 15 : minY };
      }),
    });
  }

  const totalWidth = currentX + PADDING;
  const totalHeight = currentY + PARTICIPANT_HEIGHT + PADDING;

  const participants = ir.participants.map((p, i) => ({
    id: p.id, label: p.label, type: p.type,
    x: pPositions[i].x, y: HEADER_Y, width: pWidths[i], height: PARTICIPANT_HEIGHT,
  }));

  return {
    diagramType: 'sequence', participants,
    messages: layoutMessages, notes: layoutNotes,
    activations: layoutActivations, blocks: layoutBlocks,
    width: totalWidth, height: totalHeight,
    nodes: [], edges: [], subgraphs: [],
  };
}

