import type { Theme, NodeStyle, EdgeStyle } from '../types.js';
import { defaultTheme } from './default.js';

export { defaultTheme } from './default.js';

function deepMerge<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(overrides) as Array<keyof T>) {
    const val = overrides[key];
    if (val !== undefined && typeof val === 'object' && val !== null && !Array.isArray(val)) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        val as Record<string, unknown>,
      ) as T[keyof T];
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}

export function createTheme(overrides: Partial<Theme>): Theme {
  return deepMerge(defaultTheme, overrides);
}

export function mergeThemes(base: Theme, overrides: Partial<Theme>): Theme {
  return deepMerge(base, overrides);
}

export function resolveTheme(theme: Theme | 'default' | undefined): Theme {
  if (!theme || theme === 'default') return defaultTheme;
  if (typeof theme === 'string') return defaultTheme; // future: dark, forest, neutral
  return theme;
}

export function resolveNodeStyle(theme: Theme, shape: string): NodeStyle {
  const mapping: Record<string, string> = {
    diamond: 'decision',
    round: 'rounded',
    stadium: 'rounded',
  };
  const styleKey = mapping[shape] ?? shape;
  return theme.nodeStyles[styleKey] ?? theme.nodeStyles.default;
}

export function resolveEdgeStyle(theme: Theme, type: string): EdgeStyle {
  return theme.edgeStyles[type] ?? theme.edgeStyles.default;
}

