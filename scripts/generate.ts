/**
 * Turns the snapshot into the pages the site builds.
 *
 * `snapshot/files/` holds the application's documents exactly as they are
 * there, which is not quite what a Starlight site can build: a specification
 * is plain Markdown under a `# Title`, and a page wants its title in
 * frontmatter. So each placed document becomes a page — its own title and
 * opening line lifted into frontmatter, a note saying which commit it is a
 * copy of, then its text, untouched — and the platform guides, which were
 * written as Starlight pages, are copied as they are, pictures beside them.
 *
 * **What this writes is never committed** (`.gitignore` names it): it is
 * derived, and the snapshot is the truth. It runs before `dev`, `check` and
 * `build`, here and in Cloudflare's build alike.
 *
 * It fails rather than guess: a published document with no place on the
 * site, a place with no document behind it, a specification that does not
 * begin with its title.
 */

import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseManifest } from '../src/snapshot/manifest.ts';
import { escapePlaceholders } from '../src/snapshot/placeholders.ts';
import { DOCUMENTS, FOLDERS, GENERATED, placementOf } from '../src/snapshot/placement.ts';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = join(repository, 'snapshot', 'files');
const content = join(repository, 'src', 'content', 'docs');

function fail(says: string): never {
  process.stderr.write(`generate: ${says}\n`);
  process.exit(1);
}

const manifest = parseManifest(readFileSync(join(repository, 'snapshot', 'manifest.json'), 'utf8'));
const held = new Map(manifest.files.map((file) => [file.path, file]));

const unplaced = manifest.files.filter((file) => placementOf(file.path) === null);
if (unplaced.length > 0) {
  fail(`published and not placed — src/snapshot/placement.ts must say where each appears: ${unplaced.map((file) => file.path).join(', ')}`);
}

for (const path of GENERATED) rmSync(join(content, path), { recursive: true, force: true });

const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const taken = `commit \`${manifest.source.commit.slice(0, 7)}\` of ${day.format(new Date(manifest.source.committedAt))}`;

for (const document of DOCUMENTS) {
  const entry = held.get(document.source);
  if (entry === undefined) fail(`${document.source} has a place on the site and is not in the snapshot`);
  const text = readFileSync(join(files, document.source), 'utf8');

  const lines = text.split('\n');
  const first = lines.findIndex((line) => line.trim() !== '');
  const title = /^# (.+)$/.exec(lines[first] ?? '')?.[1]?.trim();
  if (title === undefined) fail(`${document.source} does not begin with its title, as "# Title"`);
  const body = lines.slice(first + 1).join('\n').replace(/^\n+/, '');
  // The line under the title that says in a sentence what the document is.
  const opening = /^\*\*(.+?)\*\*\s*$/m.exec(body.slice(0, 600))?.[1];

  const what = document.kind === 'specification' ? 'specification' : 'guide';
  const page =
    '---\n' +
    `title: ${JSON.stringify(title)}\n` +
    (opening === undefined ? '' : `description: ${JSON.stringify(opening)}\n`) +
    'sidebar:\n' +
    `  label: ${JSON.stringify(document.label)}\n` +
    `  order: ${String(document.order)}\n` +
    'editUrl: false\n' +
    'tableOfContents:\n  minHeadingLevel: 2\n  maxHeadingLevel: 3\n' +
    '---\n\n' +
    ':::note[A snapshot]\n' +
    `This ${what} is a copy of \`${document.source}\` in the application's repository, taken at ${taken}` +
    (entry.version === undefined ? '' : ` — version ${entry.version}`) +
    '. It is imported byte for byte and is not edited here; a change is made there, and arrives with the next snapshot.\n' +
    ':::\n\n' +
    // `<platform>` in running text stays the text it was written as.
    escapePlaceholders(body);

  const target = join(content, `${document.page}.md`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, page);
}

for (const placed of FOLDERS) {
  const under = manifest.files.filter((file) => file.path.startsWith(`${placed.sourceFolder}/`));
  if (under.length === 0) fail(`${placed.sourceFolder}/ has a place on the site and nothing of it is in the snapshot`);
  for (const file of under) {
    const target = join(content, placed.folder, file.path.slice(placed.sourceFolder.length + 1));
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(files, file.path), target);
  }
}

process.stdout.write(
  `generate: ${String(DOCUMENTS.length)} document(s) and ${String(FOLDERS.length)} folder(s) from the snapshot of ${manifest.source.commit.slice(0, 7)}\n`,
);
