import React from 'react';
import type { Theme } from '../types.js';
import type { SequenceLayoutResult } from '../layout/sequence-layout.js';

function ParticipantBox({
  p,
  theme,
  bottomY,
}: {
  p: SequenceLayoutResult['participants'][0];
  theme: Theme;
  bottomY: number;
}) {
  const style = theme.nodeStyles.default;
  const isActor = p.type === 'actor';
  const cx = p.x + p.width / 2;

  return (
    <g>
      {/* Top box */}
      <rect
        x={p.x}
        y={p.y}
        width={p.width}
        height={p.height}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        rx={style.rx ?? 4}
        ry={style.ry ?? 4}
      />
      <text
        x={cx}
        y={p.y + p.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={theme.fontSize}
        fontFamily={theme.fontFamily}
        fill={style.textColor}
      >
        {p.label}
      </text>
      {/* Lifeline */}
      <line
        x1={cx}
        y1={p.y + p.height}
        x2={cx}
        y2={bottomY}
        stroke={theme.lineColor}
        strokeWidth={1}
        strokeDasharray="4,4"
      />
      {/* Bottom box */}
      <rect
        x={p.x}
        y={bottomY}
        width={p.width}
        height={p.height}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        rx={style.rx ?? 4}
        ry={style.ry ?? 4}
      />
      <text
        x={cx}
        y={bottomY + p.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={theme.fontSize}
        fontFamily={theme.fontFamily}
        fill={style.textColor}
      >
        {p.label}
      </text>
    </g>
  );
}

function MessageArrow({
  msg,
  theme,
  idPrefix,
}: {
  msg: SequenceLayoutResult['messages'][0];
  theme: Theme;
  idPrefix: string;
}) {
  const edgeStyle = theme.edgeStyles.default;
  const isDotted = msg.messageType.startsWith('dotted');
  const dashArray = isDotted ? '5,5' : undefined;

  if (msg.isSelf) {
    const loopW = 30,
      loopH = 30;
    const d = `M ${msg.fromX},${msg.y} L ${msg.fromX + loopW},${msg.y} L ${msg.fromX + loopW},${msg.y + loopH} L ${msg.fromX},${msg.y + loopH}`;
    return (
      <g>
        <path
          d={d}
          fill="none"
          stroke={edgeStyle.stroke}
          strokeWidth={edgeStyle.strokeWidth}
          strokeDasharray={dashArray}
          markerEnd={`url(#${idPrefix}-arrow)`}
        />
        {msg.label && (
          <text
            x={msg.fromX + loopW + 5}
            y={msg.y + loopH / 2}
            fontSize={theme.fontSize * 0.85}
            fontFamily={theme.fontFamily}
            fill={theme.primaryTextColor}
            dominantBaseline="central"
          >
            {msg.label}
          </text>
        )}
      </g>
    );
  }

  return (
    <g>
      <line
        x1={msg.fromX}
        y1={msg.y}
        x2={msg.toX}
        y2={msg.y}
        stroke={edgeStyle.stroke}
        strokeWidth={edgeStyle.strokeWidth}
        strokeDasharray={dashArray}
        markerEnd={`url(#${idPrefix}-arrow)`}
      />
      {msg.label && (
        <text
          x={(msg.fromX + msg.toX) / 2}
          y={msg.y - 8}
          textAnchor="middle"
          fontSize={theme.fontSize * 0.85}
          fontFamily={theme.fontFamily}
          fill={theme.primaryTextColor}
        >
          {msg.label}
        </text>
      )}
    </g>
  );
}

function NoteBox({ note, theme }: { note: SequenceLayoutResult['notes'][0]; theme: Theme }) {
  return (
    <g>
      <rect
        x={note.x}
        y={note.y}
        width={note.width}
        height={note.height}
        fill={theme.secondaryColor}
        stroke={theme.borderColor}
        strokeWidth={1}
      />
      <text
        x={note.x + note.width / 2}
        y={note.y + note.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={theme.fontSize * 0.85}
        fontFamily={theme.fontFamily}
        fill={theme.primaryTextColor}
      >
        {note.message}
      </text>
    </g>
  );
}

function BlockRect({ block, theme }: { block: SequenceLayoutResult['blocks'][0]; theme: Theme }) {
  return (
    <g>
      <rect
        x={block.x}
        y={block.y}
        width={block.width}
        height={block.height}
        fill="none"
        stroke={theme.borderColor}
        strokeWidth={1}
        strokeDasharray="3,3"
      />
      <rect x={block.x} y={block.y} width={60} height={20} fill={theme.borderColor} />
      <text
        x={block.x + 4}
        y={block.y + 14}
        fontSize={theme.fontSize * 0.75}
        fontFamily={theme.fontFamily}
        fill={theme.background}
        fontWeight="bold"
      >
        {block.type}
      </text>
      {block.label && (
        <text
          x={block.x + 66}
          y={block.y + 14}
          fontSize={theme.fontSize * 0.75}
          fontFamily={theme.fontFamily}
          fill={theme.primaryTextColor}
        >
          [{block.label}]
        </text>
      )}
      {block.sections.slice(1).map((section, i) => (
        <g key={i}>
          <line
            x1={block.x}
            y1={section.y}
            x2={block.x + block.width}
            y2={section.y}
            stroke={theme.borderColor}
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          {section.label && (
            <text
              x={block.x + 8}
              y={section.y + 14}
              fontSize={theme.fontSize * 0.75}
              fontFamily={theme.fontFamily}
              fill={theme.primaryTextColor}
            >
              [{section.label}]
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

function ActivationBar({
  act,
  theme,
}: {
  act: SequenceLayoutResult['activations'][0];
  theme: Theme;
}) {
  return (
    <rect
      x={act.x}
      y={act.startY}
      width={act.width}
      height={act.endY - act.startY}
      fill={theme.secondaryColor}
      stroke={theme.borderColor}
      strokeWidth={1}
    />
  );
}

export function renderSequenceElement(
  layout: SequenceLayoutResult,
  theme: Theme,
  idPrefix: string,
): React.ReactElement {
  const { height, participants, messages, notes, activations, blocks } = layout;
  const bottomY = height - 40 - 40; // PADDING - PARTICIPANT_HEIGHT

  return (
    <>
      <defs>
        <marker
          id={`${idPrefix}-arrow`}
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 Z" fill={theme.edgeStyles.default.arrowColor} />
        </marker>
      </defs>
      {/* Blocks (behind everything) */}
      {blocks.map((b, i) => (
        <BlockRect key={i} block={b} theme={theme} />
      ))}
      {/* Activations */}
      {activations.map((a, i) => (
        <ActivationBar key={i} act={a} theme={theme} />
      ))}
      {/* Participants + lifelines */}
      {participants.map((p) => (
        <ParticipantBox key={p.id} p={p} theme={theme} bottomY={bottomY} />
      ))}
      {/* Messages */}
      {messages.map((m) => (
        <MessageArrow key={m.id} msg={m} theme={theme} idPrefix={idPrefix} />
      ))}
      {/* Notes */}
      {notes.map((n, i) => (
        <NoteBox key={i} note={n} theme={theme} />
      ))}
    </>
  );
}

