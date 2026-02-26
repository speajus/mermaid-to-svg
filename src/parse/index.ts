import type { DiagramIR } from '../types.js';
import { parseFlowchart } from './flowchart.js';
import { parseSequence } from './sequence.js';
import { parseClass } from './class.js';
import { parseState } from './state.js';

/**
 * Detect the diagram type from the first non-empty line of mermaid text.
 */
function detectDiagramType(text: string): string {
  const trimmed = text.trim();
  const firstLine = trimmed.split('\n')[0].trim().toLowerCase();
  if (firstLine.startsWith('flowchart') || firstLine.startsWith('graph')) {
    return 'flowchart';
  }
  if (firstLine.startsWith('sequencediagram')) {
    return 'sequence';
  }
  if (firstLine.startsWith('classdiagram')) {
    return 'class';
  }
  if (firstLine.startsWith('statediagram') || firstLine.startsWith('statediagram-v2')) {
    return 'state';
  }
  throw new Error(`Unsupported diagram type: "${firstLine}". Supported: flowchart, sequenceDiagram, classDiagram, stateDiagram.`);
}

/**
 * Parse mermaid text into an intermediate representation.
 */
export async function parse(input: string): Promise<DiagramIR> {
  const diagramType = detectDiagramType(input);

  switch (diagramType) {
    case 'flowchart':
      return parseFlowchart(input);
    case 'sequence':
      return parseSequence(input);
    case 'class':
      return parseClass(input);
    case 'state':
      return parseState(input);
    default:
      throw new Error(`Parser not implemented for diagram type: ${diagramType}`);
  }
}

