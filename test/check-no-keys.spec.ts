import { execFileSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { beforeEach, describe, expect, it } from 'vitest';

/**
 * `scripts/check-no-keys.sh`, copied into a scratch repository and run there
 * — as a command, and as the pre-commit hook it is installed as. A refusal
 * names a file or says whose address it was, and never prints a value.
 */
const NOREPLY = '1+someone@users.noreply.github.com';
const PERSONAL = 'someone@example.test';

let repo: string;

function sh(command: string, argv: string[], env: Record<string, string> = {}): { status: number; out: string } {
  try {
    const stdout = execFileSync(command, argv, {
      cwd: repo,
      encoding: 'utf8',
      env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, out: stdout };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return { status: failure.status ?? -1, out: `${failure.stdout ?? ''}${failure.stderr ?? ''}` };
  }
}

const as = (author: string, committer = author): Record<string, string> => ({
  GIT_AUTHOR_NAME: 'Someone',
  GIT_AUTHOR_EMAIL: author,
  GIT_COMMITTER_NAME: 'Someone',
  GIT_COMMITTER_EMAIL: committer,
});

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'filmopen-hook-'));
  execFileSync('git', ['init', '-q', repo]);
  mkdirSync(join(repo, 'scripts'));
  copyFileSync('scripts/check-no-keys.sh', join(repo, 'scripts/check-no-keys.sh'));
  chmodSync(join(repo, 'scripts/check-no-keys.sh'), 0o755);
  writeFileSync(join(repo, 'page.md'), '# A page\n');
  sh('git', ['add', 'page.md']);
});

describe('scripts/check-no-keys.sh, the staged check', () => {
  it('passes a clean change made under a GitHub noreply address', () => {
    const answer = sh('scripts/check-no-keys.sh', [], as(NOREPLY));
    expect(answer.status, answer.out).toBe(0);
    expect(answer.out).toContain('no keys in the staged change');
  });

  it('refuses a personal author address, and a personal committer address, without printing either', () => {
    const author = sh('scripts/check-no-keys.sh', [], as(PERSONAL, NOREPLY));
    expect(author.status).toBe(1);
    expect(author.out).toContain("this commit's author address is not a GitHub noreply address");
    expect(author.out).not.toContain(PERSONAL);

    const committer = sh('scripts/check-no-keys.sh', [], as(NOREPLY, PERSONAL));
    expect(committer.status).toBe(1);
    expect(committer.out).toContain("this commit's committer address");
    expect(committer.out).not.toContain(PERSONAL);
  });

  it('is not fooled by an address that merely mentions the noreply domain', () => {
    for (const address of ['someone@users.noreply.github.com.example.test', 'users.noreply.github.com@example.test']) {
      expect(sh('scripts/check-no-keys.sh', [], as(address)).status, address).toBe(1);
    }
  });

  it('lets somebody publish their own address when they say so, for that command', () => {
    expect(sh('scripts/check-no-keys.sh', [], { ...as(PERSONAL), FILMOPEN_ALLOW_AUTHOR_ADDRESS: 'yes' }).status).toBe(0);
    expect(sh('scripts/check-no-keys.sh', [], { ...as(PERSONAL), FILMOPEN_ALLOW_AUTHOR_ADDRESS: '1' }).status).toBe(1);
  });

  it('as the hook, refuses `git commit --author` with a personal address, and the commit is not made', () => {
    const hook = join(repo, '.git/hooks/pre-commit');
    writeFileSync(hook, '#!/usr/bin/env bash\nexec "$(git rev-parse --show-toplevel)/scripts/check-no-keys.sh"\n', { mode: 0o755 });
    chmodSync(hook, 0o755);

    const refused = sh('git', ['commit', '-q', '-m', 'a page', `--author=Someone <${PERSONAL}>`], as(NOREPLY));
    expect(refused.status).not.toBe(0);
    expect(refused.out).not.toContain(PERSONAL);
    expect(sh('git', ['rev-parse', '--verify', '-q', 'HEAD']).status).not.toBe(0); // nothing was committed

    expect(sh('git', ['commit', '-q', '-m', 'a page'], as(NOREPLY)).status).toBe(0);
  });

  it('refuses something shaped like a key by the file\'s name, never its value', () => {
    const value = ['sk', 'live', 'Q'.repeat(28)].join('_'); // put together here: this file is public too
    writeFileSync(join(repo, 'notes.md'), `the key is ${value}\n`);
    sh('git', ['add', 'notes.md']);
    const answer = sh('scripts/check-no-keys.sh', [], as(NOREPLY));
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('notes.md');
    expect(answer.out).not.toContain('Q'.repeat(10));
  });
});

describe('scripts/check-no-keys.sh --push, as the pre-push hook', () => {
  let remote: string;

  /** The short id of HEAD, which is how a refusal names a commit. */
  const head = (): string => sh('git', ['rev-parse', '--short', 'HEAD']).out.trim();
  const remoteHas = (ref: string): boolean =>
    sh('git', ['--git-dir', remote, 'rev-parse', '--verify', '-q', ref]).status === 0;

  beforeEach(() => {
    remote = mkdtempSync(join(tmpdir(), 'filmopen-remote-'));
    execFileSync('git', ['init', '-q', '--bare', remote]);
    sh('git', ['remote', 'add', 'origin', remote]);
    sh('git', ['checkout', '-q', '-b', 'dev']);
    copyFileSync('scripts/install-hooks.sh', join(repo, 'scripts/install-hooks.sh'));
    chmodSync(join(repo, 'scripts/install-hooks.sh'), 0o755);
    expect(sh('scripts/install-hooks.sh', []).out).toContain('pre-push');
    expect(sh('git', ['commit', '-q', '-m', 'a page'], as(NOREPLY)).status).toBe(0);
  });

  it('lets through a push whose every commit carries a noreply address — GitHub\'s own as a committer too', () => {
    writeFileSync(join(repo, 'second.md'), '# Second\n');
    sh('git', ['add', 'second.md']);
    expect(sh('git', ['commit', '-q', '-m', 'as GitHub commits a merge'], as(NOREPLY, 'noreply@github.com')).status).toBe(0);
    const answer = sh('git', ['push', '-q', 'origin', 'dev'], as(NOREPLY));
    expect(answer.status, answer.out).toBe(0);
    expect(remoteHas('refs/heads/dev')).toBe(true);
  });

  it('refuses a push that carries a commit the first hook never saw, names it by id, and nothing leaves', () => {
    expect(sh('git', ['push', '-q', 'origin', 'dev'], as(NOREPLY)).status).toBe(0);
    const pushed = head();

    // `--no-verify` here; a merge, a cherry-pick and a rebase skip that hook without being asked to.
    writeFileSync(join(repo, 'second.md'), '# Second\n');
    sh('git', ['add', 'second.md']);
    expect(sh('git', ['commit', '-q', '--no-verify', '-m', 'unseen'], as(PERSONAL)).status).toBe(0);

    const answer = sh('git', ['push', '-q', 'origin', 'dev'], as(NOREPLY));
    expect(answer.status).not.toBe(0);
    expect(answer.out).toContain(head());
    expect(answer.out).not.toContain(pushed); // what is already there is not this push's to answer for
    expect(answer.out).not.toContain(PERSONAL);
    expect(sh('git', ['--git-dir', remote, 'rev-parse', '--short', 'refs/heads/dev']).out.trim()).toBe(pushed);
  });

  it('refuses a merge commit made under a personal address, which no pre-commit hook is run for', () => {
    expect(sh('git', ['push', '-q', 'origin', 'dev'], as(NOREPLY)).status).toBe(0);
    sh('git', ['checkout', '-q', '-b', 'side']);
    writeFileSync(join(repo, 'side.md'), '# Side\n');
    sh('git', ['add', 'side.md']);
    expect(sh('git', ['commit', '-q', '-m', 'side'], as(NOREPLY)).status).toBe(0);
    sh('git', ['checkout', '-q', 'dev']);
    expect(sh('git', ['merge', '-q', '--no-ff', '-m', 'a merge', 'side'], as(PERSONAL)).status).toBe(0); // made, unasked

    const answer = sh('git', ['push', '-q', 'origin', 'dev'], as(NOREPLY));
    expect(answer.status).not.toBe(0);
    expect(answer.out).toContain(head());
    expect(answer.out).not.toContain(PERSONAL);
  });

  it('reads a branch the remote has never seen, from its first commit', () => {
    writeFileSync(join(repo, 'second.md'), '# Second\n');
    sh('git', ['add', 'second.md']);
    sh('git', ['commit', '-q', '--no-verify', '-m', 'unseen'], as(PERSONAL));
    expect(sh('git', ['push', '-q', 'origin', 'dev'], as(NOREPLY)).status).not.toBe(0);
    expect(remoteHas('refs/heads/dev')).toBe(false);
  });

  it('lets somebody publish their own address when they say so', () => {
    writeFileSync(join(repo, 'second.md'), '# Second\n');
    sh('git', ['add', 'second.md']);
    sh('git', ['commit', '-q', '--no-verify', '-m', 'on purpose'], as(PERSONAL));
    expect(sh('git', ['push', '-q', 'origin', 'dev'], { ...as(NOREPLY), FILMOPEN_ALLOW_AUTHOR_ADDRESS: 'yes' }).status).toBe(0);
  });
});

describe('scripts/check-no-keys.sh --all', () => {
  it('reads files and not identities: it is a sweep, not a commit', () => {
    const answer = sh('scripts/check-no-keys.sh', ['--all'], as(PERSONAL));
    expect(answer.status, answer.out).toBe(0);
    expect(answer.out).toContain('no keys in every file git would take');
  });

  it('reads a file that is new and untracked, and a picture\'s bytes', () => {
    const value = ['sk', 'live', 'R'.repeat(28)].join('_');
    writeFileSync(join(repo, 'new.png'), Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff]), Buffer.from(`tEXtComment\0${value}`)]));
    const answer = sh('scripts/check-no-keys.sh', ['--all'], as(NOREPLY));
    expect(answer.status).toBe(1);
    expect(answer.out).toContain('new.png');
  });
});
