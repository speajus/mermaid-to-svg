import React from 'react';
import type { Theme, GradientConfig, ShadowConfig } from '../../types.js';

interface SvgRootProps {
  width: number;
  height: number;
  padding?: number;
  background: string;
  idPrefix: string;
  children: React.ReactNode;
}

export function SvgRoot({
  width,
  height,
  padding = 0,
  background,
  idPrefix,
  children,
}: SvgRootProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
    >
      <rect width={width} height={height} fill={background} />
      {padding > 0 ? <g transform={`translate(${padding}, ${padding})`}>{children}</g> : children}
    </svg>
  );
}

/** Generate a unique gradient ID from a GradientConfig */
export function gradientId(idPrefix: string, key: string): string {
  return `${idPrefix}-grad-${key}`;
}

/** Generate the shadow filter ID */
export function shadowFilterId(idPrefix: string, key: string): string {
  return `${idPrefix}-shadow-${key}`;
}

interface ArrowDefsProps {
  idPrefix: string;
  theme: Theme;
}

export function ArrowDefs({ idPrefix, theme }: ArrowDefsProps) {
  const color = theme.edgeStyles.default.arrowColor;

  // Collect unique gradients and shadows from node styles
  const gradients: Array<{ key: string; config: GradientConfig }> = [];
  const shadows: Array<{ key: string; config: ShadowConfig }> = [];

  for (const [key, style] of Object.entries(theme.nodeStyles)) {
    if (style.gradient) {
      gradients.push({ key, config: style.gradient });
    }
    if (style.shadow) {
      shadows.push({ key, config: style.shadow });
    }
  }

  return (
    <defs>
      {/* Arrow markers */}
      <marker
        id={`${idPrefix}-arrow`}
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 Z" fill={color} />
      </marker>
      <marker
        id={`${idPrefix}-arrow-open`}
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke={color} strokeWidth="1.5" />
      </marker>
      <marker
        id={`${idPrefix}-arrow-cross`}
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <path d="M 2 2 L 8 8 M 8 2 L 2 8" fill="none" stroke={color} strokeWidth="1.5" />
      </marker>
      <marker
        id={`${idPrefix}-arrow-circle`}
        viewBox="0 0 10 10"
        refX="5"
        refY="5"
        markerWidth="8"
        markerHeight="8"
        orient="auto"
      >
        <circle cx="5" cy="5" r="4" fill={color} />
      </marker>

      {/* Gradient definitions */}
      {gradients.map(({ key, config }) => {
        const angle = config.direction ?? 180;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 - Math.sin(rad) * 50;
        const y1 = 50 - Math.cos(rad) * 50;
        const x2 = 50 + Math.sin(rad) * 50;
        const y2 = 50 + Math.cos(rad) * 50;

        if (config.type === 'radial') {
          return (
            <radialGradient key={key} id={gradientId(idPrefix, key)} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={config.from} />
              <stop offset="100%" stopColor={config.to} />
            </radialGradient>
          );
        }

        return (
          <linearGradient
            key={key}
            id={gradientId(idPrefix, key)}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
          >
            <stop offset="0%" stopColor={config.from} />
            <stop offset="100%" stopColor={config.to} />
          </linearGradient>
        );
      })}

      {/* Shadow filter definitions */}
      {shadows.map(({ key, config }) => (
        <filter
          key={key}
          id={shadowFilterId(idPrefix, key)}
          x="-20%"
          y="-20%"
          width="150%"
          height="150%"
        >
          <feDropShadow
            dx={config.dx}
            dy={config.dy}
            stdDeviation={config.blur}
            floodColor={config.color}
            floodOpacity="1"
          />
        </filter>
      ))}
    </defs>
  );
}
