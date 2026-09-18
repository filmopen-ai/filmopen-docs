/**
 * The snapshot's manifest: which commit of the application's repository the
 * copies under `snapshot/files/` were taken from, and the SHA-256 of each.
 *
 * It is what makes "byte for byte" checkable by a machine
 * (`scripts/verify-snapshot.ts`): every file here hashes to what the manifest
 * says, and — given the application's repository — so does the blob at that
 * commit. A snapshot is refreshed by a person running the importer, or at a
 * milestone's close; nothing pulls it on its own.
 */

import { createHash } from 'node:crypto';

export interface SnapshotFile {
  /** The path in the application's repository, and under `snapshot/files/`. */
  readonly path: string;
  readonly sha256: string;
  readonly bytes: number;
  /** The document's own version line, where it carries one. */
  readonly version?: string;
}

export interface SnapshotManifest {
  readonly about: string;
  readonly source: {
    /** The commit every file was read from — never a working tree. */
    readonly commit: string;
    /** When that commit was made, as git has it. */
    readonly committedAt: string;
  };
  /** The day the importer ran. */
  readonly importedOn: string;
  readonly files: readonly SnapshotFile[];
}

export const MANIFEST_ABOUT =
  "Copies of the application's public documents, byte for byte from one commit of its repository. Written by scripts/import.ts and never by hand; checked by scripts/verify-snapshot.ts. To change a document, change it there and import again.";

export function sha256(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/**
 * A specification says its own version in the table under its title:
 * `| **Version** | 1.11 — Draft |`. Pages written for the site say when they
 * were last updated in their frontmatter instead, and are not versioned.
 */
export function versionOf(text: string): string | undefined {
  const row = /^\|\s*\*\*Version\*\*\s*\|\s*([^|\n]+?)\s*\|\s*$/m.exec(text.slice(0, 4000));
  return row?.[1];
}

export function parseManifest(text: string): SnapshotManifest {
  const parsed = JSON.parse(text) as SnapshotManifest;
  if (!/^[0-9a-f]{40}$/.test(parsed.source.commit)) throw new Error('snapshot/manifest.json names no commit');
  if (!Array.isArray(parsed.files)) throw new Error('snapshot/manifest.json lists no files');
  return parsed;
}

/** The manifest as it is written: stable, sorted, one file a line. */
export function writeManifest(manifest: SnapshotManifest): string {
  const files = [...manifest.files].sort((a, b) => (a.path < b.path ? -1 : 1));
  const lines = files.map((file) => `    ${JSON.stringify(file)}`).join(',\n');
  return (
    '{\n' +
    `  "about": ${JSON.stringify(manifest.about)},\n` +
    `  "source": ${JSON.stringify(manifest.source)},\n` +
    `  "importedOn": ${JSON.stringify(manifest.importedOn)},\n` +
    `  "files": [\n${lines}\n  ]\n` +
    '}\n'
  );
}
