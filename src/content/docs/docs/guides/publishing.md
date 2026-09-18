---
title: Writing and publishing these docs
description: How a page gets onto docs.filmopen.ai, from a clone to a live page, for FilmOpen's own authors and for plug-in authors publishing their own guides.
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/publishing.md
sidebar:
  label: Writing and publishing these docs
  order: 3
---

This site is a public repository, [filmopen-ai/filmopen-docs](https://github.com/filmopen-ai/filmopen-docs), and anyone can add to it: FilmOpen's own developers, and the authors of plug-ins who want their guides next to FilmOpen's. This page is the whole route, from a clone to a live page. [`CONTRIBUTING.md`](https://github.com/filmopen-ai/filmopen-docs/blob/dev/CONTRIBUTING.md) holds the same rules in short.

**Everything in the repository is public, and for ever**: every page, every picture, every commit and the address on every commit. Never put a key, a token, an e-mail address or a person's name where you don't mean it to be read.

## Two branches, two sites

| Branch | Site | Who it is for |
|---|---|---|
| `dev` | [docs.dev.filmopen.ai](https://docs.dev.filmopen.ai), hidden from search engines | Everyone writing, and every development build of FilmOpen |
| `main` | [docs.filmopen.ai](https://docs.filmopen.ai) | Everyone using a released FilmOpen |

- **Every change goes to `dev`.** Nobody commits to `main`. A pull request is opened against `dev`, and a change merged into `dev` is live on docs.dev.filmopen.ai within about a minute.
- **`main` changes only with a formal release.** The maintainers merge `dev` into `main` when FilmOpen is released, or when the guides have changed enough to be worth it. Until then docs.filmopen.ai stays as it was, however much `dev` has moved.
- **A pushed commit is never rewritten.** No force-push, and no deleted branch. If your push is refused because `dev` has moved on, pull and push again.

### Which site the app opens

FilmOpen opens its guides at `‹website›/docs/…`, for example *How to get a key* on a Provider keys card, and the website sends every `/docs/…` address here with the path kept:
- **A released FilmOpen** opens `filmopen.ai/docs/…`, which leads to **docs.filmopen.ai**.
- **A development build of FilmOpen** (a debug or profile build, the ones with development mode) opens `dev.filmopen.ai/docs/…`, which leads to **docs.dev.filmopen.ai**, the live `dev` branch.

On 18 September 2026 the development website already sent `/docs/…` here; filmopen.ai will do the same once its new website is live, and until then docs.filmopen.ai can be opened directly. So a page merged into `dev` is what every development build shows at once. A release shows it after the next merge into `main`. **An address that exists is never moved or removed:** builds of the app are in people's hands, and a link inside one can't be changed.

## Two kinds of page

- **Written here**: the guides, under `src/content/docs/docs/guides/`. A page's place there is its address, letter for letter: `src/content/docs/docs/guides/publishing.md` is `/docs/guides/publishing/`. Anyone can add or correct one. One file in that folder is not written here: `plugins.md`, *Writing a plug-in*, is a copy made at every build, which git ignores, so an edit to it is lost.
- **Copied here**: the specifications, the AI platform guides and the plug-in author's guide, under `snapshot/`. They are written in FilmOpen's own repository, which is private, and copied here byte for byte by the maintainers. **Nothing under `snapshot/` is ever edited by hand**: the build checks every copy against a manifest and fails. If one is wrong, [open an issue](https://github.com/filmopen-ai/filmopen-docs/issues) saying what and where.

### A plug-in's own pages

Put them in a folder of their own under `src/content/docs/docs/guides/`, named after your plug-in in lowercase with hyphens, for example `src/content/docs/docs/guides/storyboard-sketcher/`. The folder becomes a group in the sidebar under *Guides*, labelled with the folder's name as you wrote it, and its pages live at `/docs/guides/storyboard-sketcher/…`. Choose the name once: like every address here, it is not moved afterwards. `account`, `plugins` and `publishing` are already taken.

## Set up once

1. **Get a clone.** A FilmOpen maintainer clones `filmopen-ai/filmopen-docs` itself and works on `dev`:

   ```bash
   git switch dev
   git pull
   ```

   Pull again every time you start: on another machine, or after a while, your clone is behind, and a push from it is refused.

   **Everyone else forks it** on GitHub, clones the fork, and adds FilmOpen's repository as `upstream`, so that the fork can keep up with it:

   ```bash
   git remote add upstream https://github.com/filmopen-ai/filmopen-docs.git
   git fetch upstream
   git switch -c my-page upstream/dev
   ```

   Start every change on a branch of its own, made from `upstream/dev` as it is that day. If `dev` moves on while you work, `git fetch upstream` and `git merge upstream/dev` bring your branch up to date, without rewriting what you have already pushed to your fork.
2. **Install Node 24** (the version in `.node-version`, which is what the site is built with), then the site's packages:

   ```bash
   npm install
   ```

3. **Install the hooks, and commit with your GitHub noreply address.** Hooks and a local address belong to a clone, so do this in every clone:

   ```bash
   scripts/install-hooks.sh
   git config --local user.email "<id>+<login>@users.noreply.github.com"
   ```

   GitHub → Settings → Emails shows your noreply address. With *Keep my email addresses private* and *Block command line pushes that expose my email* turned on there, GitHub also refuses a push that carries your own address. The commit hook refuses a change that carries anything shaped like a key, or an author address that isn't a noreply one. The push hook asks about the addresses again, because a merge, a cherry-pick and a rebase make commits without the first hook. It doesn't scan for keys, so the commit hook is the one that must have run. Both print a file's name, never what they found.

## Write a page

1. **See the site as you write:**

   ```bash
   npm run dev          # http://localhost:4321
   ```

2. **Start from a page that exists.** Copy the top of [`account.md`](https://github.com/filmopen-ai/filmopen-docs/blob/dev/src/content/docs/docs/guides/account.md): a `title`, a one-sentence `description`, an `editUrl` pointing at the file on `dev`, and a sidebar `label` and `order`.
3. **Write what a person does, in the order they do it,** with the words the app shows on screen: **Settings → Provider keys**, not "the keys page". A message the app shows is quoted letter for letter. Say what isn't built yet rather than leaving it out.
4. **Pictures go in a folder named after the page,** beside it: `publishing.md` would use `publishing/step-1.png`, written in the page as `![What the picture shows](./publishing/step-1.png)`. The text in brackets describes the picture for someone who can't see it: say what is on it and what is outlined.

### Screenshots

The platform guides show how every picture here is made, and a plug-in's guide can follow the same rules:
- **One step, one picture,** cropped to the part of the page the step is about, and the thing to press outlined in red.
- **Nothing private on it.** Black out a key before you take the picture, not afterwards, because a key in the original file is still a key. Leave out e-mail addresses, names, account and invoice numbers, and card details. Take the picture before you type any of those, or cover them.
- **In FilmOpen, a stand-in value,** never a real key. A development build can be driven through its own MCP server and pictured from its own render tree, with a stand-in that its built-in key check accepts.
- **Look at every picture before it is committed,** at full size. Something shaped like a key is caught by a check. A key drawn in a picture's pixels is not.
- **Say when it was taken.** Sites change, so a guide says the date its pictures were taken, and which steps it describes without having tried them.

## Check it, then open a pull request

1. Run what the pull request's check will run:

   ```bash
   npm run check        # the configuration, the copies, the types, the lint
   npm test             # builds the site, then tests the built pages
   ```

2. **Commit** with a message that says what changed: `Docs: <what>` for a page written here.
3. **Open a pull request against `dev`**, never `main`. The `check` workflow runs on it, and a maintainer reads it, looks at its commits and its pictures, and merges it. Within about a minute of the merge, your page is on docs.dev.filmopen.ai.
4. **Your page reaches docs.filmopen.ai with the next release,** when the maintainers merge `dev` into `main`.

### FilmOpen's own changes

A maintainer's change follows the same route with one difference: it can be pushed to `dev` directly, once `npm run check` and `npm test` pass and a review by someone other than its author has passed it.

## Updating a copied document

This is the maintainers' part: a copy can only come from FilmOpen's repository, which is private.
1. **Change the document where it is kept**, in FilmOpen's repository: a platform guide is `docs/platforms/‹platform›.md`, with its pictures in `docs/platforms/‹platform›/`. Commit it there. What is public is decided there too, by `docs/publish.json`, and nothing it doesn't name can be copied.
2. **Import it here**, from a checkout of FilmOpen whose `HEAD` is what it publishes today and holds `docs/publish.json`. The maintainers keep one beside this repository as `../filmopen-publish`:

   ```bash
   npm run import -- --source ../filmopen-publish
   ```

   The import reads that commit through git, never the working files, so nothing uncommitted can get out. It is always whole, and refuses anything `publish.json` doesn't name, a file that isn't Markdown or a picture, a file over 5 MB, and anything shaped like a credential. Commit what it wrote as `Snapshot: ‹commit›`.
3. **Hold the copies to their commit**, then look at every picture the import added:

   ```bash
   npm run snapshot:verify -- --source ../filmopen-publish
   ```

4. Check, review and push to `dev` as above.

### An example: the xAI guide

The [xAI (Grok) guide](/docs/platforms/xai/) was added on 18 September 2026 this way:
1. **An account, step by step.** A new xAI account was opened in a browser, and each page was pictured as it came: sign-up, the team, buying credit (with auto top-up, which is on by default), and creating the key. Each picture was cropped to its step, and the button outlined in red. The key was blacked out on the page before its picture was taken, and the full-screen captures were deleted once cropped. The owner signed in, paid and copied the key; nothing private went through the person taking the pictures.
2. **FilmOpen's side.** A development build was started without a screen, through its MCP server. Its Provider keys card was pictured with a stand-in value, and so was *Key was accepted*. The owner then saved the real key in their own FilmOpen and dictated with it, to be sure the steps worked.
3. **Facts, from their sources.** What $5 and $50 buy, whether they are subscriptions (they aren't) and what auto top-up does were checked against xAI's billing pages, and each claim in the guide links to the page it came from.
4. **Written where it is kept.** The guide went into FilmOpen's repository as `docs/platforms/xai.md` with 14 pictures, beside its [technical notes](/docs/platforms/xai-notes/), and the overview of platforms was updated with it. FilmOpen's file for xAI names the guide, which gives the xAI card its *How to get a key* button.
5. **Imported, checked, reviewed, pushed.** The import copied them here at that commit, `npm run check` and `npm test` passed, a separate review read every page and looked at every picture, and what it found was fixed before the push to `dev`.
