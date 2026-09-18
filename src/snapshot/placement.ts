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
    source: 'docs/FilmOpen-Software-Specification v1.0.md',
    page: 'docs/specifications/software',
    label: 'Software Specification',
    order: 2,
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

export const FOLDERS: readonly PlacedFolder[] = [
  // The platform guides say their own slugs — `docs/platforms/fal` — which is
  // also where this puts them, so the two cannot disagree.
  { sourceFolder: 'docs/platforms', folder: 'docs/platforms' },
];

/** Everything the generator writes, for `.gitignore` and for cleaning up. */
export const GENERATED: readonly string[] = [
  ...DOCUMENTS.map((document) => `${document.page}.md`),
  ...FOLDERS.map((placed) => `${placed.folder}/`),
];

/** Which placement takes a snapshot file, if any. */
export function placementOf(path: string): PlacedDocument | PlacedFolder | null {
  return (
    DOCUMENTS.find((document) => document.source === path) ??
    FOLDERS.find((placed) => path.startsWith(`${placed.sourceFolder}/`)) ??
    null
  );
}
