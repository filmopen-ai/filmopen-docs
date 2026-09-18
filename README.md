# filmopen-docs

The documentation of [FilmOpen](https://filmopen.ai): guides, the AI platforms it works with, and the specifications of its file format, its software and its agent layer. A static [Starlight](https://starlight.astro.build) site, public, served from Cloudflare.

| Branch | Shows at | Holds |
|---|---|---|
| `dev` | [docs.dev.filmopen.ai](https://docs.dev.filmopen.ai) | the documentation as it is being written |
| `main` | [docs.filmopen.ai](https://docs.filmopen.ai) | the documentation as released |

Each branch builds and deploys itself on every push. Every page lives under `/docs/…`, because the app opens `filmopen.ai/docs/…` and the website sends those here with the path kept.

## Two kinds of page

**Written here** — the guides, and the pages about the site itself — under `src/content/docs/`. Corrections and new guides are welcome: [CONTRIBUTING.md](CONTRIBUTING.md).

**Snapshots** — the three specifications, the platform guides with their pictures, and the plug-in author's guide — under `snapshot/files/`, **byte for byte** as they stand in the application's repository at one commit, with the SHA-256 of each in [`snapshot/manifest.json`](snapshot/manifest.json). They are never edited here. The application's repository says what is public (its `docs/publish.json`); the importer copies exactly that and refuses anything else; and the pages the site builds are derived from the copies at build time and never committed.

```bash
npm install && scripts/install-hooks.sh
npm run dev                                        # the site, at http://localhost:4321
npm run check                                      # configuration, snapshot, types, lint
npm test                                           # builds the site, then tests what was built

npm run import -- --source ../filmopen             # take a new snapshot (maintainers)
npm run snapshot:verify -- --source ../filmopen    # the copies against the commit they name
```

How the repository is worked on, and by what rules: [CLAUDE.md](CLAUDE.md).

## Licence

The site's code is [MIT](LICENSE); the pages written here are [CC BY 4.0](LICENSE-DOCS.md); the specifications and the other copies under `snapshot/` carry their own terms, which [LICENSE-DOCS.md](LICENSE-DOCS.md) sets out.
