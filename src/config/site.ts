/**
 * What `wrangler.jsonc` must be — all of it.
 *
 * The website's validator allowlists the keys an environment may carry,
 * because its configuration is large and changes. This one is small and does
 * not, so the check is simpler and stricter: the file, parsed, **equals**
 * this object. A `build` command, a `vars` block, a binding, a second route,
 * a different Worker's name — anything at all — is a difference, and a
 * difference fails `npm run check:config`, which runs before every build,
 * in Cloudflare's too, and before `scripts/deploy.sh` loads a token.
 */

export const ENVIRONMENTS = {
  dev: { worker: 'filmopen-docs-dev', host: 'docs.dev.filmopen.ai', branch: 'dev' },
  production: { worker: 'filmopen-docs-production', host: 'docs.filmopen.ai', branch: 'main' },
} as const;

export type EnvironmentName = keyof typeof ENVIRONMENTS;

export function isEnvironmentName(value: unknown): value is EnvironmentName {
  return typeof value === 'string' && Object.hasOwn(ENVIRONMENTS, value);
}

function environment(name: EnvironmentName): Record<string, unknown> {
  return {
    name: ENVIRONMENTS[name].worker,
    routes: [{ pattern: ENVIRONMENTS[name].host, custom_domain: true }],
    // Nothing of this site needs Cloudflare's own hostnames, so it has none.
    workers_dev: false,
    preview_urls: false,
  };
}

export const EXPECTED_WRANGLER_CONFIG: Record<string, unknown> = {
  $schema: './node_modules/wrangler/config-schema.json',
  name: 'filmopen-docs',
  compatibility_date: '2026-09-17',
  assets: {
    directory: './dist',
    html_handling: 'auto-trailing-slash',
    not_found_handling: '404-page',
  },
  env: { dev: environment('dev'), production: environment('production') },
};

/** Every way two values of JSON can differ, as paths a person can find. */
export function differences(actual: unknown, expected: unknown, at = 'wrangler.jsonc'): string[] {
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) return [`${at} is not the list it should be`];
    if (actual.length !== expected.length) return [`${at} holds ${String(actual.length)} item(s), not ${String(expected.length)}`];
    return expected.flatMap((item, index) => differences(actual[index], item, `${at}[${String(index)}]`));
  }
  if (typeof expected === 'object' && expected !== null) {
    if (typeof actual !== 'object' || actual === null) return [`${at} is not the object it should be`];
    const got = actual as Record<string, unknown>;
    const want = expected as Record<string, unknown>;
    return [
      ...Object.keys(got).filter((key) => !Object.hasOwn(want, key)).map((key) => `${at}.${key} is not a key this site's configuration carries`),
      ...Object.keys(want).flatMap((key) =>
        Object.hasOwn(got, key) ? differences(got[key], want[key], `${at}.${key}`) : [`${at}.${key} is missing`],
      ),
    ];
  }
  return actual === expected ? [] : [`${at} is ${JSON.stringify(actual)}, not ${JSON.stringify(expected)}`];
}
