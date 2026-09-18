/**
 * Holds `wrangler.jsonc` to `src/config/site.ts`, whole, and fails.
 *
 * It also refuses the files Wrangler would read *instead*: `wrangler.json`
 * and `wrangler.toml` come first in its search, and a redirected
 * `.wrangler/deploy/config.json` comes before all of them — any of which
 * would deploy something this never read.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseJsonc } from '../src/config/jsonc.ts';
import { EXPECTED_WRANGLER_CONFIG, differences } from '../src/config/site.ts';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const problems: string[] = [];

for (const competing of ['wrangler.json', 'wrangler.toml', '.wrangler/deploy/config.json']) {
  if (existsSync(join(repository, competing))) problems.push(`${competing} would be read instead of wrangler.jsonc`);
}

let parsed: unknown = null;
try {
  parsed = parseJsonc(readFileSync(join(repository, 'wrangler.jsonc'), 'utf8'));
} catch {
  problems.push('wrangler.jsonc is not JSON with comments');
}
if (parsed !== null) problems.push(...differences(parsed, EXPECTED_WRANGLER_CONFIG));

if (problems.length > 0) {
  process.stderr.write('check-config: wrangler.jsonc is not what src/config/site.ts says it is\n');
  for (const problem of problems) process.stderr.write(`  ${problem}\n`);
  process.exit(1);
}
process.stdout.write('check-config: wrangler.jsonc is exactly what src/config/site.ts says\n');
