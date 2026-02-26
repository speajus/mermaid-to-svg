import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Theme } from '../types.js';
import type { GanttLayoutResult } from '../layout/gantt-layout.js';

const SECTION_COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949'];

export function renderGanttElement(
  layout: GanttLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): React.ReactElement {
  const sectionColorMap = new Map<string, string>();
  layout.sections.forEach((s, i) =>
    sectionColorMap.set(s, SECTION_COLORS[i % SECTION_COLORS.length]),
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={layout.width}
      height={layout.height}
      style={{ background: theme.background }}
    >
      {/* Title */}
      {layout.title && (
        <text
          x={layout.width / 2}
          y={24}
          textAnchor="middle"
          fontSize={theme.fontSize * 1.2}
          fontWeight="bold"
          fontFamily={theme.fontFamily}
          fill={theme.primaryTextColor}
        >
          {layout.title}
        </text>
      )}
      {/* Section headers and task bars */}
      {(() => {
        let lastSection = '';
        return layout.tasks.map((t, i) => {
          const showSection = t.section !== lastSection;
          lastSection = t.section;
          const barColor = sectionColorMap.get(t.section) ?? SECTION_COLORS[0];
          return (
            <g key={t.id}>
              {showSection && (
                <text
                  x={10}
                  y={t.y - 8}
                  fontSize={theme.fontSize * 0.9}
                  fontWeight="bold"
                  fontFamily={theme.fontFamily}
                  fill={theme.primaryTextColor}
                >
                  {t.section}
                </text>
              )}
              {/* Task bar */}
              <rect
                x={t.x}
                y={t.y}
                width={t.width}
                height={t.height}
                fill={barColor}
                rx={3}
                ry={3}
                opacity={0.8}
              />
              {/* Task label (left of bar) */}
              <text
                x={t.x - 8}
                y={t.y + t.height / 2}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={theme.fontSize * 0.85}
                fontFamily={theme.fontFamily}
                fill={theme.primaryTextColor}
              >
                {t.label}
              </text>
            </g>
          );
        });
      })()}
    </svg>
  );
}

export function renderGanttSvg(
  layout: GanttLayoutResult,
  theme: Theme,
  idPrefix: string = 'mermaid',
): string {
  return renderToStaticMarkup(renderGanttElement(layout, theme, idPrefix));
}
