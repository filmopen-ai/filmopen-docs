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
 * A specification kept in parts (a document folder) becomes one page per
 * part the same way, with the links between its parts turned into the pages'
 * addresses.
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
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseManifest } from '../src/snapshot/manifest.ts';
import { escapePlaceholders } from '../src/snapshot/placeholders.ts';
import { DOCUMENTS, DOCUMENT_FOLDERS, FOLDERS, GENERATED, pageOf, placementOf, urlOf, type PlacedDocumentFolder } from '../src/snapshot/placement.ts';

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

/** A plain Markdown document: its title, the line under it that says what it is, and the rest. */
function parseDocument(source: string, text: string): { title: string; opening: string | undefined; body: string } {
  const lines = text.split('\n');
  const first = lines.findIndex((line) => line.trim() !== '');
  const title = /^# (.+)$/.exec(lines[first] ?? '')?.[1]?.trim();
  if (title === undefined) fail(`${source} does not begin with its title, as "# Title"`);
  const body = lines.slice(first + 1).join('\n').replace(/^\n+/, '');
  // The line under the title that says in a sentence what the document is.
  const opening = /^\*\*(.+?)\*\*\s*$/m.exec(body.slice(0, 600))?.[1];
  return { title, opening, body };
}

/** The page a document becomes: frontmatter, the provenance note, then the text. */
function render(page: {
  source: string;
  kind: 'specification' | 'guide';
  version: string | undefined;
  title: string;
  opening: string | undefined;
  label: string;
  order: number;
  body: string;
}): string {
  const what = page.kind === 'specification' ? 'specification' : 'guide';
  return (
    '---\n' +
    `title: ${JSON.stringify(page.title)}\n` +
    (page.opening === undefined ? '' : `description: ${JSON.stringify(page.opening)}\n`) +
    'sidebar:\n' +
    `  label: ${JSON.stringify(page.label)}\n` +
    `  order: ${String(page.order)}\n` +
    'editUrl: false\n' +
    'tableOfContents:\n  minHeadingLevel: 2\n  maxHeadingLevel: 3\n' +
    '---\n\n' +
    ':::note[A snapshot]\n' +
    `This ${what} is a copy of \`${page.source}\` in the application's repository, taken at ${taken}` +
    (page.version === undefined ? '' : ` — version ${page.version}`) +
    '. It is imported byte for byte and is not edited here; a change is made there, and arrives with the next snapshot.\n' +
    ':::\n\n' +
    // `<platform>` in running text stays the text it was written as.
    escapePlaceholders(page.body)
  );
}

for (const document of DOCUMENTS) {
  const entry = held.get(document.source);
  if (entry === undefined) fail(`${document.source} has a place on the site and is not in the snapshot`);
  const { title, opening, body } = parseDocument(document.source, readFileSync(join(files, document.source), 'utf8'));
  const target = join(content, `${document.page}.md`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(
    target,
    render({ source: document.source, kind: document.kind, version: entry.version, title, opening, label: document.label, order: document.order, body }),
  );
}

/**
 * A link between two parts is written as a relative path to a file
 * (`[Testing](14-testing.md)`, `[the packages](packages/index.md)`), which is
 * what works in the repository; on the site the target is a page, so the link
 * becomes that page's address. A link to anything else is left alone.
 */
function rewriteLinks(body: string, placed: PlacedDocumentFolder, source: string): string {
  return body.replace(/\]\(([^)\s]+?\.md)(#[^)\s]*)?\)/g, (whole: string, target: string, fragment: string | undefined) => {
    if (/^(?:[a-z]+:|\/|#)/i.test(target)) return whole;
    const resolved = posix.normalize(posix.join(posix.dirname(source), target));
    if (!resolved.startsWith(`${placed.sourceFolder}/`) || !held.has(resolved)) return whole;
    return `](${urlOf(pageOf(placed, resolved).page)}${fragment ?? ''})`;
  });
}

for (const placed of DOCUMENT_FOLDERS) {
  const under = manifest.files.filter((file) => file.path.startsWith(`${placed.sourceFolder}/`));
  if (under.length === 0) fail(`${placed.sourceFolder}/ has a place on the site and nothing of it is in the snapshot`);
  for (const file of under) {
    const relative = file.path.slice(placed.sourceFolder.length + 1);
    if (!/\.md$/i.test(file.path)) {
      const target = join(content, placed.folder, relative);
      mkdirSync(dirname(target), { recursive: true });
      cpSync(join(files, file.path), target);
      continue;
    }
    const { page, order } = pageOf(placed, file.path);
    const { title, opening, body } = parseDocument(file.path, readFileSync(join(files, file.path), 'utf8'));
    // The folder's own page is the one the app opens; in the sidebar it is the group's overview.
    const label = relative === 'index.md' ? 'Overview' : title;
    const target = join(content, `${page}.md`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(
      target,
      render({ source: file.path, kind: placed.kind, version: file.version, title, opening, label, order, body: rewriteLinks(body, placed, file.path) }),
    );
  }
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
  `generate: ${String(DOCUMENTS.length)} document(s), ${String(DOCUMENT_FOLDERS.length)} document folder(s) and ${String(FOLDERS.length)} folder(s) from the snapshot of ${manifest.source.commit.slice(0, 7)}\n`,
);
