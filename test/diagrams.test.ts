import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from '../src/parse/index.js';
import { layout } from '../src/layout/index.js';
import { renderSvg } from '../src/render/index.js';
import { defaultTheme } from '../src/themes/index.js';

// ── Sequence Diagrams ──────────────────────────────────────────────────────

describe('sequence diagram', () => {
  const SEQ = `sequenceDiagram
    participant Alice
    actor Bob
    Alice->>Bob: Hello Bob
    Bob-->>Alice: Hi Alice
    Note right of Bob: Thinking
    loop Every minute
      Bob->>Alice: Ping
    end
    alt success
      Alice->>Bob: Great
    else failure
      Alice->>Bob: Oh no
    end
  `;

  it('parses participants and messages', async () => {
    const ir = await parse(SEQ);
    assert.equal(ir.type, 'sequence');
    if (ir.type !== 'sequence') return;
    assert.equal(ir.participants.length, 2);
    assert.equal(ir.participants[0].id, 'Alice');
    assert.equal(ir.participants[0].type, 'participant');
    assert.equal(ir.participants[1].id, 'Bob');
    assert.equal(ir.participants[1].type, 'actor');
    assert.ok(ir.messages.length >= 4, `Expected >= 4 messages, got ${ir.messages.length}`);
  });

  it('parses notes', async () => {
    const ir = await parse(SEQ);
    if (ir.type !== 'sequence') return;
    assert.ok(ir.notes.length >= 1);
    assert.equal(ir.notes[0].placement, 'right');
    assert.ok(ir.notes[0].message.includes('Thinking'));
  });

  it('parses blocks (loop, alt)', async () => {
    const ir = await parse(SEQ);
    if (ir.type !== 'sequence') return;
    assert.ok(ir.blocks.length >= 2, `Expected >= 2 blocks, got ${ir.blocks.length}`);
    const loop = ir.blocks.find(b => b.type === 'loop');
    assert.ok(loop, 'Expected loop block');
    const alt = ir.blocks.find(b => b.type === 'alt');
    assert.ok(alt, 'Expected alt block');
    assert.ok((alt?.sections.length ?? 0) >= 2, 'alt should have 2+ sections');
  });

  it('layouts and renders SVG', async () => {
    const ir = await parse(SEQ);
    const positioned = await layout(ir);
    assert.equal(positioned.diagramType, 'sequence');
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes('Alice'));
    assert.ok(svg.includes('Bob'));
    assert.ok(svg.includes('Hello Bob'));
  });
});

// ── Class Diagrams ─────────────────────────────────────────────────────────

describe('class diagram', () => {
  const CLS = `classDiagram
    class Animal {
      +int age
      +String gender
      +isMammal() bool
      +mate()
    }
    class Duck {
      +String beakColor
      +swim()
      +quack()
    }
    Animal <|-- Duck
  `;

  it('parses classes and relationships', async () => {
    const ir = await parse(CLS);
    assert.equal(ir.type, 'class');
    if (ir.type !== 'class') return;
    assert.ok(ir.classes.length >= 2);
    const animal = ir.classes.find(c => c.id === 'Animal');
    assert.ok(animal);
    assert.ok(animal!.members.length >= 2, `Expected >= 2 members, got ${animal!.members.length}`);
    assert.ok(animal!.methods.length >= 2, `Expected >= 2 methods, got ${animal!.methods.length}`);
    assert.ok(ir.relationships.length >= 1);
    assert.equal(ir.relationships[0].relationType, 'inheritance');
  });

  it('layouts and renders SVG', async () => {
    const ir = await parse(CLS);
    const positioned = await layout(ir);
    assert.equal(positioned.diagramType, 'class');
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes('Animal'));
    assert.ok(svg.includes('Duck'));
  });
});

// ── State Diagrams ─────────────────────────────────────────────────────────

describe('state diagram', () => {
  const STATE = `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : submit
    Processing --> Done : complete
    Processing --> Error : fail
    Error --> Idle : retry
    Done --> [*]
  `;

  it('parses states and transitions', async () => {
    const ir = await parse(STATE);
    assert.equal(ir.type, 'state');
    if (ir.type !== 'state') return;
    assert.ok(ir.states.length >= 4, `Expected >= 4 states, got ${ir.states.length}`);
    const idle = ir.states.find(s => s.id === 'Idle');
    assert.ok(idle, 'Expected Idle state');
    assert.ok(ir.transitions.length >= 5, `Expected >= 5 transitions, got ${ir.transitions.length}`);
    const submit = ir.transitions.find(t => t.label === 'submit');
    assert.ok(submit, 'Expected transition with label "submit"');
  });

  it('layouts and renders SVG', async () => {
    const ir = await parse(STATE);
    const positioned = await layout(ir);
    assert.equal(positioned.diagramType, 'state');
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes('Idle'));
    assert.ok(svg.includes('Processing'));
  });
});

