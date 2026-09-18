/**
 * Takes a snapshot of the application's public documents.
 *
 *   npm run import -- --source ../filmopen            everything docs/publish.json names
 *   npm run import -- --source ../filmopen <path> …   the same, **if** each of these is named there
 *
 * It reads **a commit, never a working tree**: `docs/publish.json` and every
 * document come out of `HEAD` of the source checkout through git, so that an
 * uncommitted edit, an untracked file or an ignored one cannot reach a public
 * site, and the manifest can say exactly what was copied. Each file lands
 * under `snapshot/files/` at its own path, byte for byte, with its SHA-256 in
 * `snapshot/manifest.json`.
 *
 * **A snapshot is of one commit, so an import is always whole.** A path given
 * on the command line is a question — *is this public?* — and not a request
 * to copy it alone: copying some files from a new commit beside others kept
 * from an old one would leave a manifest that names one commit and holds two,
 * and would keep on the site a document `publish.json` had stopped naming.
 *
 * It **refuses**, and copies nothing: a path `publish.json` does not name; a
 * manifest it cannot read; a symbolic link or a submodule under a published
 * folder; a file that is not Markdown or a picture, or is one of the
 * never-published ones, or is larger than a page has any business being; and
 * a file — a picture too — that carries something shaped like a credential,
 * named by its path and never by the value.
 *
 * A snapshot is refreshed by a person, or at a milestone's close; nothing
 * runs this on its own.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { MANIFEST_ABOUT, sha256, versionOf, writeManifest, type SnapshotFile } from '../src/snapshot/manifest.ts';
import { MAX_BYTES, carriesCredential, expand, isNamed, parsePublish, parseTree, type Problem } from '../src/snapshot/publish.ts';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// `FILMOPEN_SNAPSHOT_DIR` is the tests': they run this for real, against
// scratch repositories, and must never write over the site's own snapshot.
const snapshot = process.env.FILMOPEN_SNAPSHOT_DIR ?? join(repository, 'snapshot');
const files = join(snapshot, 'files');

function fail(says: string, problems: readonly Problem[] = []): never {
  process.stderr.write(`import: ${says}\n`);
  for (const problem of problems) process.stderr.write(`  ${problem.where} ${problem.says}\n`);
  process.exit(1);
}

const argv = process.argv.slice(2);
const at = argv.indexOf('--source');
if (at === -1 || argv[at + 1] === undefined) fail("say where the application's repository is: --source ../filmopen");
const source = resolve(argv[at + 1] ?? '');
const only = argv.filter((_, index) => index !== at && index !== at + 1);
if (only.some((path) => path.startsWith('-'))) fail('the only option is --source; everything else is a path to import');

/** One git command in the source checkout; bytes out. */
function git(args: string[]): Buffer {
  try {
    return execFileSync('git', ['-C', source, ...args], { maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    fail(`git ${args[0] ?? ''} failed in ${source} — is it a checkout of the application's repository?`);
  }
}

const commit = git(['rev-parse', '--verify', 'HEAD^{commit}']).toString('utf8').trim();
const committedAt = git(['show', '-s', '--format=%cI', commit]).toString('utf8').trim();

const { file: publish, problems: unreadable } = parsePublish(git(['show', `${commit}:docs/publish.json`]).toString('utf8'));
if (publish === null) fail('docs/publish.json, as committed, is not usable', unreadable);

const { paths: named, problems } = expand(publish, parseTree(git(['ls-tree', '-r', '-z', commit]).toString('utf8')));
if (problems.length > 0) fail('docs/publish.json names what cannot be published', problems);

// A path on the command line is a question, and the manifest is the answer.
const refused = only.filter((path) => !isNamed(publish, path) || !named.includes(path));
if (refused.length > 0) {
  fail(
    'docs/publish.json does not name that, so it is not imported',
    refused.map((path) => ({ where: path, says: 'is not named in docs/publish.json at the source commit' })),
  );
}

const copied: { path: string; bytes: Buffer }[] = [];
const unfit: Problem[] = [];
for (const path of named) {
  const bytes = git(['cat-file', 'blob', `${commit}:${path}`]);
  if (bytes.length > MAX_BYTES) unfit.push({ where: path, says: `is ${String(bytes.length)} bytes; a page and its pictures are far smaller` });
  else if (carriesCredential(bytes)) {
    unfit.push({ where: path, says: 'carries something shaped like a credential. It is not said here what; this repository is public' });
  }
  copied.push({ path, bytes });
}
if (unfit.length > 0) fail('nothing was copied', unfit);

// The snapshot is replaced, whole: a document taken off publish.json leaves
// the site with the next import, and the manifest's one commit is true of
// every file it lists.
rmSync(files, { recursive: true, force: true });

const entries: SnapshotFile[] = copied.map(({ path, bytes }) => {
  const target = join(files, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, bytes);
  const version = /\.md$/i.test(path) ? versionOf(bytes.toString('utf8')) : undefined;
  return { path, sha256: sha256(bytes), bytes: bytes.length, ...(version === undefined ? {} : { version }) };
});

writeFileSync(
  join(snapshot, 'manifest.json'),
  writeManifest({
    about: MANIFEST_ABOUT,
    source: { commit, committedAt },
    importedOn: new Date().toISOString().slice(0, 10),
    files: entries,
  }),
);

/** How many files a folder holds, for the last line. */
function count(folder: string): number {
  return readdirSync(folder).reduce((sum, name) => {
    const path = join(folder, name);
    return sum + (statSync(path).isDirectory() ? count(path) : 1);
  }, 0);
}
process.stdout.write(
  `import: ${String(entries.length)} file(s) from ${commit.slice(0, 7)} (${committedAt.slice(0, 10)}); snapshot/files holds ${String(count(files))}\n`,
);
