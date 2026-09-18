import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

/**
 * `scripts/deploy.sh` is the one file here that reads a live credential. It
 * is run against a **fake** token in a scratch keys folder and a fake
 * wrangler that reports its arguments and its environment to a file, so that
 * a leak is a failed assertion here and not a token in a transcript. The
 * website's wrapper took five rounds of a critic to get right; what it
 * learned is that a wrapper which passes arguments through can be talked
 * into anything, so this one is tested for passing **none**.
 */
const FAKE_TOKEN = 'fake-token-0123456789abcdefghijklmnopqrstuv';
let keys: string;
let bin: string;
let report: string;

/**
 * Everything the wrapper takes out of wrangler's environment: where the token
 * is sent, what is trusted on the way, and which credential is sent at all.
 * **The list is written here a second time on purpose** — a name dropped from
 * the script fails the test that compares the two, and a name that stays in
 * the script and stops being unset fails the one that sets them all.
 */
const UNSET = [
  'CLOUDFLARE_API_BASE_URL', 'CF_API_BASE_URL', 'CLOUDFLARE_API_URL',
  'CLOUDFLARE_EMAIL', 'CLOUDFLARE_API_KEY', 'CLOUDFLARE_API_USER_SERVICE_KEY', 'CF_EMAIL', 'CF_API_KEY',
  'SSL_CERT_FILE', 'SSL_CERT_DIR', 'NODE_EXTRA_CA_CERTS', 'NODE_OPTIONS', 'NODE_TLS_REJECT_UNAUTHORIZED',
  'http_proxy', 'https_proxy', 'HTTP_PROXY', 'HTTPS_PROXY', 'all_proxy', 'ALL_PROXY', 'NO_PROXY', 'no_proxy',
] as const;

function deploy(argv: string[], extra: Record<string, string> = {}, folder = keys): { status: number; out: string } {
  const env: NodeJS.ProcessEnv = { ...process.env, FILMOPEN_KEYS: folder, FILMOPEN_WRANGLER: join(bin, 'wrangler'), DEPLOY_REPORT: report, ...extra };
  try {
    const stdout = execFileSync('scripts/deploy.sh', argv, { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 0, out: stdout };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return { status: failure.status ?? -1, out: `${failure.stdout ?? ''}${failure.stderr ?? ''}` };
  }
}

const reported = (): string => readFileSync(report, 'utf8');

function keysFolder(mode: number, content = `CLOUDFLARE_API_TOKEN=${FAKE_TOKEN}\nCLOUDFLARE_ACCOUNT_ID=0123456789abcdef0123456789abcdef\n`): string {
  const folder = mkdtempSync(join(tmpdir(), 'filmopen-keys-'));
  writeFileSync(join(folder, 'cloudflare.env'), content, { mode });
  chmodSync(join(folder, 'cloudflare.env'), mode);
  return folder;
}

beforeAll(() => {
  keys = keysFolder(0o600);
  bin = mkdtempSync(join(tmpdir(), 'filmopen-bin-'));
  report = join(bin, 'report.txt');
  writeFileSync(
    join(bin, 'wrangler'),
    [
      '#!/usr/bin/env bash',
      '{',
      '  echo "argv: $*"',
      '  if [ "${CLOUDFLARE_API_TOKEN:-}" = "' + FAKE_TOKEN + '" ]; then echo "token: in the environment, as wrangler needs"; else echo "token: MISSING"; fi',
      `  for redirecting in ${UNSET.join(' ')}; do`,
      '    if [ -n "${!redirecting:-}" ]; then echo "$redirecting SURVIVED"; fi',
      '  done',
      '} >> "$DEPLOY_REPORT"',
      '',
    ].join('\n'),
    { mode: 0o755 },
  );
});

beforeEach(() => {
  writeFileSync(report, '');
});

describe('scripts/deploy.sh', () => {
  it('runs exactly `wrangler deploy --env <name>`, with the token in that command and no other', () => {
    const answer = deploy(['dev']);
    expect(answer.status, answer.out).toBe(0);
    expect(reported()).toContain('argv: deploy --env dev\n');
    expect(reported()).toContain('token: in the environment');
    expect(answer.out).not.toContain(FAKE_TOKEN);
  });

  it('builds the site it is about to deploy: production pages name docs.filmopen.ai as their own address', () => {
    const canonical = (): string => /<link rel="canonical" href="([^"]+)"/.exec(readFileSync('dist/docs/index.html', 'utf8'))?.[1] ?? '';
    expect(deploy(['production']).status).toBe(0);
    expect(reported()).toContain('argv: deploy --env production\n');
    expect(canonical()).toBe('https://docs.filmopen.ai/docs/');
    // And the development site its own — which is also how this leaves dist/
    // for the tests of the built site that follow.
    expect(deploy(['dev']).status).toBe(0);
    expect(canonical()).toBe('https://docs.dev.filmopen.ai/docs/');
  });

  it('takes the name of an environment, and nothing else', () => {
    for (const argv of [[], ['staging'], ['dev', '--config', '/tmp/evil.jsonc'], ['dev', '-c/tmp/evil.jsonc'], ['--env', 'dev'], ['dev', 'production'], ['dev --name other'], ['dev', '--']]) {
      const answer = deploy(argv);
      expect(answer.status, argv.join(' ')).toBe(2);
    }
    expect(reported()).toBe('');
  });

  it('unsets whatever would send the token somewhere else — every name on its list, each one set', () => {
    // Values a build can live with, since the site is built under them first:
    // the wrapper clears wrangler's environment, not the caller's own build's.
    const harmless: Record<string, string> = { NODE_OPTIONS: '--no-deprecation', NODE_TLS_REJECT_UNAUTHORIZED: '1' };
    const set = Object.fromEntries(UNSET.map((name) => [name, harmless[name] ?? 'https://collector.invalid']));
    const answer = deploy(['dev'], set);
    expect(answer.status, answer.out).toBe(0);
    expect(reported()).toContain('argv: deploy --env dev\n');
    expect(reported()).not.toContain('SURVIVED');
  });

  it('unsets exactly the names this test sets: the script\'s list and this one are the same list', () => {
    const script = readFileSync('scripts/deploy.sh', 'utf8');
    const statement = /^unset ((?:[A-Za-z_]+[ \\\n]*)+)$/m.exec(script);
    const names = (statement?.[1] ?? '').split(/[\s\\]+/).filter((name) => name !== '');
    expect([...names].sort()).toEqual([...UNSET].sort());
    expect(script.match(/^unset /gm)).toHaveLength(1);
  });

  it('refuses a token file that others can read, or that carries no token, before anything runs', () => {
    expect(deploy(['dev'], {}, keysFolder(0o644)).out).toContain('a token file is 600');
    expect(deploy(['dev'], {}, mkdtempSync(join(tmpdir(), 'filmopen-empty-'))).out).toContain('cannot read');
    expect(deploy(['dev'], {}, keysFolder(0o600, 'CLOUDFLARE_ACCOUNT_ID=x\n')).status).not.toBe(0);
    expect(reported()).toBe('');
  });

  it('refuses a configuration that is not the one this repository checks, and never reaches wrangler', () => {
    // wrangler reads wrangler.json before wrangler.jsonc.
    writeFileSync('wrangler.json', '{"name":"someone-elses","build":{"command":"env"}}');
    try {
      const answer = deploy(['dev']);
      expect(answer.status).not.toBe(0);
      expect(answer.out).toContain('wrangler.json would be read instead of wrangler.jsonc');
      expect(reported()).toBe('');
    } finally {
      rmSync('wrangler.json', { force: true });
    }
  });
});
