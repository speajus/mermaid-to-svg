import type { DiagramIR, LayoutResult, LayoutOptions } from '../types.js';
import { layoutFlowchart } from './elk-layout.js';

/**
 * Layout a parsed diagram IR into positioned nodes and edges.
 */
export async function layout(ir: DiagramIR, options?: LayoutOptions): Promise<LayoutResult> {
  switch (ir.type) {
    case 'flowchart':
      return layoutFlowchart(ir, options);
    default:
      throw new Error(`Layout not implemented for diagram type: ${(ir as any).type}`);
  }
}

