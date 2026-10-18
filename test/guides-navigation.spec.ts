import { readFileSync, readdirSync } from 'node:fs';
import { sep } from 'node:path';

import { describe, expect, it } from 'vitest';

/** Read the rendered main navigation so route and nesting regressions are visible. */
function navigation(): string {
  const html = readFileSync('dist/docs/guides/account/index.html', 'utf8');
  const nav = /<nav\b[^>]*aria-label="Main"[\s\S]*?<\/nav>/.exec(html)?.[0];
  if (!nav) throw new Error('The built account page has no main navigation.');
  return nav;
}

/** Find a named group and keep its children through the first closing details tag. */
function group(nav: string, label: string): string {
  const summary = [...nav.matchAll(/<summary\b[^>]*>[\s\S]*?<\/summary>/g)]
    .find((match) => match[0].replace(/<[^>]+>/g, '').trim() === label);
  if (!summary) throw new Error(`The main navigation has no ${label} group.`);
  const start = summary.index + summary[0].length;
  return nav.slice(start, nav.indexOf('</details>', start));
}

describe('guide navigation', () => {
  it('names the plugin types once and keeps their overview address', () => {
    const nav = navigation();
    expect((nav.match(/>Types of Plugins</g) ?? []).length).toBe(1);
    const types = group(nav, 'Types of Plugins');
    expect(types).toMatch(/href="\/docs\/guides\/plugin-types\/"[^>]*><span[^>]*>Overview<\/span>/);
    expect(types).not.toContain('<summary');
    expect(nav).not.toMatch(/<summary\b[^>]*>[\s\S]*?>plugin-types</);
  });

  it('keeps model and prompt types in their type group', () => {
    const types = group(navigation(), 'Types of Plugins');
    for (const slug of ['model-pickers', 'prompt-writers']) {
      expect(types).toContain(`href="/docs/guides/plugin-types/${slug}/"`);
    }
  });

  it('lists every plugin as one direct page link with its existing address', () => {
    const plugins = group(navigation(), 'List of plugins');
    expect(plugins).not.toContain('<summary');
    const expected = readdirSync('src/content/docs/docs/guides')
      .filter((name) => name.startsWith('fo-'))
      .sort()
      .map((name) => `/docs/guides/${name}/`);
    // Only the registered packages' own pages: another plug-in's guide may follow them (publishing.md).
    const links = [...plugins.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((href) => href !== undefined && /^\/docs\/guides\/fo-[^/]+\/$/.test(href));
    expect(links).toEqual(expected);
  });

  it('links every built guide page exactly once, since the Guides group is listed by hand', () => {
    const nav = navigation();
    const root = 'dist/docs/guides';
    const pages = readdirSync(root, { recursive: true, encoding: 'utf8' })
      .filter((file) => file === 'index.html' || file.endsWith(`${sep}index.html`))
      .map((file) => `/docs/guides/${file.split(sep).slice(0, -1).map((part) => `${part}/`).join('')}`);
    expect(pages.length).toBeGreaterThan(20);
    for (const page of pages) {
      const links = nav.match(new RegExp(`href="${page.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g')) ?? [];
      expect(links.length, page).toBe(1);
    }
  });
});
