import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

/**
 * The importer and the verifier, run for real against a scratch repository
 * that stands in for the application's — with the snapshot written to a
 * scratch folder (`FILMOPEN_SNAPSHOT_DIR`), never over the site's own.
 *
 * What matters most is what does **not** come across: a working tree's
 * edits, an untracked file, a document the manifest does not name, a key.
 */
let source: string;
let snapshot: string;

function git(...args: string[]): string {
  return execFileSync('git', ['-C', source, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function put(path: string, content: string | Buffer): void {
  mkdirSync(dirname(join(source, path)), { recursive: true });
  writeFileSync(join(source, path), content);
}

function commit(message: string): string {
  git('add', '-A');
  git('-c', 'user.name=test', '-c', 'user.email=test@example.test', 'commit', '-q', '-m', message);
  return git('rev-parse', 'HEAD').trim();
}

function run(script: string, argv: string[]): { status: number; out: string } {
  try {
    const stdout = execFileSync('node', [`scripts/${script}.ts`, ...argv], {
      encoding: 'utf8',
      env: { ...process.env, FILMOPEN_SNAPSHOT_DIR: snapshot },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, out: stdout };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return { status: failure.status ?? -1, out: `${failure.stdout ?? ''}${failure.stderr ?? ''}` };
  }
}

const PICTURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0x10, 0x80]);
const SPEC = '# A Specification\n\n**What it specifies.**\n\n| | |\n|---|---|\n| **Version** | 3.2 — Draft |\n\nText with a trailing space \nand CRLF\r\nkept.\n';

beforeEach(() => {
  source = mkdtempSync(join(tmpdir(), 'filmopen-app-'));
  snapshot = mkdtempSync(join(tmpdir(), 'filmopen-snapshot-'));
  execFileSync('git', ['init', '-q', source]);
  put('docs/publish.json', JSON.stringify({ version: 1, publish: ['docs/A Specification v1.0.md', 'docs/platforms/**'] }));
  put('docs/A Specification v1.0.md', SPEC);
  put('docs/platforms/fal.md', '---\ntitle: fal\n---\n\n![a](./fal/key-1.png)\n');
  put('docs/platforms/fal/key-1.png', PICTURE);
  put('docs/Private Plan.md', '# A plan\n\nNot for anyone.\n');
  commit('first');
});

describe('npm run import', () => {
  it('copies what publish.json names, byte for byte, and records each file', () => {
    const answer = run('import', ['--source', source]);
    expect(answer.status, answer.out).toBe(0);
    expect(readFileSync(join(snapshot, 'files/docs/A Specification v1.0.md'), 'utf8')).toBe(SPEC);
    expect(readFileSync(join(snapshot, 'files/docs/platforms/fal/key-1.png')).equals(PICTURE)).toBe(true);
    expect(existsSync(join(snapshot, 'files/docs/Private Plan.md'))).toBe(false);
    expect(existsSync(join(snapshot, 'files/docs/publish.json'))).toBe(false);

    const manifest = JSON.parse(readFileSync(join(snapshot, 'manifest.json'), 'utf8')) as {
      source: { commit: string };
      files: { path: string; sha256: string; bytes: number; version?: string }[];
    };
    expect(manifest.source.commit).toBe(git('rev-parse', 'HEAD').trim());
    expect(manifest.files.map((file) => file.path)).toEqual([
      'docs/A Specification v1.0.md',
      'docs/platforms/fal.md',
      'docs/platforms/fal/key-1.png',
    ]);
    expect(manifest.files[0]).toMatchObject({ bytes: Buffer.byteLength(SPEC), version: '3.2 — Draft' });
    expect(manifest.files[0]?.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it('reads the commit and never the working tree', () => {
    // An edit not committed, a new file not tracked, and a manifest widened
    // on disk only: none of them is what the commit says.
    put('docs/A Specification v1.0.md', `${SPEC}\nAn uncommitted thought.\n`);
    put('docs/platforms/draft.md', '---\ntitle: draft\n---\n');
    put('docs/publish.json', JSON.stringify({ version: 1, publish: ['docs/Private Plan.md'] }));

    expect(run('import', ['--source', source]).status).toBe(0);
    expect(readFileSync(join(snapshot, 'files/docs/A Specification v1.0.md'), 'utf8')).toBe(SPEC);
    expect(existsSync(join(snapshot, 'files/docs/platforms/draft.md'))).toBe(false);
    expect(existsSync(join(snapshot, 'files/docs/Private Plan.md'))).toBe(false);
  });

  it('refuses a document publish.json does not name, and copies nothing', () => {
    for (const path of ['docs/Private Plan.md', 'docs/publish.json', 'docs/nothing.md', '../outside.md']) {
      const answer = run('import', ['--source', source, path]);
      expect(answer.status, path).toBe(1);
      expect(answer.out).toContain('is not named in docs/publish.json');
    }
    expect(existsSync(join(snapshot, 'manifest.json'))).toBe(false);
  });

  it('refuses a never-published document even when publish.json names it', () => {
    put('docs/FilmOpen-Dev-Keys.md', '# Where the keys live\n');
    put('docs/publish.json', JSON.stringify({ version: 1, publish: ['docs/FilmOpen-Dev-Keys.md'] }));
    commit('a mistake');
    const answer = run('import', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('is never published, whatever names it');
    expect(existsSync(join(snapshot, 'manifest.json'))).toBe(false);
  });

  it('refuses the whole import when one document carries a credential, and does not say what', () => {
    const value = ['sk', 'live', 'Q'.repeat(28)].join('_');
    put('docs/platforms/fal.md', `---\ntitle: fal\n---\n\nUse ${value} for now.\n`);
    commit('a pasted key');
    const answer = run('import', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('docs/platforms/fal.md carries something shaped like a credential');
    expect(answer.out).not.toContain(value);
    expect(answer.out).not.toContain('Q'.repeat(10));
    expect(existsSync(join(snapshot, 'files'))).toBe(false);
  });

  it('takes a document off the site when publish.json stops naming it', () => {
    expect(run('import', ['--source', source]).status).toBe(0);
    put('docs/publish.json', JSON.stringify({ version: 1, publish: ['docs/A Specification v1.0.md'] }));
    commit('the platforms are private again');
    expect(run('import', ['--source', source]).status).toBe(0);
    expect(existsSync(join(snapshot, 'files/docs/platforms'))).toBe(false);
    expect(existsSync(join(snapshot, 'files/docs/A Specification v1.0.md'))).toBe(true);
  });

  it('is always whole: naming one path does not keep what publish.json stopped naming', () => {
    // The critic's round: a whole import, then publish.json narrowed to one
    // file, then an import *of that file*. The others used to stay on the
    // site, in a manifest that named the new commit, and verify said
    // "byte for byte".
    expect(run('import', ['--source', source]).status).toBe(0);
    put('docs/publish.json', JSON.stringify({ version: 1, publish: ['docs/platforms/fal.md'] }));
    commit('only the fal guide is public now');

    const answer = run('import', ['--source', source, 'docs/platforms/fal.md']);
    expect(answer.status, answer.out).toBe(0);
    expect(existsSync(join(snapshot, 'files/docs/A Specification v1.0.md'))).toBe(false);
    expect(existsSync(join(snapshot, 'files/docs/platforms/fal/key-1.png'))).toBe(false);
    const manifest = JSON.parse(readFileSync(join(snapshot, 'manifest.json'), 'utf8')) as { files: { path: string }[] };
    expect(manifest.files.map((file) => file.path)).toEqual(['docs/platforms/fal.md']);
    expect(run('verify-snapshot', ['--source', source]).status).toBe(0);
  });

  it('refuses a symbolic link under a published folder: what git holds for one is the path it points at', () => {
    execFileSync('ln', ['-s', '../../docs/Private Plan.md', join(source, 'docs/platforms/link.md')]);
    commit('a link');
    const answer = run('import', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('docs/platforms/link.md is a symbolic link');
    expect(existsSync(join(snapshot, 'manifest.json'))).toBe(false);
  });

  it('refuses a key hidden in a picture, which no text search would read', () => {
    const value = ['sk', 'live', 'P'.repeat(28)].join('_');
    put('docs/platforms/fal/key-1.png', Buffer.concat([PICTURE, Buffer.from(`tEXtComment\0${value}`)]));
    commit('a picture with a comment');
    const answer = run('import', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('docs/platforms/fal/key-1.png carries something shaped like a credential');
    expect(answer.out).not.toContain('P'.repeat(10));
  });

  it('refuses a file larger than a page and its pictures ever are, and copies nothing', () => {
    put('docs/platforms/fal/film.png', Buffer.concat([PICTURE, Buffer.alloc(5 * 1024 * 1024)]));
    commit('a picture of five megabytes and twelve bytes');
    const answer = run('import', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('nothing was copied');
    expect(answer.out).toContain('docs/platforms/fal/film.png is 5242892 bytes');
    expect(existsSync(join(snapshot, 'manifest.json'))).toBe(false);
  });

  it('wants --source, and takes no other option', () => {
    expect(run('import', []).status).toBe(1);
    expect(run('import', ['--source', source, '--force']).status).toBe(1);
    expect(run('import', ['--source', join(source, 'nowhere')]).status).toBe(1);
  });
});

describe('npm run snapshot:verify', () => {
  beforeEach(() => {
    expect(run('import', ['--source', source]).status).toBe(0);
  });

  it('passes on a snapshot nobody touched, against itself and against the commit', () => {
    expect(run('verify-snapshot', []).out).toContain('3 file(s) match the manifest');
    expect(run('verify-snapshot', ['--source', source]).out).toContain('byte for byte');
  });

  it('fails on a snapshot edited in place, by one byte', () => {
    writeFileSync(join(snapshot, 'files/docs/A Specification v1.0.md'), SPEC.replace('3.2', '3.3'));
    const answer = run('verify-snapshot', []);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('a snapshot is never edited in place');
  });

  it('fails on a file added by hand, and on one removed', () => {
    writeFileSync(join(snapshot, 'files/docs/extra.md'), '# Extra\n');
    expect(run('verify-snapshot', []).out).toContain('nothing is added by hand');
    rmSync(join(snapshot, 'files/docs/extra.md'));
    rmSync(join(snapshot, 'files/docs/platforms/fal.md'));
    expect(run('verify-snapshot', []).out).toContain('is in the manifest and not in snapshot/files');
  });

  it('fails on a copy the application does not name public, however well its bytes match', async () => {
    // Put in the snapshot by hand, with a manifest line as correct as the
    // importer's own: the hash holds, and the document is still private.
    const secret = readFileSync(join(source, 'docs/Private Plan.md'));
    mkdirSync(join(snapshot, 'files/docs'), { recursive: true });
    writeFileSync(join(snapshot, 'files/docs/Private Plan.md'), secret);
    const manifest = JSON.parse(readFileSync(join(snapshot, 'manifest.json'), 'utf8')) as { files: unknown[] };
    const { createHash } = await import('node:crypto');
    manifest.files.push({ path: 'docs/Private Plan.md', sha256: createHash('sha256').update(secret).digest('hex'), bytes: secret.length });
    writeFileSync(join(snapshot, 'manifest.json'), JSON.stringify(manifest));

    expect(run('verify-snapshot', []).status).toBe(0); // the bytes do match their line
    const answer = run('verify-snapshot', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('docs/Private Plan.md is in the snapshot, and docs/publish.json');
    expect(answer.out).toContain('does not name it public');
  });

  it('fails on a copy the application has since taken back, though the commit the manifest names still published it', () => {
    // The manifest's commit is a claim in a file anyone can edit: an older
    // commit, which named the platform pages public, makes every other check
    // green. The application's HEAD says what is public today.
    put('docs/publish.json', JSON.stringify({ version: 1, publish: ['docs/A Specification v1.0.md'] }));
    const later = commit('the platform pages are no longer public');
    const answer = run('verify-snapshot', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain(`docs/platforms/fal.md is in the snapshot, and docs/publish.json at ${later.slice(0, 7)}, the source's HEAD, no longer names it public`);
    expect(answer.out).toContain('docs/platforms/fal/key-1.png is in the snapshot');
    expect(answer.out).not.toContain('docs/A Specification v1.0.md is in the snapshot');
  });

  it('still passes when the application has moved on and names the same documents', () => {
    put('docs/A Specification v1.0.md', `${SPEC}\nA later edit, not yet imported.\n`);
    put('docs/platforms/openai.md', '---\ntitle: openai\n---\n');
    commit('later work');
    // Stale is not private: the copies still match the commit they name.
    expect(run('verify-snapshot', ['--source', source]).out).toContain('byte for byte');
  });

  it('fails on a checkout that is behind the snapshot, which cannot say what has been taken back since', () => {
    const first = git('rev-parse', 'HEAD').trim();
    put('docs/A Specification v1.0.md', `${SPEC}\nA later edit.\n`);
    commit('later');
    expect(run('import', ['--source', source]).status).toBe(0); // the snapshot is of the later commit
    git('checkout', '-q', '--detach', first);
    const answer = run('verify-snapshot', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain(`${first.slice(0, 7)}, the HEAD of`);
    expect(answer.out).toContain('does not descend from');
  });

  it('fails when the source\'s HEAD publishes nothing at all', () => {
    rmSync(join(source, 'docs/publish.json'));
    const later = commit('no manifest of what is public');
    const answer = run('verify-snapshot', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain(`docs/publish.json could not be read at ${later.slice(0, 7)}, the HEAD of`);
  });

  it('fails against a repository whose commit says something else', () => {
    const manifest = readFileSync(join(snapshot, 'manifest.json'), 'utf8');
    put('docs/A Specification v1.0.md', `${SPEC}\nA later edit.\n`);
    const later = commit('later');
    writeFileSync(join(snapshot, 'manifest.json'), manifest.replace(/"commit":"[0-9a-f]{40}"/, `"commit":"${later}"`));
    const answer = run('verify-snapshot', ['--source', source]);
    expect(answer.status).toBe(1);
    expect(answer.out).toContain("differs from");
  });
});
