import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';
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

  it('lists every plugin as one direct page link with its existing address', () => {
    const plugins = group(navigation(), 'List of plugins');
    expect(plugins).not.toContain('<summary');
    const expected = readdirSync('src/content/docs/docs/guides')
      .filter((name) => name.startsWith('fo-'))
      .sort()
      .map((name) => `/docs/guides/${name}/`);
    const links = [...plugins.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
      .map((match) => match[1]);
    expect(links).toEqual(expected);
  });

  it('puts the five category pages directly under Styles', () => {
    const styles = group(navigation(), 'Styles');
    expect(styles).not.toContain('<summary');
    const categories = ['modern-cinema', 'classic-cinema', 'cell-phone', 'animated', 'experimental-cinema'];
    const links = [...styles.matchAll(/<a\b[^>]*href="([^"]+)"/g)]
      .map((match) => match[1]);
    expect(links).toEqual(categories.map((name) => `/docs/guides/styles/${name}/`));
  });

  it('uses one shared scene sentence across fifty distinct style prompts', () => {
    const root = 'src/content/docs/docs/guides/styles';
    const files = readdirSync(root).filter((name) => name.endsWith('.md'));
    expect(files).toHaveLength(5);
    const styles: string[] = [];
    const base = 'Two people talking, leaning on their car, with a suburban house in the background, dog playing in the yard.';
    for (const file of files) {
      const markdown = readFileSync(join(root, file), 'utf8');
      const prompts = [...markdown.matchAll(/```text wrap\n([\s\S]*?)\n```/g)]
        .map((match) => match[1] ?? '');
      expect(prompts[0], file).toBe(base);
      styles.push(...prompts.slice(1));
    }
    expect(styles).toHaveLength(50);
    expect(new Set(styles).size).toBe(50);
  });

  it('renders a square JPEG example with useful alt text for every style', async () => {
    const root = 'src/content/docs/docs/guides/styles';
    const files = readdirSync(root).filter((name) => name.endsWith('.md'));
    const paths: string[] = [];
    for (const file of files) {
      const markdown = readFileSync(join(root, file), 'utf8');
      const images = [...markdown.matchAll(/!\[([^\]]+)\]\((\.\/[^)]+\.jpg)\)/g)];
      const prompts = [...markdown.matchAll(/\*\*Style prompt\*\*/g)];
      expect(images.length, file).toBe(prompts.length);
      const slug = file.replace(/\.md$/, '');
      const html = readFileSync(`dist/docs/guides/styles/${slug}/index.html`, 'utf8');
      const rendered = [...html.matchAll(/<img\b[^>]*\bwidth="1024"[^>]*\bheight="1024"[^>]*>/g)];
      expect(rendered.length, file).toBe(images.length);
      for (const image of images) {
        const alt = image[1];
        const path = image[2];
        if (!alt || !path) throw new Error(`Incomplete image in ${file}.`);
        expect(alt.length, path).toBeGreaterThan(30);
        const source = join(root, path);
        const metadata = await sharp(source).metadata();
        expect([metadata.format, metadata.width, metadata.height], source)
          .toEqual(['jpeg', 1024, 1024]);
        paths.push(source);
      }
    }
    expect(paths).toHaveLength(50);
    expect(new Set(paths).size).toBe(50);
  });
});
