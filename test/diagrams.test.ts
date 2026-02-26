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

// ── Sequence Edge Cases ───────────────────────────────────────────────────

describe('sequence edge cases', () => {
  it('handles self-messages (A->>A)', async () => {
    const ir = await parse(`sequenceDiagram
      participant A
      participant B
      A->>A: Self call
      A->>B: Normal
    `);
    assert.equal(ir.type, 'sequence');
    if (ir.type !== 'sequence') return;
    const selfMsg = ir.messages.find(m => m.from === 'A' && m.to === 'A');
    assert.ok(selfMsg, 'Expected a self-message');
    assert.equal(selfMsg!.label, 'Self call');

    // Layout should mark isSelf and render without error
    const positioned = await layout(ir);
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.includes('Self call'));
  });

  it('handles activations', async () => {
    const ir = await parse(`sequenceDiagram
      participant A
      participant B
      activate A
      A->>B: Hello
      deactivate A
    `);
    assert.equal(ir.type, 'sequence');
    if (ir.type !== 'sequence') return;
    assert.ok(ir.activations.length >= 1, `Expected >= 1 activation, got ${ir.activations.length}`);
    assert.equal(ir.activations[0].participant, 'A');
  });

  it('handles nested blocks (loop inside alt)', async () => {
    const ir = await parse(`sequenceDiagram
      participant A
      participant B
      alt online
        loop every 5s
          A->>B: Ping
        end
      else offline
        A->>B: Reconnect
      end
    `);
    assert.equal(ir.type, 'sequence');
    if (ir.type !== 'sequence') return;
    const alt = ir.blocks.find(b => b.type === 'alt');
    assert.ok(alt, 'Expected alt block');
    assert.ok(alt!.sections.length >= 2, 'alt should have 2+ sections');
    // The nested loop should be a separate block
    const loop = ir.blocks.find(b => b.type === 'loop');
    assert.ok(loop, 'Expected nested loop block');
  });

  it('handles opt and par blocks', async () => {
    const ir = await parse(`sequenceDiagram
      participant A
      participant B
      participant C
      opt condition met
        A->>B: Do something
      end
      par parallel
        A->>B: Task 1
      and
        A->>C: Task 2
      end
    `);
    assert.equal(ir.type, 'sequence');
    if (ir.type !== 'sequence') return;
    const opt = ir.blocks.find(b => b.type === 'opt');
    assert.ok(opt, 'Expected opt block');
    const par = ir.blocks.find(b => b.type === 'par');
    assert.ok(par, 'Expected par block');
    assert.ok(par!.sections.length >= 2, 'par should have 2+ sections');
  });

  it('renders self-messages + activations end-to-end', async () => {
    const ir = await parse(`sequenceDiagram
      participant A
      participant B
      A->>A: Reflect
      activate A
      A->>B: Forward
      deactivate A
    `);
    const positioned = await layout(ir);
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes('Reflect'));
    assert.ok(svg.includes('Forward'));
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

// ── Class Edge Cases ──────────────────────────────────────────────────────

describe('class edge cases', () => {
  it('handles multiple relationship types', async () => {
    const ir = await parse(`classDiagram
      class A
      class B
      class C
      class D
      A <|-- B : extends
      A *-- C : contains
      A o-- D : aggregates
      B ..> C : uses
      A <|.. D : implements
    `);
    assert.equal(ir.type, 'class');
    if (ir.type !== 'class') return;
    assert.ok(ir.relationships.length >= 5, `Expected >= 5 relationships, got ${ir.relationships.length}`);
    const inheritance = ir.relationships.find(r => r.relationType === 'inheritance');
    assert.ok(inheritance, 'Expected inheritance relationship');
    const composition = ir.relationships.find(r => r.relationType === 'composition');
    assert.ok(composition, 'Expected composition relationship');
    const aggregation = ir.relationships.find(r => r.relationType === 'aggregation');
    assert.ok(aggregation, 'Expected aggregation relationship');
    const dependency = ir.relationships.find(r => r.relationType === 'dependency');
    assert.ok(dependency, 'Expected dependency relationship');
    const realization = ir.relationships.find(r => r.relationType === 'realization');
    assert.ok(realization, 'Expected realization relationship');
  });

  it('handles relationship labels', async () => {
    const ir = await parse(`classDiagram
      class A
      class B
      A <|-- B : extends
    `);
    assert.equal(ir.type, 'class');
    if (ir.type !== 'class') return;
    const rel = ir.relationships[0];
    assert.equal(rel.label, 'extends');
  });

  it('handles annotations (interface, abstract)', async () => {
    const ir = await parse(`classDiagram
      class Shape {
        <<interface>>
        +draw() void
      }
      class Circle {
        +radius : double
        +draw() void
      }
      Shape <|.. Circle
    `);
    assert.equal(ir.type, 'class');
    if (ir.type !== 'class') return;
    const shape = ir.classes.find(c => c.id === 'Shape');
    assert.ok(shape, 'Expected Shape class');
    assert.ok(shape!.annotations.length >= 1, 'Expected interface annotation');

    const positioned = await layout(ir);
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.includes('Shape'));
    assert.ok(svg.includes('Circle'));
  });

  it('handles class with no members', async () => {
    const ir = await parse(`classDiagram
      class Empty
      class Full {
        +String name
      }
      Empty --> Full
    `);
    assert.equal(ir.type, 'class');
    if (ir.type !== 'class') return;
    const empty = ir.classes.find(c => c.id === 'Empty');
    assert.ok(empty, 'Expected Empty class');
    assert.equal(empty!.members.length, 0);
    assert.equal(empty!.methods.length, 0);

    const positioned = await layout(ir);
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.includes('Empty'));
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


// ── State Edge Cases ──────────────────────────────────────────────────────

describe('state edge cases', () => {
  it('handles nested/composite states', async () => {
    const ir = await parse(`stateDiagram-v2
      [*] --> Active
      Active --> [*]
      state Active {
        [*] --> Idle
        Idle --> Running : start
        Running --> Idle : stop
      }
    `);
    assert.equal(ir.type, 'state');
    if (ir.type !== 'state') return;
    const active = ir.states.find(s => s.id === 'Active');
    assert.ok(active, 'Expected Active state');
    const idle = ir.states.find(s => s.id === 'Idle');
    assert.ok(idle, 'Expected nested Idle state');
    const running = ir.states.find(s => s.id === 'Running');
    assert.ok(running, 'Expected nested Running state');
    const startTrans = ir.transitions.find(t => t.label === 'start');
    assert.ok(startTrans, 'Expected transition with label "start"');
    const stopTrans = ir.transitions.find(t => t.label === 'stop');
    assert.ok(stopTrans, 'Expected transition with label "stop"');
  });

  it('renders nested states end-to-end', async () => {
    const ir = await parse(`stateDiagram-v2
      [*] --> Active
      Active --> [*]
      state Active {
        [*] --> Idle
        Idle --> Running : start
        Running --> Idle : stop
      }
    `);
    const positioned = await layout(ir);
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.startsWith('<svg'));
    assert.ok(svg.includes('Active'));
    assert.ok(svg.includes('Idle'));
    assert.ok(svg.includes('Running'));
  });

  it('handles choice pseudo-state', async () => {
    const ir = await parse(`stateDiagram-v2
      [*] --> First
      state check <<choice>>
      First --> check
      check --> Second : yes
      check --> Third : no
    `);
    assert.equal(ir.type, 'state');
    if (ir.type !== 'state') return;
    const first = ir.states.find(s => s.id === 'First');
    assert.ok(first, 'Expected First state');
    const choice = ir.states.find(s => s.id === 'check');
    assert.ok(choice, 'Expected choice state');
  });

  it('handles multiple start-end transitions', async () => {
    const ir = await parse(`stateDiagram-v2
      [*] --> A
      A --> B
      B --> C
      C --> [*]
    `);
    assert.equal(ir.type, 'state');
    if (ir.type !== 'state') return;
    const starts = ir.states.filter(s => s.type === 'start');
    assert.ok(starts.length >= 1, 'Expected at least one start state');
    const ends = ir.states.filter(s => s.type === 'end');
    assert.ok(ends.length >= 1, 'Expected at least one end state');
    assert.ok(ir.transitions.length >= 4, `Expected >= 4 transitions, got ${ir.transitions.length}`);

    const positioned = await layout(ir);
    const svg = renderSvg(positioned, defaultTheme);
    assert.ok(svg.startsWith('<svg'));
  });
});