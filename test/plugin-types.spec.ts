import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

interface PluginType {slug: string; title: string; packages: string[]; subtypes: string[]}
const root = 'src/content/docs/docs/guides';
const types = JSON.parse(readFileSync('src/data/plugin-types.json', 'utf8')) as PluginType[];
const read = (path: string): string => readFileSync(join(root, path), 'utf8');
// A plug-in that owns a platform is documented on its platform's page, written in the app.
const platformOf: Record<string, string> = {
  'fo-fal': 'fal', 'fo-openai': 'openai', 'fo-openrouter': 'openrouter', 'fo-xai': 'xai', 'fo-google': 'google',
  'fo-elevenlabs': 'elevenlabs', 'fo-atlascloud': 'atlascloud', 'fo-salad': 'salad', 'fo-cui': 'comfyui',
  'fo-wan2gp': 'wan2gp', 'fo-anthropic': 'anthropic',
};
describe('plugin type catalog', () => {
  it('covers every package guide and has distinct unique capability types', () => {
    const guides = readdirSync(root).filter(p => p.startsWith('fo-')).sort();
    const registered = [...new Set(types.flatMap(t => t.packages))].sort();
    expect(registered.filter(tag => !(tag in platformOf))).toEqual(guides);
    for (const [tag, platform] of Object.entries(platformOf).filter(([tag]) => registered.includes(tag))) expect(existsSync(`snapshot/files/docs/platforms/${platform}.md`), tag).toBe(true);
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
        const platform = platformOf[plugin];
        if (platform) {
          expect(page).toContain(`(/docs/platforms/${platform}/)`);
          expect(existsSync(join('dist/docs/platforms', platform, 'index.html'))).toBe(true);
          continue;
        }
        expect(page).toContain('(../../' + plugin + '/)');
        expect(read(plugin + '/index.md')).toContain('../plugin-types/' + type.slug + '/');
        expect(existsSync(join('dist/docs/guides', plugin, 'index.html'))).toBe(true);
      }
      expect(existsSync(join('dist/docs/guides/plugin-types', type.slug, 'index.html'))).toBe(true);
    });
  }
});
