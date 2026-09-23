import process from 'node:process';

import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

// Which site this build is: it decides the canonical address of every page,
// and a production page whose canonical address is the development site
// tells a search engine to prefer the one that says `noindex`. Cloudflare's
// build says which branch it is building (`main` is production), and
// `scripts/deploy.sh production` says so itself; anything else — `npm run
// dev`, a build for the tests — is the development site.
const production = process.env.WORKERS_CI_BRANCH === 'main' || process.env.FILMOPEN_DOCS_ENVIRONMENT === 'production';
const site = production ? 'https://docs.filmopen.ai' : 'https://docs.dev.filmopen.ai';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'FilmOpen documentation',
      description: 'Guides to FilmOpen, the AI platforms it works with, and the specifications of its file format, its software and its agent layer.',
      social: [{ icon: 'github', label: 'The documentation on GitHub', href: 'https://github.com/filmopen-ai/filmopen-docs' }],
      // Every page lives under /docs/…, because the app opens ‹site›/docs/…
      // and the website sends those here with the path kept
      // (src/snapshot/placement.ts). A folder is a group, in the pages' own order.
      sidebar: [
        { label: 'Guides', items: [{ autogenerate: { directory: 'docs/guides' } }] },
        { label: 'AI platforms', items: [{ autogenerate: { directory: 'docs/platforms' } }] },
        {
          label: 'Specifications',
          // Named one by one: the Software Specification is a folder of pages
          // (src/snapshot/placement.ts) and would otherwise be a group called
          // after its directory, sorted before the other two.
          items: [
            'docs/specifications',
            'docs/specifications/project',
            { label: 'Software Specification', items: [{ autogenerate: { directory: 'docs/specifications/software' } }] },
            'docs/specifications/mcp',
          ],
        },
      ],
      // A snapshot has no history here, so a date comes only from a page that
      // says its own (`lastUpdated` in its frontmatter), as the platform guides do.
      lastUpdated: false,
    }),
  ],
});
