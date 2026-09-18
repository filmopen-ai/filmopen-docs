/**
 * Holds the snapshot to its manifest, and — given the application's
 * repository — holds the manifest to that repository, byte for byte.
 *
 *   npm run snapshot:verify                         the files here against the manifest
 *   npm run snapshot:verify -- --source ../filmopen  and the manifest against the commit it names
 *
 * The first half needs nothing but this repository and runs with
 * `npm run check`, in the pull-request check too: a snapshot file edited in
 * place, added by hand or missing fails it. The second half is the plan's
 * acceptance — *the snapshot's manifest matches the application's repository
 * byte for byte, checked by a script* — and needs a checkout that holds the
 * commit. It reads that commit's `docs/publish.json` as well, and fails on a
 * file the manifest lists and the application's repository **does not name
 * public**: bytes that match a private document are still a private document.
 *
 * And it asks the checkout's `HEAD` the same question. The commit a manifest
 * names is a claim in a file anyone can edit: pointed at an *older* commit,
 * one that still published a document the application has since taken back,
 * everything above is green and the document is on the site. What `HEAD` no
 * longer names is private **now**, whatever any earlier commit said — so give
 * it the checkout whose `HEAD` is what the application publishes today, and
 * one that is **not behind** the snapshot: a `HEAD` that does not descend from
 * the manifest's commit is refused, since an older `publish.json` cannot say
 * what has been taken back since.
 *
 * **What this cannot do** is see inside a document the application still
 * names. Stale is not private, so a copy whose original has been edited since
 * passes — and if that edit *took something out*, a sentence or an address,
 * the copy here keeps it until the next import. A redaction there is not a
 * redaction here: after one, import again at once.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseManifest, sha256 } from '../src/snapshot/manifest.ts';
import { expand, isNamed, parsePublish, parseTree } from '../src/snapshot/publish.ts';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// `FILMOPEN_SNAPSHOT_DIR` is the tests', as in scripts/import.ts.
const snapshot = process.env.FILMOPEN_SNAPSHOT_DIR ?? join(repository, 'snapshot');
const files = join(snapshot, 'files');

const argv = process.argv.slice(2);
const at = argv.indexOf('--source');
const source = at === -1 ? null : resolve(argv[at + 1] ?? '');
if (argv.length !== (at === -1 ? 0 : 2)) {
  process.stderr.write('verify-snapshot: the only option is --source <checkout>\n');
  process.exit(2);
}

const manifest = parseManifest(readFileSync(join(snapshot, 'manifest.json'), 'utf8'));
const problems: string[] = [];

function walk(folder: string): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    return statSync(path).isDirectory() ? walk(path) : [relative(files, path).split('\\').join('/')];
  });
}

const listed = new Set(manifest.files.map((file) => file.path));
for (const path of walk(files)) {
  if (!listed.has(path)) problems.push(`${path} is in snapshot/files and not in the manifest: nothing is added by hand`);
}
for (const file of manifest.files) {
  let bytes: Buffer;
  try {
    bytes = readFileSync(join(files, file.path));
  } catch {
    problems.push(`${file.path} is in the manifest and not in snapshot/files`);
    continue;
  }
  if (sha256(bytes) !== file.sha256 || bytes.length !== file.bytes) {
    problems.push(`${file.path} is not what the manifest says: a snapshot is never edited in place`);
  }
}

if (source !== null) {
  const from = manifest.source.commit;
  const show = (args: string[]): Buffer | null => {
    try {
      return execFileSync('git', ['-C', source, ...args], { maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch {
      return null;
    }
  };
  /** Whether `commit` is `ancestor` or comes after it. A shallow clone that cannot tell says no. */
  const descends = (commit: string, ancestor: string): boolean => {
    try {
      execFileSync('git', ['-C', source, 'merge-base', '--is-ancestor', ancestor, commit], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  };
  const publish = show(['show', `${from}:docs/publish.json`]);
  const tree = show(['ls-tree', '-r', '-z', from]);
  const { file } = parsePublish(publish?.toString('utf8') ?? '');
  if (file === null || tree === null) {
    problems.push(`docs/publish.json could not be read at ${from.slice(0, 7)} of ${source}, so nothing says these documents are public`);
  } else {
    const named = new Set(expand(file, parseTree(tree.toString('utf8'))).paths);
    for (const listed of manifest.files) {
      if (!named.has(listed.path)) problems.push(`${listed.path} is in the snapshot, and docs/publish.json at ${from.slice(0, 7)} does not name it public`);
    }
    for (const path of named) {
      if (!manifest.files.some((listed) => listed.path === path)) problems.push(`${path} is named public at ${from.slice(0, 7)} and is not in the snapshot: an import is always whole`);
    }
  }

  // The same question of the checkout's HEAD: by name, since a document the
  // application has moved or dropped is a stale snapshot, and one it has
  // stopped naming is a private document.
  const head = show(['rev-parse', '--verify', 'HEAD^{commit}'])?.toString('utf8').trim() ?? '';
  if (head === '') {
    problems.push(`${source} has no HEAD to ask what is public today`);
  } else if (head !== from && !descends(head, from)) {
    problems.push(
      `${head.slice(0, 7)}, the HEAD of ${source}, does not descend from ${from.slice(0, 7)}, the commit the snapshot names: that checkout is behind the snapshot, or on another line of history, and cannot say what has been taken back since — give one that is up to date, or take a new snapshot from it`,
    );
  } else if (head !== from) {
    const today = parsePublish(show(['show', `${head}:docs/publish.json`])?.toString('utf8') ?? '').file;
    if (today === null) {
      problems.push(
        `docs/publish.json could not be read at ${head.slice(0, 7)}, the HEAD of ${source}: nothing there says these documents are still public — give the checkout whose HEAD is what the application publishes`,
      );
    } else {
      for (const listed of manifest.files) {
        if (!isNamed(today, listed.path)) {
          problems.push(`${listed.path} is in the snapshot, and docs/publish.json at ${head.slice(0, 7)}, the source's HEAD, no longer names it public: take a new snapshot`);
        }
      }
    }
  }

  for (const file of manifest.files) {
    let blob: Buffer;
    try {
      blob = execFileSync('git', ['-C', source, 'cat-file', 'blob', `${manifest.source.commit}:${file.path}`], {
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch {
      problems.push(`${file.path} is not in ${manifest.source.commit.slice(0, 7)} of ${source} — or that checkout does not hold the commit`);
      continue;
    }
    if (sha256(blob) !== file.sha256) problems.push(`${file.path} differs from ${manifest.source.commit.slice(0, 7)} of the application's repository`);
  }
}

if (problems.length > 0) {
  process.stderr.write('verify-snapshot: the snapshot does not hold\n');
  for (const problem of problems) process.stderr.write(`  ${problem}\n`);
  process.exit(1);
}
process.stdout.write(
  `verify-snapshot: ${String(manifest.files.length)} file(s) match the manifest` +
    (source === null ? '' : `, and ${manifest.source.commit.slice(0, 7)} of the application's repository, byte for byte`) +
    '\n',
);
