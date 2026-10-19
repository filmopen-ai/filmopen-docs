import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { parseManifest, sha256, versionOf, writeManifest } from '../src/snapshot/manifest.ts';
import { DOCUMENTS, DOCUMENT_FOLDERS, FOLDERS, GENERATED, pageOf, placementOf, urlOf } from '../src/snapshot/placement.ts';

describe('the manifest', () => {
  it('hashes bytes, not text', () => {
    expect(sha256(Buffer.from(''))).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256(Buffer.from('a\r\n'))).not.toBe(sha256(Buffer.from('a\n')));
  });

  it("reads a specification's own version, and only from its head", () => {
    expect(versionOf('# T\n\n| | |\n|---|---|\n| **Version** | 1.11 — Draft |\n| **Date** | x |\n')).toBe('1.11 — Draft');
    expect(versionOf('---\ntitle: fal\n---\n\nNo version here.\n')).toBeUndefined();
    expect(versionOf(`${'x'.repeat(5000)}\n| **Version** | 9 |\n`)).toBeUndefined();
  });

  it('is written the same way whatever order the files came in', () => {
    const files = [
      { path: 'docs/b.md', sha256: 'b'.repeat(64), bytes: 2 },
      { path: 'docs/a.md', sha256: 'a'.repeat(64), bytes: 1, version: '1.0' },
    ];
    const source = { commit: 'c'.repeat(40), committedAt: '2026-09-18T10:00:00+02:00' };
    const one = writeManifest({ about: 'x', source, importedOn: '2026-09-18', files });
    const two = writeManifest({ about: 'x', source, importedOn: '2026-09-18', files: [...files].reverse() });
    expect(one).toBe(two);
    expect(parseManifest(one).files.map((file) => file.path)).toEqual(['docs/a.md', 'docs/b.md']);
  });

  it('is refused without a commit', () => {
    expect(() => parseManifest('{"source":{"commit":"HEAD"},"files":[]}')).toThrow();
  });
});

describe("the site's own snapshot", () => {
  const manifest = parseManifest(readFileSync('snapshot/manifest.json', 'utf8'));

  it('gives every published file a place on the site, and every place a file', () => {
    expect(manifest.files.filter((file) => placementOf(file.path) === null)).toEqual([]);
    const held = new Set(manifest.files.map((file) => file.path));
    for (const document of DOCUMENTS) expect(held.has(document.source), document.source).toBe(true);
    for (const folder of [...DOCUMENT_FOLDERS, ...FOLDERS]) {
      expect(manifest.files.some((file) => file.path.startsWith(`${folder.sourceFolder}/`)), folder.sourceFolder).toBe(true);
    }
  });

  it('holds nothing the plan calls private', () => {
    for (const file of manifest.files) expect(file.path).not.toMatch(/Dev-Keys|Managed-Usage|Plan|Results|Next steps|Request/i);
  });
});

describe('where a document appears', () => {
  it('is under /docs/, since the website sends ‹site›/docs/… here with the path kept', () => {
    for (const document of DOCUMENTS) expect(document.page).toMatch(/^docs\/(specifications|guides)\/[a-z-]+$/);
    for (const folder of FOLDERS) expect(folder.folder).toMatch(/^docs\/[a-z-]+$/);
    for (const placed of DOCUMENT_FOLDERS) expect(placed.folder).toMatch(/^docs\/(specifications|guides)\/[a-z-]+$/);
    expect(new Set(DOCUMENTS.map((document) => document.page)).size).toBe(DOCUMENTS.length);
  });

  it("is, for a part of a specification kept in parts, its file's name: the number orders it, index.md is the folder's own page", () => {
    const placed = { sourceFolder: 'docs/software', folder: 'docs/specifications/software', kind: 'specification' as const };
    expect(pageOf(placed, 'docs/software/index.md')).toEqual({ page: 'docs/specifications/software/index', order: 0 });
    expect(pageOf(placed, 'docs/software/03-architecture.md')).toEqual({ page: 'docs/specifications/software/architecture', order: 3 });
    expect(pageOf(placed, 'docs/software/packages/filmopen_jobs.md')).toEqual({ page: 'docs/specifications/software/packages/filmopen_jobs', order: 1000 });
    expect(pageOf(placed, 'docs/software/packages/index.md')).toEqual({ page: 'docs/specifications/software/packages/index', order: 0 });
    expect(urlOf('docs/specifications/software/index')).toBe('/docs/specifications/software/');
    expect(urlOf('docs/specifications/software/architecture')).toBe('/docs/specifications/software/architecture/');
    // The address the app opens, letter for letter, is still a page.
    expect(urlOf(pageOf(placed, 'docs/software/index.md').page)).toBe('/docs/specifications/software/');
  });

  it('is never committed: .gitignore names everything the generator writes', () => {
    const ignored = readFileSync('.gitignore', 'utf8').split('\n');
    for (const path of GENERATED) expect(ignored, path).toContain(`src/content/docs/${path}`);
  });
});
