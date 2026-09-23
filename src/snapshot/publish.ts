/**
 * What the application's repository says is public, and what the importer
 * will and will not take (`docs/publish.json` there; `scripts/import.ts`
 * here).
 *
 * The application's repository is private and this one is public, so this is
 * the one door between them, and it is an **allowlist**: a document reaches
 * the site only if `publish.json` names it, at a commit, and the importer
 * refuses anything else — a path given on its command line included. The
 * manifest names *what* is public; *where* a page appears is `placement.ts`'s.
 *
 * Pure functions, so that every refusal is a test.
 */

export interface Problem {
  readonly where: string;
  readonly says: string;
}

/** `docs/publish.json`, as the application's repository writes it. */
export interface PublishFile {
  readonly version: 1;
  readonly publish: readonly string[];
}

/** The kinds of file a documentation site is made of, and nothing else. */
const PUBLISHABLE = /\.(md|png|jpe?g|gif|webp)$/i;

/**
 * Never, whatever `publish.json` says. The allowlist is the rule; this is the
 * second line for the day somebody lists the wrong thing in it: the documents
 * that say where keys live and what managed usage allows, and anything shaped
 * like a credential's file.
 */
const NEVER: readonly RegExp[] = [
  /(^|\/)\.git(\/|$)/,
  /(^|\/)\.env(\.|$)/i,
  /\.(pem|key|p12|pfx|jks|keystore)$/i,
  /dart-defines/i,
  /Dev-Keys/i,
  /Managed-Usage/i,
  /(^|\/)(secrets?|credentials?)(\/|\.|$)/i,
];

/** A page and its pictures are kilobytes; five megabytes is somebody's video. */
export const MAX_BYTES = 5 * 1024 * 1024;

/** One entry of `publish`: a file, or a folder followed by `/**`. */
export function entryProblem(entry: unknown): string | null {
  if (typeof entry !== 'string' || entry === '') return 'is not a path';
  if (entry.startsWith('/') || entry.includes('\\')) return 'is not a path relative to the repository';
  const path = entry.endsWith('/**') ? entry.slice(0, -3) : entry;
  if (path === '' || path.split('/').some((part) => part === '' || part === '.' || part === '..')) {
    return 'climbs out of the repository, or names nothing';
  }
  if (/[*?[\]{}]/.test(path)) return 'uses a pattern; only a folder followed by /** is understood';
  if (NEVER.some((never) => never.test(path))) return 'is never published, whatever names it';
  return null;
}

export function parsePublish(text: string): { file: PublishFile | null; problems: Problem[] } {
  const where = 'docs/publish.json';
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { file: null, problems: [{ where, says: 'is not JSON' }] };
  }
  const object = typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {};
  const problems: Problem[] = [];
  if (object.version !== 1) problems.push({ where: `${where}: version`, says: 'is not 1, the only format this importer reads' });
  const publish = Array.isArray(object.publish) ? (object.publish as unknown[]) : null;
  if (publish === null || publish.length === 0) {
    problems.push({ where: `${where}: publish`, says: 'is not a list of paths' });
    return { file: null, problems };
  }
  publish.forEach((entry, index) => {
    const says = entryProblem(entry);
    if (says !== null) problems.push({ where: `${where}: publish[${String(index)}]`, says });
  });
  if (new Set(publish).size !== publish.length) problems.push({ where: `${where}: publish`, says: 'names something twice' });
  if (problems.length > 0) return { file: null, problems };
  return { file: { version: 1, publish: publish as string[] }, problems };
}

/** Whether `publish.json` names this path, exactly or through a folder. */
export function isNamed(file: PublishFile, path: string): boolean {
  return file.publish.some((entry) =>
    entry.endsWith('/**') ? path.startsWith(`${entry.slice(0, -3)}/`) : entry === path,
  );
}

/** One entry of a commit's tree, as `git ls-tree -r` lists it. */
export interface TreeEntry {
  /** `100644` and `100755` are files; `120000` is a symbolic link; `160000` another repository. */
  readonly mode: string;
  readonly path: string;
}

/** `git ls-tree -r -z <commit>`: `<mode> <type> <object>\t<path>`, NUL between entries. */
export function parseTree(listing: string): TreeEntry[] {
  return listing
    .split('\0')
    .filter((line) => line !== '')
    .map((line) => {
      const tab = line.indexOf('\t');
      return { mode: line.slice(0, line.indexOf(' ')), path: line.slice(tab + 1) };
    });
}

/**
 * The files to copy: every entry expanded against **what the commit holds**
 * (`git ls-tree`), so that an untracked or ignored file in somebody's working
 * tree is never published, however the folder is named.
 *
 * Only a **file** is copied. A symbolic link is a blob to git, holding the
 * path it points at — so a link under a published folder would reach the
 * site as a page whose text is a path in a private repository — and a
 * submodule is no blob at all.
 */
export function expand(
  file: PublishFile,
  tree: readonly TreeEntry[],
): { paths: string[]; problems: Problem[] } {
  const problems: Problem[] = [];
  const paths = new Set<string>();
  const tracked = tree.map((entry) => entry.path);
  const held = new Set(tracked);
  const modes = new Map(tree.map((entry) => [entry.path, entry.mode]));
  for (const entry of file.publish) {
    if (entry.endsWith('/**')) {
      const prefix = `${entry.slice(0, -3)}/`;
      const under = tracked.filter((path) => path.startsWith(prefix));
      if (under.length === 0) problems.push({ where: entry, says: 'names a folder the commit holds nothing under' });
      for (const path of under) paths.add(path);
    } else if (held.has(entry)) {
      paths.add(entry);
    } else {
      problems.push({ where: entry, says: 'names a file the commit does not hold' });
    }
  }
  for (const path of paths) {
    const mode = modes.get(path) ?? '';
    if (NEVER.some((never) => never.test(path))) problems.push({ where: path, says: 'is never published, whatever names it' });
    else if (mode === '120000') problems.push({ where: path, says: 'is a symbolic link, and what would be copied is the path it points at' });
    else if (!/^100(644|755)$/.test(mode)) problems.push({ where: path, says: 'is not a file of the repository (a submodule, or something stranger)' });
    else if (!PUBLISHABLE.test(path)) problems.push({ where: path, says: 'is not a kind of file the site publishes (Markdown and pictures)' });
  }
  return { paths: [...paths].sort(), problems };
}

/**
 * Shapes of a real credential, as the application's and the website's own
 * pre-commit checks know them. A snapshot that carries one is refused whole:
 * this repository is public, and a push is forever.
 */
const CREDENTIAL =
  /(^|[^A-Za-z0-9_-])((sk|rk)_(test|live)_[A-Za-z0-9]{20,}|whsec_[A-Za-z0-9]{20,}|re_[A-Za-z0-9_-]{20,}|sb_(publishable|secret)_[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|GOCSPX-[A-Za-z0-9_-]{20,}|ya29\.[A-Za-z0-9_-]{30,}|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{60,}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-[A-Za-z0-9-]{10,}|sk-(proj-|ant-|or-)?[A-Za-z0-9_-]{32,}|xai-[A-Za-z0-9_-]{40,})|BEGIN (RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY/;

/**
 * Whether a file carries something shaped like a credential. Never says what.
 *
 * **Every file, a picture too**: read as one byte a character, so that a key
 * written out in a picture's bytes — an uncompressed text chunk, EXIF,
 * something appended after the picture's end — is found as one pasted into
 * a page is. **What it cannot find** is a key that is not there as a run of
 * its own characters: inside a *compressed* text chunk (`zTXt`, a compressed
 * `iTXt`), split across two chunks, or drawn in the picture's pixels. Those
 * are a person's to catch, which is why every picture is opened and looked at
 * before a snapshot that adds one is pushed. A picture's compressed bytes
 * hold no run long enough to be mistaken for a key: all of the first
 * snapshot's pictures pass.
 */
export function carriesCredential(content: string | Uint8Array): boolean {
  return CREDENTIAL.test(typeof content === 'string' ? content : Buffer.from(content).toString('latin1'));
}
