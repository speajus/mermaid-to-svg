import { renderMermaid } from '../src/index.js';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');
mkdirSync(OUTPUT_DIR, { recursive: true });

const DIAGRAMS: Record<string, string> = {
  flowchart: `
flowchart TD
  A[Christmas] -->|Get money| B(Go shopping)
  B --> C{Let me think}
  C -->|One| D[Laptop]
  C -->|Two| E[iPhone]
  C -->|Three| F[fa:fa-car Car]
  D --> G((Done))
  E --> G
  F --> G
`,
  sequence: `
sequenceDiagram
  participant Alice
  participant Bob
  Alice->>Bob: Hello Bob, how are you?
  Bob-->>Alice: Great!
  Alice->>Bob: See you later!
`,
  class: `
classDiagram
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
  class Fish {
    -int sizeInFeet
    +canEat()
  }
  Animal <|-- Duck
  Animal <|-- Fish
`,
  state: `
stateDiagram-v2
  [*] --> Idle
  Idle --> Processing : submit
  Processing --> Done : complete
  Processing --> Error : fail
  Error --> Idle : retry
  Done --> [*]
`,
  er: `
erDiagram
  CUSTOMER {
    string name
    int id PK
  }
  ORDER {
    int orderId PK
    date created
  }
  CUSTOMER ||--o{ ORDER : places
`,
  gantt: `
gantt
  title Project Plan
  dateFormat YYYY-MM-DD
  section Design
    Wireframes :a1, 2024-01-01, 10d
    Mockups    :after a1, 5d
  section Development
    Backend    :2024-01-10, 20d
`,
  pie: `
pie title Pets adopted
  "Dogs" : 386
  "Cats" : 85
  "Rats" : 15
`,
  mindmap: `
mindmap
  root((Central))
    Origins
      Long history
      Popularisation
    Research
      On effectiveness
      On adoption
`,
};

const themes = ['default', 'dark', 'forest', 'neutral'] as const;

async function main() {
  // Generate theme variants (flowchart only, for backward compat)
  for (const themeName of themes) {
    const { svg, bounds } = await renderMermaid(DIAGRAMS.flowchart, { theme: themeName });
    writeFileSync(join(OUTPUT_DIR, `${themeName}.svg`), svg);
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width' as const, value: Math.max(bounds.width * 2, 800) },
    });
    writeFileSync(join(OUTPUT_DIR, `${themeName}.png`), resvg.render().asPng());
    console.log(`✓ theme/${themeName} → ${bounds.width}x${bounds.height}`);
  }

  // Generate one sample per diagram type (default theme)
  for (const [name, diagram] of Object.entries(DIAGRAMS)) {
    const { svg, bounds } = await renderMermaid(diagram);
    writeFileSync(join(OUTPUT_DIR, `${name}.svg`), svg);
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width' as const, value: Math.max(bounds.width * 2, 800) },
    });
    writeFileSync(join(OUTPUT_DIR, `${name}.png`), resvg.render().asPng());
    console.log(`✓ sample/${name} → ${bounds.width}x${bounds.height}`);
  }

  console.log(`\nAll outputs saved to ${OUTPUT_DIR}`);
}

main().catch(console.error);
