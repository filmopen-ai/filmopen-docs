/**
 * Where each imported document appears on the site.
 *
 * `docs/publish.json`, in the application's repository, says **what** is
 * public. This says **where**: a document that is published and not placed
 * fails the build (nothing public goes missing quietly), and a placement for
 * a document that is not in the snapshot fails it too.
 *
 * The URLs are a contract, not a taste. The app opens
 * `‹site›/docs/platforms/‹id›`, `‹site›/docs/guides/account/` and
 * `‹site›/spec`, and the website redirects `/docs/*` to this host **keeping
 * the path** — so every page lives under `/docs/…`, and a file's place under
 * `src/content/docs/` is its URL, letter for letter.
 */

/** A document written as plain Markdown: a `# Title`, then its text. */
export interface PlacedDocument {
  readonly source: string;
  /** Under `src/content/docs/`, without the extension — and so the URL. */
  readonly page: string;
  /** What the sidebar calls it; the page's title is the document's own. */
  readonly label: string;
  readonly order: number;
  /** What the provenance note calls it. */
  readonly kind: 'specification' | 'guide';
}

/**
 * A folder of plain Markdown documents — a specification kept in parts — each
 * placed as a page of its own under one folder of the site, so that a part's
 * address is its file's name: `docs/software/03-architecture.md` appears at
 * `docs/specifications/software/architecture`, the leading number giving the
 * sidebar its order and `index.md` being the folder's own page. A sub-folder
 * keeps its name (`packages/filmopen_jobs.md` → `…/software/packages/filmopen_jobs`),
 * and a file that is not Markdown is copied beside the pages unchanged.
 */
export interface PlacedDocumentFolder {
  readonly sourceFolder: string;
  /** Under `src/content/docs/`: the folder the pages go to. */
  readonly folder: string;
  /** What the provenance note calls each page. */
  readonly kind: 'specification' | 'guide';
}

/** A folder of pages already written for a Starlight site, frontmatter and all. */
export interface PlacedFolder {
  readonly sourceFolder: string;
  /** Under `src/content/docs/`: the folder the pages and their pictures go to, unchanged. */
  readonly folder: string;
}

export const DOCUMENTS: readonly PlacedDocument[] = [
  {
    source: 'docs/FilmOpen-Project-Specification v1.0.md',
    page: 'docs/specifications/project',
    label: 'Project Specification',
    order: 1,
    kind: 'specification',
  },
  {
    source: 'docs/FilmOpen-MCP Specification v1.0.md',
    page: 'docs/specifications/mcp',
    label: 'MCP Specification',
    order: 3,
    kind: 'specification',
  },
  {
    source: 'plugins/README.md',
    page: 'docs/guides/plugins',
    label: 'Writing a plug-in',
    order: 2,
    kind: 'guide',
  },
];

export const DOCUMENT_FOLDERS: readonly PlacedDocumentFolder[] = [
  // The Software Specification is kept in parts, with a generated page per
  // package under `packages/`; its `index.md` keeps the address the app opens.
  { sourceFolder: 'docs/software', folder: 'docs/specifications/software', kind: 'specification' },
];

export const FOLDERS: readonly PlacedFolder[] = [
  // The platform guides say their own slugs — `docs/platforms/fal` — which is
  // also where this puts them, so the two cannot disagree.
  { sourceFolder: 'docs/platforms', folder: 'docs/platforms' },
];

/** Everything the generator writes, for `.gitignore` and for cleaning up. */
export const GENERATED: readonly string[] = [
  ...DOCUMENTS.map((document) => `${document.page}.md`),
  ...DOCUMENT_FOLDERS.map((placed) => `${placed.folder}/`),
  ...FOLDERS.map((placed) => `${placed.folder}/`),
];

/**
 * Where one Markdown file of a document folder appears: the page under
 * `src/content/docs/` (without the extension) and its order in the sidebar —
 * `index.md` first, then a leading `NN-` in the name, then the rest, alphabetically.
 */
export function pageOf(placed: PlacedDocumentFolder, path: string): { page: string; order: number } {
  const parts = path
    .slice(placed.sourceFolder.length + 1)
    .replace(/\.md$/i, '')
    .split('/');
  const name = parts[parts.length - 1] ?? '';
  const numbered = /^(\d+)-(.+)$/.exec(name);
  parts[parts.length - 1] = numbered?.[2] ?? name;
  const order = name === 'index' ? 0 : numbered ? Number(numbered[1]) : 1000;
  return { page: `${placed.folder}/${parts.join('/')}`, order };
}

/** A page's address on the site: `docs/specifications/software/index` is the folder itself. */
export function urlOf(page: string): string {
  return `/${page.replace(/\/index$/, '')}/`;
}

/** Which placement takes a snapshot file, if any. */
export function placementOf(path: string): PlacedDocument | PlacedDocumentFolder | PlacedFolder | null {
  return (
    DOCUMENTS.find((document) => document.source === path) ??
    DOCUMENT_FOLDERS.find((placed) => path.startsWith(`${placed.sourceFolder}/`)) ??
    FOLDERS.find((placed) => path.startsWith(`${placed.sourceFolder}/`)) ??
    null
  );
}
