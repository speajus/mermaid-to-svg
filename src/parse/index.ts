import type { DiagramIR } from '../types.js';
import { parseFlowchart } from './flowchart.js';

/**
 * Detect the diagram type from the first non-empty line of mermaid text.
 */
function detectDiagramType(text: string): string {
  const trimmed = text.trim();
  const firstLine = trimmed.split('\n')[0].trim().toLowerCase();
  if (firstLine.startsWith('flowchart') || firstLine.startsWith('graph')) {
    return 'flowchart';
  }
  // Future: sequence, class, state, er, gantt, pie, mindmap
  throw new Error(`Unsupported diagram type: "${firstLine}". Currently only flowchart/graph is supported.`);
}

/**
 * Parse mermaid text into an intermediate representation.
 */
export async function parse(input: string): Promise<DiagramIR> {
  const diagramType = detectDiagramType(input);

  switch (diagramType) {
    case 'flowchart':
      return parseFlowchart(input);
    default:
      throw new Error(`Parser not implemented for diagram type: ${diagramType}`);
  }
}

