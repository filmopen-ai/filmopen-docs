import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

interface PluginType {slug: string; title: string; packages: string[]; subtypes: string[]}
const root = 'src/content/docs/docs/guides';
const types = JSON.parse(readFileSync('src/data/plugin-types.json', 'utf8')) as PluginType[];
const read = (path: string): string => readFileSync(join(root, path), 'utf8');
describe('plugin type catalog', () => {
  it('covers every package guide and has distinct unique capability types', () => {
    const guides = readdirSync(root).filter(p => p.startsWith('fo-')).sort();
    expect([...new Set(types.flatMap(t => t.packages))].sort()).toEqual(guides);
    expect(new Set(types.map(t => t.slug)).size).toBe(types.length);
    expect(types.map(t => t.slug)).toEqual(expect.arrayContaining(['image-generation', 'video-generation', 'style-analysis', 'character-analysis']));
  });
  for (const type of types) {
    it(type.title + ' has an index link, page, subtypes and bidirectional package links', () => {
      expect(read('plugin-types/index.md')).toContain('(./' + type.slug + '/)');
      const page = read('plugin-types/' + type.slug + '.md');
      expect(type.subtypes.length).toBeGreaterThan(0);
      for (const subtype of type.subtypes) expect(page).toContain(subtype);
      for (const plugin of type.packages) {
        expect(page).toContain('(../../' + plugin + '/)');
        expect(read(plugin + '/index.md')).toContain('../plugin-types/' + type.slug + '/');
        expect(existsSync(join('dist/docs/guides', plugin, 'index.html'))).toBe(true);
      }
      expect(existsSync(join('dist/docs/guides/plugin-types', type.slug, 'index.html'))).toBe(true);
    });
  }
});
