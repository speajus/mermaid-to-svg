import type { DiagramIR, LayoutResult, LayoutOptions } from '../types.js';
import { layoutFlowchart } from './elk-layout.js';
import { layoutSequence, type SequenceLayoutResult } from './sequence-layout.js';
import { layoutClass, type ClassLayoutResult } from './class-layout.js';
import { layoutState, type StateLayoutResult } from './state-layout.js';

export type AnyLayoutResult = LayoutResult | SequenceLayoutResult | ClassLayoutResult | StateLayoutResult;

/**
 * Layout a parsed diagram IR into positioned nodes and edges.
 */
export async function layout(ir: DiagramIR, options?: LayoutOptions): Promise<AnyLayoutResult> {
  switch (ir.type) {
    case 'flowchart':
      return layoutFlowchart(ir, options);
    case 'sequence':
      return layoutSequence(ir, options);
    case 'class':
      return layoutClass(ir, options);
    case 'state':
      return layoutState(ir, options);
    default:
      throw new Error(`Layout not implemented for diagram type: ${(ir as any).type}`);
  }
}

