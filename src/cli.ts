#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { renderMermaid } from './index.js';

const THEMES = ['default', 'dark', 'forest', 'neutral'] as const;
type ThemeName = (typeof THEMES)[number];

interface CliArgs {
  input?: string;
  output?: string;
  theme: ThemeName;
  help: boolean;
}

function printHelp(): void {
  console.log(`Usage: mermaid-to-svg [options] [file]

Render a Mermaid diagram to SVG.

Arguments:
  file                  Input .mmd file (reads from stdin if omitted)

Options:
  -t, --theme <name>    Theme: default, dark, forest, neutral (default: "default")
  -o, --output <file>   Output file (writes to stdout if omitted)
  -h, --help            Show this help message

Examples:
  echo "flowchart LR; A-->B" | mermaid-to-svg
  mermaid-to-svg diagram.mmd -o diagram.svg
  mermaid-to-svg diagram.mmd --theme dark > dark.svg
  cat diagram.mmd | mermaid-to-svg -t forest -o output.svg`);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { theme: 'default', help: false };
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      args.help = true;
    } else if (arg === '-t' || arg === '--theme') {
      const val = argv[++i];
      if (!val || !THEMES.includes(val as ThemeName)) {
        console.error(`Error: Invalid theme "${val}". Choose from: ${THEMES.join(', ')}`);
        process.exit(1);
      }
      args.theme = val as ThemeName;
    } else if (arg === '-o' || arg === '--output') {
      args.output = argv[++i];
      if (!args.output) {
        console.error('Error: --output requires a file path');
        process.exit(1);
      }
    } else if (!arg.startsWith('-')) {
      args.input = arg;
    } else {
      console.error(`Error: Unknown option "${arg}". Use --help for usage.`);
      process.exit(1);
    }
    i++;
  }
  return args;
}

function readInput(filePath?: string): string {
  if (filePath) {
    try {
      return readFileSync(filePath, 'utf-8');
    } catch (err: any) {
      console.error(`Error: Cannot read file "${filePath}": ${err.message}`);
      process.exit(1);
    }
  }
  // Read from stdin
  try {
    return readFileSync(0, 'utf-8');
  } catch {
    console.error('Error: No input provided. Pass a file or pipe via stdin.');
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const input = readInput(args.input);
  if (!input.trim()) {
    console.error('Error: Empty input.');
    process.exit(1);
  }

  try {
    const { svg } = await renderMermaid(input, { theme: args.theme });

    if (args.output) {
      writeFileSync(args.output, svg);
      console.error(`Wrote ${svg.length} bytes to ${args.output}`);
    } else {
      process.stdout.write(svg);
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();

