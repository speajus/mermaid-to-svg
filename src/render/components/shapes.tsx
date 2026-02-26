import React from 'react';
import type { NodeStyle, NodeShape } from '../../types.js';
import { LabelText } from './text.js';
import { gradientId, shadowFilterId } from './containers.js';

interface ShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  style: NodeStyle;
  fontSize: number;
  fontFamily: string;
  idPrefix?: string;
  styleKey?: string;
}

/** Resolve fill: use gradient URL if available, otherwise flat fill */
function resolveFill(style: NodeStyle, idPrefix?: string, styleKey?: string): string {
  if (style.gradient && idPrefix && styleKey) {
    return `url(#${gradientId(idPrefix, styleKey)})`;
  }
  return style.fill;
}

/** Resolve filter: use shadow filter URL if available */
function resolveFilter(style: NodeStyle, idPrefix?: string, styleKey?: string): string | undefined {
  if (style.shadow && idPrefix && styleKey) {
    return `url(#${shadowFilterId(idPrefix, styleKey)})`;
  }
  return undefined;
}

export function NodeRect({
  x,
  y,
  width,
  height,
  label,
  style,
  fontSize,
  fontFamily,
  idPrefix,
  styleKey,
}: ShapeProps) {
  const fill = resolveFill(style, idPrefix, styleKey);
  const filter = resolveFilter(style, idPrefix, styleKey);
  return (
    <g filter={filter}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        rx={style.rx ?? 0}
        ry={style.ry ?? 0}
        opacity={style.fillOpacity}
      />
      <LabelText
        x={x + width / 2}
        y={y + height / 2}
        text={label}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={style.textColor}
      />
    </g>
  );
}

export function NodeDiamond({
  x,
  y,
  width,
  height,
  label,
  style,
  fontSize,
  fontFamily,
  idPrefix,
  styleKey,
}: ShapeProps) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const points = `${cx},${y} ${x + width},${cy} ${cx},${y + height} ${x},${cy}`;
  const fill = resolveFill(style, idPrefix, styleKey);
  const filter = resolveFilter(style, idPrefix, styleKey);
  return (
    <g filter={filter}>
      <polygon
        points={points}
        fill={fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        opacity={style.fillOpacity}
      />
      <LabelText
        x={cx}
        y={cy}
        text={label}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={style.textColor}
      />
    </g>
  );
}

export function NodeCircle({
  x,
  y,
  width,
  height,
  label,
  style,
  fontSize,
  fontFamily,
  idPrefix,
  styleKey,
}: ShapeProps) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = Math.min(width, height) / 2;
  const fill = resolveFill(style, idPrefix, styleKey);
  const filter = resolveFilter(style, idPrefix, styleKey);
  return (
    <g filter={filter}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        opacity={style.fillOpacity}
      />
      <LabelText
        x={cx}
        y={cy}
        text={label}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={style.textColor}
      />
    </g>
  );
}

export function NodeStadium({
  x,
  y,
  width,
  height,
  label,
  style,
  fontSize,
  fontFamily,
  idPrefix,
  styleKey,
}: ShapeProps) {
  const r = height / 2;
  const fill = resolveFill(style, idPrefix, styleKey);
  const filter = resolveFilter(style, idPrefix, styleKey);
  return (
    <g filter={filter}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        rx={r}
        ry={r}
        opacity={style.fillOpacity}
      />
      <LabelText
        x={x + width / 2}
        y={y + height / 2}
        text={label}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={style.textColor}
      />
    </g>
  );
}

export function NodeCylinder({
  x,
  y,
  width,
  height,
  label,
  style,
  fontSize,
  fontFamily,
  idPrefix,
  styleKey,
}: ShapeProps) {
  const ry = 8;
  const bodyHeight = height - ry;
  const d = [
    `M ${x},${y + ry}`,
    `A ${width / 2},${ry} 0 0 1 ${x + width},${y + ry}`,
    `V ${y + bodyHeight}`,
    `A ${width / 2},${ry} 0 0 1 ${x},${y + bodyHeight}`,
    `Z`,
  ].join(' ');
  const topEllipse = `M ${x},${y + ry} A ${width / 2},${ry} 0 0 0 ${x + width},${y + ry}`;
  const fill = resolveFill(style, idPrefix, styleKey);
  const filter = resolveFilter(style, idPrefix, styleKey);
  return (
    <g filter={filter}>
      <path
        d={d}
        fill={fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        opacity={style.fillOpacity}
      />
      <path d={topEllipse} fill="none" stroke={style.stroke} strokeWidth={style.strokeWidth} />
      <LabelText
        x={x + width / 2}
        y={y + height / 2}
        text={label}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={style.textColor}
      />
    </g>
  );
}

export function NodeSubroutine({
  x,
  y,
  width,
  height,
  label,
  style,
  fontSize,
  fontFamily,
  idPrefix,
  styleKey,
}: ShapeProps) {
  const inset = 8;
  const fill = resolveFill(style, idPrefix, styleKey);
  const filter = resolveFilter(style, idPrefix, styleKey);
  return (
    <g filter={filter}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        opacity={style.fillOpacity}
      />
      <line
        x1={x + inset}
        y1={y}
        x2={x + inset}
        y2={y + height}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />
      <line
        x1={x + width - inset}
        y1={y}
        x2={x + width - inset}
        y2={y + height}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
      />
      <LabelText
        x={x + width / 2}
        y={y + height / 2}
        text={label}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={style.textColor}
      />
    </g>
  );
}

export function NodeHexagon({
  x,
  y,
  width,
  height,
  label,
  style,
  fontSize,
  fontFamily,
  idPrefix,
  styleKey,
}: ShapeProps) {
  const inset = width * 0.15;
  const points = [
    `${x + inset},${y}`,
    `${x + width - inset},${y}`,
    `${x + width},${y + height / 2}`,
    `${x + width - inset},${y + height}`,
    `${x + inset},${y + height}`,
    `${x},${y + height / 2}`,
  ].join(' ');
  const fill = resolveFill(style, idPrefix, styleKey);
  const filter = resolveFilter(style, idPrefix, styleKey);
  return (
    <g filter={filter}>
      <polygon
        points={points}
        fill={fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        opacity={style.fillOpacity}
      />
      <LabelText
        x={x + width / 2}
        y={y + height / 2}
        text={label}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={style.textColor}
      />
    </g>
  );
}

/** Dispatch to the correct shape component */
export function NodeShape(props: ShapeProps & { shape: NodeShape }) {
  const { shape, ...rest } = props;
  switch (shape) {
    case 'diamond':
      return <NodeDiamond {...rest} />;
    case 'circle':
      return <NodeCircle {...rest} />;
    case 'stadium':
      return <NodeStadium {...rest} />;
    case 'rounded':
      return <NodeRect {...rest} style={{ ...rest.style, rx: 20, ry: 20 }} />;
    case 'cylinder':
      return <NodeCylinder {...rest} />;
    case 'subroutine':
      return <NodeSubroutine {...rest} />;
    case 'hexagon':
      return <NodeHexagon {...rest} />;
    default:
      return <NodeRect {...rest} />;
  }
}
