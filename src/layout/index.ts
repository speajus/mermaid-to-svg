import type { DiagramIR, LayoutResult, LayoutOptions } from '../types.js';
import { layoutFlowchart } from './elk-layout.js';
import { layoutSequence, type SequenceLayoutResult } from './sequence-layout.js';
import { layoutClass, type ClassLayoutResult } from './class-layout.js';
import { layoutState, type StateLayoutResult } from './state-layout.js';
import { layoutER, type ERLayoutResult } from './er-layout.js';
import { layoutGantt, type GanttLayoutResult } from './gantt-layout.js';
import { layoutPie, type PieLayoutResult } from './pie-layout.js';
import { layoutMindmap, type MindmapLayoutResult } from './mindmap-layout.js';

export type AnyLayoutResult =
  | LayoutResult
  | SequenceLayoutResult
  | ClassLayoutResult
  | StateLayoutResult
  | ERLayoutResult
  | GanttLayoutResult
  | PieLayoutResult
  | MindmapLayoutResult;

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
    case 'er':
      return layoutER(ir, options);
    case 'gantt':
      return layoutGantt(ir, options);
    case 'pie':
      return layoutPie(ir, options);
    case 'mindmap':
      return layoutMindmap(ir, options);
    default:
      throw new Error(`Layout not implemented for diagram type: ${(ir as any).type}`);
  }
}
