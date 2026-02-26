#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { renderMermaid } from './index.js';
import { Resvg } from '@resvg/resvg-js';

const THEMES = ['default', 'dark', 'forest', 'neutral'] as const;
type ThemeName = (typeof THEMES)[number];
const FORMATS = ['svg', 'png'] as const;
type OutputFormat = (typeof FORMATS)[number];

interface CliArgs {
  input?: string;
  output?: string;
  theme: ThemeName;
  format?: OutputFormat;
  scale: number;
  help: boolean;
}

function printHelp(): void {
  console.log(`Usage: mermaid-to-svg [options] [file]

Render a Mermaid diagram to SVG or PNG.

Arguments:
  file                  Input .mmd file (reads from stdin if omitted)

Options:
  -t, --theme <name>    Theme: default, dark, forest, neutral (default: "default")
  -f, --format <fmt>    Output format: svg, png (default: auto-detect from -o, else svg)
  -s, --scale <n>       PNG scale factor (default: 2)
  -o, --output <file>   Output file (writes to stdout if omitted)
  -h, --help            Show this help message

Examples:
  echo "flowchart LR; A-->B" | mermaid-to-svg
  mermaid-to-svg diagram.mmd -o diagram.svg
  mermaid-to-svg diagram.mmd -o diagram.png
  mermaid-to-svg diagram.mmd --theme dark --format png > dark.png
  cat diagram.mmd | mermaid-to-svg -t forest -f png -s 3 -o output.png`);
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { theme: 'default', scale: 2, help: false };
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
    } else if (arg === '-f' || arg === '--format') {
      const val = argv[++i];
      if (!val || !FORMATS.includes(val as OutputFormat)) {
        console.error(`Error: Invalid format "${val}". Choose from: ${FORMATS.join(', ')}`);
        process.exit(1);
      }
      args.format = val as OutputFormat;
    } else if (arg === '-s' || arg === '--scale') {
      const val = argv[++i];
      const n = Number(val);
      if (!val || !isFinite(n) || n <= 0) {
        console.error(`Error: Invalid scale "${val}". Must be a positive number.`);
        process.exit(1);
      }
      args.scale = n;
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

function resolveFormat(args: CliArgs): OutputFormat {
  if (args.format) return args.format;
  if (args.output?.endsWith('.png')) return 'png';
  return 'svg';
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

  const format = resolveFormat(args);

  try {
    const { svg, bounds } = await renderMermaid(input, { theme: args.theme });

    if (format === 'png') {
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'width' as const, value: Math.max(bounds.width * args.scale, 100) },
      });
      const pngBuffer = resvg.render().asPng();

      if (args.output) {
        writeFileSync(args.output, pngBuffer);
        console.error(`Wrote ${pngBuffer.length} bytes PNG to ${args.output}`);
      } else {
        process.stdout.write(pngBuffer);
      }
    } else {
      if (args.output) {
        writeFileSync(args.output, svg);
        console.error(`Wrote ${svg.length} bytes SVG to ${args.output}`);
      } else {
        process.stdout.write(svg);
      }
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();

