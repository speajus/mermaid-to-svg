import React from 'react';

interface LabelTextProps {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontWeight?: string | number;
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
  dominantBaseline?: 'auto' | 'middle' | 'central' | 'hanging' | 'alphabetic' | 'ideographic' | 'mathematical' | 'text-before-edge' | 'text-after-edge' | 'inherit';
}

export function LabelText({
  x, y, text, fontSize, fontFamily, fill,
  fontWeight = 'normal',
  textAnchor = 'middle',
  dominantBaseline = 'central',
}: LabelTextProps) {
  const lines = text.split('\n');
  if (lines.length === 1) {
    return (
      <text
        x={x}
        y={y}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={fill}
        fontWeight={fontWeight}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
      >
        {text}
      </text>
    );
  }

  const lineHeight = fontSize * 1.3;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;

  return (
    <text
      x={x}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fill={fill}
      fontWeight={fontWeight}
      textAnchor={textAnchor}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? startY - y : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

interface EdgeLabelProps {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  background: string;
}

export function EdgeLabel({ x, y, text, fontSize, fontFamily, fill, background }: EdgeLabelProps) {
  const padding = 4;
  const estWidth = text.length * fontSize * 0.6 + padding * 2;
  const estHeight = fontSize * 1.2 + padding * 2;

  return (
    <g>
      <rect
        x={x - estWidth / 2}
        y={y - estHeight / 2}
        width={estWidth}
        height={estHeight}
        fill={background}
        rx={3}
        ry={3}
      />
      <LabelText
        x={x}
        y={y}
        text={text}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fill={fill}
      />
    </g>
  );
}

