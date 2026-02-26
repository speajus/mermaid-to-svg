import type { FontMetricsProvider, TextMetrics } from '../types.js';

/**
 * Default estimation-based font metrics.
 * Uses average character width ratios for common font families.
 */
export const estimationFontMetrics: FontMetricsProvider = {
  measureText(text: string, fontSize: number, _fontFamily: string, _fontWeight?: string | number): TextMetrics {
    // Average character width is ~0.6 of font size for sans-serif fonts
    const avgCharWidth = fontSize * 0.6;
    const width = text.length * avgCharWidth;
    const height = fontSize * 1.2; // line height
    const ascent = fontSize * 0.8;
    const descent = fontSize * 0.2;
    return { width, height, ascent, descent };
  },
};

