# Contributing to the FilmOpen documentation

This repository is the documentation at [docs.filmopen.ai](https://docs.filmopen.ai). It is public so that the people who use FilmOpen — and the people and coding agents who write plug-ins for it — can correct it and add to it. A contribution is a pull request.

## What you can change here, and what you cannot

| | |
|---|---|
| **Guides** — `src/content/docs/docs/guides/`, and the pages about the site itself | Written here. Corrections, clarifications and new guides are all welcome. |
| **The specifications, the platform guides and the plug-in author's guide** — everything under `snapshot/` | **Copies.** They are maintained with the application and imported here byte for byte; a pull request that edits one is not merged: the next import would undo it, and the build fails on a copy that no longer matches the manifest. **What that check cannot know is where a file came from** — the application's repository is private, and the check runs without it — so a pull request that touches `snapshot/` at all, the manifest included, is merged only by a maintainer who has run `npm run snapshot:verify -- --source <checkout>` on it, against the checkout of the application whose `HEAD` is what it publishes today. [Open an issue](https://github.com/filmopen-ai/filmopen-docs/issues) saying what is wrong and where, and it is taken up where the document is kept. |
| **The site's code** — `scripts/`, `src/snapshot/`, `src/config/`, `wrangler.jsonc` | Open an issue first. `wrangler.jsonc` in particular is held to an exact shape, and a change to it is a change to how the site is deployed. |

## Making a change

1. Fork the repository and branch from **`dev`**. **A commit's author address is public for ever**: unless you mean to publish yours, commit with your GitHub noreply address (GitHub → Settings → Emails shows it) — `git config --local user.email "<id>+<login>@users.noreply.github.com"`. `scripts/install-hooks.sh` installs a check that refuses a commit — and a push — carrying any other address, and says how to let one through on purpose.
2. Install and look at the site:
   ```bash
   npm install
   npm run dev          # http://localhost:4321
   ```
   Node 24 (`.node-version`). npm 11 runs a dependency's install script only if `package.json` allows it, which it does for the three that need one.
3. Write. A page is Markdown with a little frontmatter — copy the top of [`account.md`](src/content/docs/docs/guides/account.md). A page's place under `src/content/docs/` is its address on the site, and everything lives under `docs/`, because the app opens `filmopen.ai/docs/…` and is sent here with the path kept: a guide at `src/content/docs/docs/guides/first-film.md` is `docs.filmopen.ai/docs/guides/first-film/`.
4. Check it, exactly as the pull request will be checked:
   ```bash
   npm run check        # the configuration, the snapshot, the types, the lint
   npm test             # builds the site, then tests what was built
   ```
5. Open a pull request **against `dev`**. The `check` workflow runs on it, and a maintainer reviews it and merges it — the code owners are in [`.github/CODEOWNERS`](.github/CODEOWNERS). That review is how the repository is run, **not yet a rule GitHub enforces**: `dev` refuses a force-push and a deletion and nothing more, and a required review is switched on when outside contributions begin.

## What happens next

A merge into `dev` is built and live at [docs.dev.filmopen.ai](https://docs.dev.filmopen.ai) within about a minute. `dev` is merged into `main` — which is [docs.filmopen.ai](https://docs.filmopen.ai) — by the maintainers, with a release of the application or when the guides have changed enough to be worth it.

## Licence

What you contribute is published under the repository's licences: **CC BY 4.0** for a page, **MIT** for code ([LICENSE-DOCS.md](LICENSE-DOCS.md), [LICENSE](LICENSE)). The specifications and the other copies under `snapshot/` carry their own terms and are not yours or ours to relicense here.

## Writing for this site

Say what a person can do, in the order they will do it, in the words the app uses on screen (**Settings → Provider keys**, not "the keys page"). **A message the app shows is quoted letter for letter**, from the app's own strings: a page that paraphrases one sends a person looking for a line they will never see. Say what is not built yet rather than leaving it out. Do not put a key, a token or anybody's e-mail address in a page, a screenshot or a commit: the repository is public, a push is permanent, and a check refuses the commit.
