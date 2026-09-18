import { describe, expect, it } from 'vitest';

import { carriesCredential, entryProblem, expand, isNamed, parsePublish, parseTree, type TreeEntry } from '../src/snapshot/publish.ts';

/**
 * `docs/publish.json` is the one door between a private repository and a
 * public site, so what it may name — and what nothing may name — is tested
 * entry by entry.
 */
describe('an entry of publish.json', () => {
  it('is a tracked file, or a folder followed by /**', () => {
    for (const entry of ['docs/A Specification v1.0.md', 'plugins/README.md', 'docs/platforms/**']) {
      expect(entryProblem(entry), entry).toBeNull();
    }
  });

  it('cannot climb out of the repository, be absolute, or use a pattern', () => {
    for (const entry of ['../secrets.md', 'docs/../../x.md', '/etc/passwd', 'docs\\x.md', 'docs/*.md', 'docs/**/*.md', '**', '/**', '', 'docs//x.md', './x.md']) {
      expect(entryProblem(entry), entry).not.toBeNull();
    }
    expect(entryProblem(7)).toBe('is not a path');
  });

  it('is never one of the documents that say where keys live, whatever names it', () => {
    for (const entry of [
      'docs/FilmOpen-Dev-Keys.md',
      'docs/FilmOpen-Managed-Usage-Notes.md',
      '.env',
      'config/.env.production',
      'android/key.jks',
      'certs/site.pem',
      'dart-defines.json',
      'docs/secrets/**',
      '.git/config',
    ]) {
      expect(entryProblem(entry), entry).toBe('is never published, whatever names it');
    }
  });
});

describe('publish.json', () => {
  const good = JSON.stringify({ about: 'x', version: 1, publish: ['docs/a.md', 'docs/platforms/**'] });

  it('reads a list of entries', () => {
    const { file, problems } = parsePublish(good);
    expect(problems).toEqual([]);
    expect(file?.publish).toEqual(['docs/a.md', 'docs/platforms/**']);
  });

  it('is refused whole when any part of it is wrong', () => {
    for (const text of [
      'not json',
      '{}',
      JSON.stringify({ version: 2, publish: ['docs/a.md'] }),
      JSON.stringify({ version: 1, publish: [] }),
      JSON.stringify({ version: 1, publish: 'docs/a.md' }),
      JSON.stringify({ version: 1, publish: ['docs/a.md', 'docs/a.md'] }),
      JSON.stringify({ version: 1, publish: ['docs/a.md', '../b.md'] }),
    ]) {
      const { file, problems } = parsePublish(text);
      expect(file, text).toBeNull();
      expect(problems.length, text).toBeGreaterThan(0);
    }
  });

  it('names a path exactly, or through its folder — and nothing beside it', () => {
    const { file } = parsePublish(good);
    if (file === null) throw new Error('unreadable');
    expect(isNamed(file, 'docs/a.md')).toBe(true);
    expect(isNamed(file, 'docs/platforms/fal.md')).toBe(true);
    expect(isNamed(file, 'docs/platforms/fal/key-1.png')).toBe(true);
    expect(isNamed(file, 'docs/b.md')).toBe(false);
    expect(isNamed(file, 'docs/a.md.bak')).toBe(false);
    // A folder named `docs/platforms-private` is not under `docs/platforms/`.
    expect(isNamed(file, 'docs/platforms-private/x.md')).toBe(false);
  });
});

describe('what a commit holds', () => {
  const { file } = parsePublish(JSON.stringify({ version: 1, publish: ['docs/a.md', 'docs/platforms/**'] }));
  if (file === null) throw new Error('unreadable');
  /** Ordinary files, unless a mode is said. */
  const tree = (...paths: (string | TreeEntry)[]): TreeEntry[] =>
    paths.map((entry) => (typeof entry === 'string' ? { mode: '100644', path: entry } : entry));

  it('is what is copied: every tracked file an entry names, and no other', () => {
    const tracked = tree('docs/a.md', 'docs/b.md', 'docs/platforms/fal.md', 'docs/platforms/fal/key-1.png', 'README.md');
    expect(expand(file, tracked)).toEqual({
      paths: ['docs/a.md', 'docs/platforms/fal.md', 'docs/platforms/fal/key-1.png'],
      problems: [],
    });
  });

  it('says so when an entry names nothing the commit holds', () => {
    const { problems } = expand(file, tree('README.md'));
    expect(problems.map((problem) => problem.where)).toEqual(['docs/a.md', 'docs/platforms/**']);
  });

  it('refuses, under a published folder, a file that is not Markdown or a picture — or is never published', () => {
    const { problems } = expand(file, tree('docs/a.md', 'docs/platforms/run.sh', 'docs/platforms/page.svg', 'docs/platforms/.env', 'docs/platforms/notes.md'));
    expect(problems.map((problem) => problem.where).sort()).toEqual(['docs/platforms/.env', 'docs/platforms/page.svg', 'docs/platforms/run.sh']);
  });

  it('refuses a symbolic link and a submodule: to git a link is a blob holding the path it points at', () => {
    const { problems } = expand(
      file,
      tree('docs/a.md', { mode: '120000', path: 'docs/platforms/link.md' }, { mode: '160000', path: 'docs/platforms/sub.md' }, { mode: '100755', path: 'docs/platforms/fal.md' }),
    );
    expect(problems).toEqual([
      { where: 'docs/platforms/link.md', says: 'is a symbolic link, and what would be copied is the path it points at' },
      { where: 'docs/platforms/sub.md', says: 'is not a file of the repository (a submodule, or something stranger)' },
    ]);
  });

  it("reads git's own listing, a name with a space or a tab in it included", () => {
    const listing = ['100644 blob aaaa\tdocs/A Specification v1.0.md', '120000 blob bbbb\tdocs/platforms/link.md', '100644 blob cccc\tdocs/odd\tname.md', ''].join('\0');
    expect(parseTree(listing)).toEqual([
      { mode: '100644', path: 'docs/A Specification v1.0.md' },
      { mode: '120000', path: 'docs/platforms/link.md' },
      { mode: '100644', path: 'docs/odd\tname.md' },
    ]);
  });
});

describe('a document that carries a credential', () => {
  it('is recognised by shape — put together here, since this repository would refuse a file that spelled one out', () => {
    const stripe = ['sk', 'live', 'A'.repeat(24)].join('_');
    const resend = `re_${'b'.repeat(24)}`;
    const github = `ghp_${'c'.repeat(36)}`;
    for (const value of [stripe, resend, github]) {
      expect(carriesCredential(`the key is "${value}" for now`), value.slice(0, 6)).toBe(true);
    }
    expect(carriesCredential(`-----${['BEGIN', 'PRIVATE', 'KEY'].join(' ')}-----`)).toBe(true);
  });

  it('is recognised in a picture too: in a text chunk, or after the picture ends', () => {
    const value = ['sk', 'live', 'Z'.repeat(26)].join('_');
    const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0xfe, 0x80]), Buffer.from(`tEXtComment\0${value}`), Buffer.from([0x00, 0x49, 0x45, 0x4e, 0x44])]);
    expect(carriesCredential(png)).toBe(true);
    expect(carriesCredential(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff, 0x10, 0x80, 0x7f, 0x01]))).toBe(false);
  });

  it('is not a document that only talks about keys', () => {
    for (const text of [
      'Create an API key and add it under Settings → Provider keys.',
      'Keys start with sk- and are shown once.',
      'the pre-commit check (scripts/check-no-keys.sh) refuses a value',
      'Ai_Cf_Aisingapore_Gemma_Sea_Lion_V4_27b_It_Input is a generated type',
    ]) {
      expect(carriesCredential(text), text).toBe(false);
    }
  });
});
