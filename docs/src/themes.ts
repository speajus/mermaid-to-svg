export interface Gradient {
  type: 'linear' | 'radial';
  from: string;
  to: string;
  direction?: number;
}

export interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  rx?: number;
  ry?: number;
  textColor: string;
  padding: number;
  gradient?: Gradient;
}

export interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  arrowColor: string;
  labelBackground: string;
  labelColor: string;
}

export interface Theme {
  background: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  lineColor: string;
  borderColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string | number;
  nodeStyles: Record<string, NodeStyle>;
  edgeStyles: Record<string, EdgeStyle>;
}

const defaultShadow = { dx: 2, dy: 3, blur: 4, color: 'rgba(0,0,0,0.15)' };

export const defaultTheme: Theme = {
  background: '#ffffff', primaryColor: '#ECECFF', secondaryColor: '#ffffde',
  tertiaryColor: '#f5f5f0', primaryTextColor: '#131300', secondaryTextColor: '#000021',
  lineColor: '#333333', borderColor: '#9370DB',
  fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
  nodeStyles: {
    default: { fill: '#ECECFF', stroke: '#9370DB', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#f8f8ff', to: '#DCDCFF', direction: 180 } },
    decision: { fill: '#ECECFF', stroke: '#9370DB', strokeWidth: 1.5, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#f8f8ff', to: '#DCDCFF', direction: 180 } },
    rounded: { fill: '#ffffde', stroke: '#aaaa33', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#fffff0', to: '#f5f5c0', direction: 180 } },
    circle: { fill: '#ECECFF', stroke: '#9370DB', strokeWidth: 1.5, textColor: '#131300', padding: 12, gradient: { type: 'radial', from: '#f8f8ff', to: '#DCDCFF' } },
    cylinder: { fill: '#ffffde', stroke: '#aaaa33', strokeWidth: 1.5, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#fffff0', to: '#f5f5c0', direction: 180 } },
    subroutine: { fill: '#f5f5f0', stroke: '#9370DB', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#131300', padding: 12, gradient: { type: 'linear', from: '#fafaf5', to: '#eaeae0', direction: 180 } },
  },
  edgeStyles: {
    default: { stroke: '#333333', strokeWidth: 1.5, arrowColor: '#333333', labelBackground: 'rgba(232,232,232,0.8)', labelColor: '#333333' },
    dotted: { stroke: '#333333', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#333333', labelBackground: 'rgba(232,232,232,0.8)', labelColor: '#333333' },
    thick: { stroke: '#333333', strokeWidth: 3, arrowColor: '#333333', labelBackground: 'rgba(232,232,232,0.8)', labelColor: '#131300' },
  },
};

export const darkTheme: Theme = {
  background: '#333333', primaryColor: '#1f2020', secondaryColor: '#484848',
  tertiaryColor: '#1f1f1f', primaryTextColor: '#e0dfdf', secondaryTextColor: '#b8b8b8',
  lineColor: '#d3d3d3', borderColor: '#cccccc',
  fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
  nodeStyles: {
    default: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#2a2b2b', to: '#161717', direction: 180 } },
    decision: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#2a2b2b', to: '#161717', direction: 180 } },
    rounded: { fill: '#484848', stroke: '#cccccc', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#555555', to: '#3a3a3a', direction: 180 } },
    circle: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'radial', from: '#2a2b2b', to: '#161717' } },
    cylinder: { fill: '#484848', stroke: '#cccccc', strokeWidth: 1.5, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#555555', to: '#3a3a3a', direction: 180 } },
    subroutine: { fill: '#1f2020', stroke: '#cccccc', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#e0dfdf', padding: 12, gradient: { type: 'linear', from: '#2a2b2b', to: '#161717', direction: 180 } },
  },
  edgeStyles: {
    default: { stroke: '#d3d3d3', strokeWidth: 1.5, arrowColor: '#d3d3d3', labelBackground: '#585858', labelColor: '#cccccc' },
    dotted: { stroke: '#d3d3d3', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#d3d3d3', labelBackground: '#585858', labelColor: '#cccccc' },
    thick: { stroke: '#d3d3d3', strokeWidth: 3, arrowColor: '#d3d3d3', labelBackground: '#585858', labelColor: '#e0dfdf' },
  },
};



export const forestTheme: Theme = {
  background: '#ffffff', primaryColor: '#cde498', secondaryColor: '#cdffb2',
  tertiaryColor: '#d8e8c8', primaryTextColor: '#000000', secondaryTextColor: '#333333',
  lineColor: '#000000', borderColor: '#13540c',
  fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
  nodeStyles: {
    default: { fill: '#cde498', stroke: '#13540c', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#e0f0b0', to: '#b8d480', direction: 180 } },
    decision: { fill: '#cde498', stroke: '#13540c', strokeWidth: 1.5, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#e0f0b0', to: '#b8d480', direction: 180 } },
    rounded: { fill: '#cdffb2', stroke: '#6eaa49', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#ddffc8', to: '#b0e890', direction: 180 } },
    circle: { fill: '#cde498', stroke: '#13540c', strokeWidth: 1.5, textColor: '#000000', padding: 12, gradient: { type: 'radial', from: '#e0f0b0', to: '#b8d480' } },
    cylinder: { fill: '#cdffb2', stroke: '#6eaa49', strokeWidth: 1.5, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#ddffc8', to: '#b0e890', direction: 180 } },
    subroutine: { fill: '#d8e8c8', stroke: '#13540c', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#000000', padding: 12, gradient: { type: 'linear', from: '#e8f0d8', to: '#c8d8b0', direction: 180 } },
  },
  edgeStyles: {
    default: { stroke: '#000000', strokeWidth: 1.5, arrowColor: '#008000', labelBackground: '#e8e8e8', labelColor: '#333333' },
    dotted: { stroke: '#000000', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#008000', labelBackground: '#e8e8e8', labelColor: '#333333' },
    thick: { stroke: '#000000', strokeWidth: 3, arrowColor: '#008000', labelBackground: '#e8e8e8', labelColor: '#000000' },
  },
};

export const neutralTheme: Theme = {
  background: '#ffffff', primaryColor: '#eeeeee', secondaryColor: '#fcfcfc',
  tertiaryColor: '#eeeeee', primaryTextColor: '#111111', secondaryTextColor: '#333333',
  lineColor: '#666666', borderColor: '#999999',
  fontFamily: '"trebuchet ms", verdana, arial, sans-serif', fontSize: 14, fontWeight: 'normal',
  nodeStyles: {
    default: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, rx: 5, ry: 5, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#f8f8f8', to: '#e0e0e0', direction: 180 } },
    decision: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#f8f8f8', to: '#e0e0e0', direction: 180 } },
    rounded: { fill: '#fcfcfc', stroke: '#707070', strokeWidth: 1.5, rx: 20, ry: 20, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#ffffff', to: '#f0f0f0', direction: 180 } },
    circle: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, textColor: '#111111', padding: 12, gradient: { type: 'radial', from: '#f8f8f8', to: '#e0e0e0' } },
    cylinder: { fill: '#fcfcfc', stroke: '#707070', strokeWidth: 1.5, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#ffffff', to: '#f0f0f0', direction: 180 } },
    subroutine: { fill: '#eeeeee', stroke: '#999999', strokeWidth: 1.5, rx: 0, ry: 0, textColor: '#111111', padding: 12, gradient: { type: 'linear', from: '#f8f8f8', to: '#e0e0e0', direction: 180 } },
  },
  edgeStyles: {
    default: { stroke: '#666666', strokeWidth: 1.5, arrowColor: '#333333', labelBackground: '#ffffff', labelColor: '#333333' },
    dotted: { stroke: '#666666', strokeWidth: 1.5, strokeDasharray: '5,5', arrowColor: '#333333', labelBackground: '#ffffff', labelColor: '#333333' },
    thick: { stroke: '#666666', strokeWidth: 3, arrowColor: '#333333', labelBackground: '#ffffff', labelColor: '#111111' },
  },
};

export const THEMES: Record<string, Theme> = {
  default: defaultTheme,
  dark: darkTheme,
  forest: forestTheme,
  neutral: neutralTheme,
};

export const NODE_STYLE_KEYS = ['default', 'decision', 'rounded', 'circle', 'cylinder', 'subroutine'] as const;

export const FONT_FAMILIES = [
  { label: 'Trebuchet MS', value: '"trebuchet ms", verdana, arial, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
  { label: 'Comic Sans', value: '"Comic Sans MS", cursive' },
];