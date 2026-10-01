import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { parseManifest } from '../src/snapshot/manifest.ts';

/**
 * The site as it was just built (`npm test` builds first): the addresses the
 * app opens, the specifications as they were written, and nothing of them
 * lost on the way to HTML.
 */
const page = (path: string): string => readFileSync(join('dist', path, 'index.html'), 'utf8');

function pages(folder = 'dist'): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return pages(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

describe('the addresses', () => {
  it('are the ones the app opens, under /docs/ as the website sends them', () => {
    for (const path of [
      '',
      'docs',
      'docs/guides/account',
      'docs/guides/plugins',
      'docs/platforms',
      'docs/platforms/fal',
      'docs/platforms/openai',
      'docs/platforms/openrouter',
      'docs/platforms/fal-notes',
      'docs/specifications',
      'docs/specifications/project',
      'docs/specifications/software',
      'docs/specifications/mcp',
    ]) {
      expect(existsSync(join('dist', path, 'index.html')), `/${path}/`).toBe(true);
    }
    expect(existsSync('dist/404.html')).toBe(true);
  });

  it('carry the platform guides\' pictures', () => {
    const fal = page('docs/platforms/fal');
    expect((fal.match(/<img /g) ?? []).length).toBeGreaterThanOrEqual(6);
  });

  it('can be searched', () => {
    expect(existsSync('dist/pagefind/pagefind.js')).toBe(true);
  });
});

describe('a specification', () => {
  const manifest = parseManifest(readFileSync('snapshot/manifest.json', 'utf8'));

  it('says which commit it is a copy of, and which version', () => {
    const software = page('docs/specifications/software');
    expect(software).toContain(manifest.source.commit.slice(0, 7));
    const version = manifest.files.find((file) => file.path === 'docs/software/index.md')?.version;
    expect(version).toBeDefined();
    expect(software).toContain(`version ${version ?? ''}`);
  });

  it('keeps its title once, not twice', () => {
    expect((page('docs/specifications/project').match(/<h1/g) ?? []).length).toBe(1);
  });

  it('keeps a <placeholder> in running text as the text it was written as', () => {
    // The Software Specification is in parts; the three sentences are in three of them.
    const software = pages()
      .filter((path) => path.includes('/docs/specifications/software/'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');
    for (const text of ['Rejected by &lt;platform&gt;', 'ends in &lt;last four&gt;', '&lt;plug-in&gt;: rewrite']) {
      expect(software, text).toContain(text);
    }
    // And is not escaped twice, which would show the entity itself.
    for (const path of pages()) expect(readFileSync(path, 'utf8'), path).not.toContain('&amp;lt;');
  });
});

describe('every page', () => {
  it('holds no element a browser would render as nothing', () => {
    const known =
      /^(a|abbr|article|aside|b|blockquote|body|br|button|code|details|dialog|div|em|footer|h[1-6]|head|header|hr|html|i|img|input|kbd|label|li|link|main|meta|nav|ol|option|p|path|picture|pre|script|search|section|select|small|source|span|strong|style|sub|summary|sup|svg|table|tbody|td|template|th|thead|title|tr|ul|circle|rect|g|line|polyline|polygon|defs|use|del|s|u|mark|figure|figcaption|dl|dt|dd|time|noscript|form|iframe|video|audio|caption|col|colgroup|tfoot|var|samp|q|cite|wbr)$/;
    const custom = /^(starlight-|site-|mobile-|sl-|pagefind)/;
    // Whole tags, quoted attributes and all — a heading's `aria-label` may
    // carry a `<stem>` of its own, which is an attribute's text and not an
    // element — with scripts and styles, which are not markup, taken out first.
    const tag = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*\s*\/?>/g;
    for (const path of pages()) {
      const html = readFileSync(path, 'utf8').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '');
      const names = new Set([...html.matchAll(tag)].map((match) => (match[1] ?? '').toLowerCase()));
      const unknown = [...names].filter((name) => !known.test(name) && !custom.test(name));
      expect(unknown, path).toEqual([]);
    }
  });

  it('is sent with the site\'s headers, and the development site is kept out of search engines', () => {
    const headers = readFileSync('dist/_headers', 'utf8');
    expect(headers).toContain('X-Content-Type-Options: nosniff');
    expect(headers).toMatch(/https:\/\/docs\.dev\.filmopen\.ai\/\*\n\s+X-Robots-Tag: noindex/);
  });
});
