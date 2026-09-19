# CLAUDE.md — how to work on filmopen-docs

This repository is **the FilmOpen documentation site**: a static Starlight
site, one Worker per branch, on `docs.dev.filmopen.ai` and `docs.filmopen.ai`.
**It is public, and everything in it is public forever**: a page, a test, a
commit message, a snapshot. The website is `filmopen-ai/filmopen-web`
(`~/src/filmopen-web`, private), the app is `aaronbergen/filmopen`
(`~/src/filmopen`, private), and **each repository is worked on under its own
routine**: a session here changes the others only where a step names them.

The milestone plans, the notes and **the record of how this site is configured
— every id, every command — are in the website's repository**, which is
private for that reason (`~/src/filmopen-web/docs/`: `FilmOpen-Website Plan.md`
§3.1 and W1, the milestone plans and their results, `setup-server.md`). Nothing
of them is copied here.

## 1 The stack, and what is here

TypeScript. **Astro 7** with **Starlight 0.42** (static output, search by
Pagefind, light and dark), a **Worker with static assets and no script**,
**vitest 4** in plain Node, npm, **Node 24** (`.node-version`, which is what
Cloudflare's build image runs). Astro's own Markdown processor: no remark
plugin, which would mean swapping it out for the whole site.

```
src/content/docs/         the pages written here; a file's place is its address
  index.mdx               /                 the landing page
  404.md                  the page for an address that names nothing
  docs/                   /docs/…           everything else — see §2
snapshot/files/           the application's public documents, byte for byte
snapshot/manifest.json    which commit they are from, and each one's SHA-256
src/snapshot/             publish.ts (what may be imported), manifest.ts,
                          placement.ts (where each appears), placeholders.ts
src/config/               site.ts — what wrangler.jsonc must be, whole — and jsonc.ts
scripts/                  import.ts, verify-snapshot.ts, generate.ts, check-config.ts,
                          deploy.sh (the token), check-no-keys.sh, install-hooks.sh
test/                     the refusals, the manifest, the configuration, the
                          deploy wrapper against a fake wrangler, the pre-commit
                          check in a scratch repository, the built site
public/_headers           the headers every page is sent with
.github/                  the pull-request check, and the code owners
```

npm 11 runs a dependency's install script only when `package.json` allows it
(`allowScripts`): `esbuild`, `workerd` and `sharp` fetch a binary in theirs.
After a version bump of any of them, `npm install-scripts approve <pkg>` again.

## 2 The addresses are a contract

The app opens `‹site›/docs/platforms/‹id›`, `‹site›/docs/guides/account/` and
`‹site›/spec`, and the website redirects `/docs/*` to this host **keeping the
path**. So every page lives under `/docs/…`, a page's place under
`src/content/docs/` is its address letter for letter (hence
`src/content/docs/docs/…`), and **an address that exists is not moved**: the
app's builds are in people's hands, and a link in one cannot be edited.
`test/site.spec.ts` holds the ones the app opens.

## 3 Snapshots: never edited, always checkable

The specifications, the platform guides with their pictures and the plug-in
author's guide are **copies**, and the rule is simple: **nothing under
`snapshot/` is ever edited, added or removed by hand.**

- **What is public is decided in the application's repository**, in its
  `docs/publish.json`. `npm run import -- --source ../filmopen-publish` copies exactly
  what that names and **refuses** anything else — a path given to it that the
  manifest does not name, a never-published document whatever names it
  (`src/snapshot/publish.ts`), a symbolic link or a submodule, a file that is
  not Markdown or a picture, a file over 5 MB, and a file — a picture too —
  that carries something shaped like a credential *written out in its bytes*.
  A key inside a picture's compressed text chunk, or drawn in its pixels, is
  not something a scan finds: **every picture a snapshot adds is opened and
  looked at** before it is pushed.
- **A snapshot is of one commit, so an import is always whole.** A path on its
  command line is a question (*is this public?*), never a request to copy it
  alone: the first version kept the rest of an older snapshot beside it, and a
  document `publish.json` had stopped naming stayed on the site under a
  manifest that said otherwise.
- **It reads a commit, never a working tree**: the manifest and every document
  come out of the source's `HEAD` through git, so an uncommitted edit, an
  untracked file or an ignored one cannot reach a public site.
- **`npm run snapshot:verify`** holds every copy to its SHA-256 in
  `snapshot/manifest.json`, in every build and in the pull-request check; with
  `-- --source ../filmopen-publish` it also holds them to the commit they name, which
  is what *byte for byte* means, **and to `publish.json`, at that commit and
  at the checkout's `HEAD`**: bytes that match a private document are still a
  private document, and the commit a manifest names is a claim in a file
  anyone can edit — an older one may have published what has since been taken
  back. So the source is the checkout whose `HEAD` is what the application
  publishes today.
- **The pull-request check cannot know where a file came from**: it runs
  without the application's repository, which is private, so a file added
  under `snapshot/files/` *with* a correct manifest line is green there. **A
  change that touches `snapshot/` at all is merged only after
  `npm run snapshot:verify -- --source <the application's checkout>`**, by
  whoever merges it.
- **Where a document appears** is `src/snapshot/placement.ts`. A document that
  is published and not placed fails the build, so nothing public goes missing
  quietly.
- **The pages the site builds are derived** (`scripts/generate.ts`, before
  every `dev`, `check` and `build`) and **never committed**; `.gitignore` names
  them and a test holds it to `placement.ts`. A specification's title and
  opening line go into frontmatter, a note says which commit and version it is
  a copy of, and a `<placeholder>` in running text is kept from being read as
  HTML — it used to render as nothing. **A message the app shows is quoted
  letter for letter** in a page written here, from the app's
  `packages/filmopen_l10n/lib/l10n/app_en.arb`. The platform guides were written as
  Starlight pages and are copied unchanged.
- **A snapshot is refreshed by a person, or at a milestone's close** — never
  by anything automatic. To change a document, change it where it is kept.

## 4 The commands

```bash
npm install                    # once per clone; then scripts/install-hooks.sh
npm run dev                    # the site at http://localhost:4321
npm run check                  # check:config, snapshot:verify, generate, astro check, tsc, eslint
npm test                       # builds the site, then vitest over the code and the build
npm run build                  # what Cloudflare runs
npm run import -- --source ../filmopen-publish    # a new snapshot
npm run snapshot:verify -- --source ../filmopen-publish   # the copies against their commit
scripts/deploy.sh dev          # rarely: see §6
```

## 5 The environments, and who pushes

| | dev | production |
|---|---|---|
| Branch | `dev` | `main` |
| Worker | `filmopen-docs-dev` | `filmopen-docs-production` |
| Host | `docs.dev.filmopen.ai` | `docs.filmopen.ai` |
| Open to | everyone — the documentation is public — and `noindex` | everyone |

Each is its own Worker with its own Git connection in Workers Builds: build
`npm run build`, deploy `npx wrangler deploy --env <env>`, builds for other
branches off. **Deploying is pushing**, so:

- a session **pushes `dev`** once a step's critic has passed, and nothing else;
- `main` takes a **pull request the owner merges**;
- a contributor's work arrives as a pull request against `dev`, passes the
  `check` workflow, and is reviewed and merged by the owner
  (`CONTRIBUTING.md`, `.github/CODEOWNERS`). **GitHub does not require that
  review yet**: `dev`'s ruleset refuses a force-push and a deletion and
  nothing more, by the owner's decision of 18 September 2026 — the required
  review of a code owner is switched on the day the first outside pull request
  arrives, and from then on a session delivers through pull requests too;
- never force-push, never rewrite a pushed commit, never delete an unmerged branch or a branch on the remote: a merged branch becomes an `archive/` tag (§7).

**`wrangler.jsonc` is held to `src/config/site.ts`, whole**: parsed, it must
*equal* the expected object — no script, no binding, no variable, no `build`
command, one route an environment. It is checked before every build,
Cloudflare's included, and before `deploy.sh` loads a token. A change to it
is a change to both files, and a decision.

Commit messages: `Milestone N step k: <what>`, `Fix: <what>`, `Docs: <what>`
for a page written here, `Snapshot: <commit>` for an import.

## 6 Secrets: there are none here

**This repository needs no key and holds none.** The one credential anything
here touches is the Cloudflare token, which lives outside every checkout in
`~/src/filmopen-keys/website/cloudflare.env`, and `scripts/deploy.sh` is the
only thing that reads it: it takes **the environment's name and nothing else**,
checks the configuration and builds the site *before* the token exists in its
shell, unsets what would redirect wrangler, and runs exactly `wrangler deploy
--env <name>`. It is for a Worker's first deploy — a Git connection attaches
to a Worker, and a Worker exists once something has deployed it — and for
looking at a change on the development site before it is pushed.

Anything else on Cloudflare — a Git connection, a DNS record — goes through the
website repository's `scripts/cf.sh api`, and into its record.

`scripts/check-no-keys.sh` reads the staged change before every commit and
prints a file's name, never a value; `--all` reads every file git would take,
new ones included. A test's stand-in for a key is put together at runtime.

**A commit's author line is public too, and for ever.** A machine's global git
setting is usually a person's own mailbox — this repository's first commit
went out with one — so the same check refuses a commit whose author or
committer address is not a GitHub `…@users.noreply.github.com`, without
printing it: **before the commit, and again before the push**, because a
merge, a cherry-pick and a rebase make commits without running the first
hook, and the push is the moment an address becomes public. After cloning:
`scripts/install-hooks.sh`, and
`git config --local user.email "<id>+<login>@users.noreply.github.com"`.
`FILMOPEN_ALLOW_AUTHOR_ADDRESS=yes` for one command is for somebody who means
to publish theirs; `--no-verify` skips either hook, by git's design, and is
never a session's to use. Two things no hook here reaches. A contributor may not have
installed them: **look at a pull request's commits before merging it**, and
offer a squash when one carries an address its author may not have meant to
publish. And **a merge made on GitHub's site is authored with the merger's
GitHub e-mail setting**, not this checkout's: with *Keep my email addresses
private* on (GitHub → Settings → Emails) it is the noreply address, and
without it, it is the account's own.

## 7 The routine

The website's, since this site's steps are steps of its milestones: a step is
built → `npm run check` and `npm test` green → a **critic** (a separate
session; the app repository's `.claude/agents/critic.md`, with this
repository's checks) → fix → critic again; a screen score and a code score out
of ten, eight passes, at most five rounds. The note and the record are the
website repository's. **The coder designs** what a page says and how it is
laid out; the style and the messaging are reviewed once, in the website's
milestone 1.6, over the pages as built.

### Milestones, branches and worktrees

The owner's rules of 20 September 2026, the same in the four repositories that stand side by side on a development machine — `filmopen-app`, `filmopen-web`, `filmopen-docs`, `filmopen-plugins`:

- **A milestone's number is written with a hyphen**: 1-2, 1-10. Its plan and its note are the website repository's `docs/FilmOpen-Milestone <n> Plan.md` and `… Results.md`.
- **Work on a milestone starts by making its branch and its worktree, both named `filmopen-docs-milestone-<n>`, beside the checkout**: told to work on milestone 1-3, from the checkout on `dev`, `git worktree add ../filmopen-docs-milestone-1-3 -b filmopen-docs-milestone-1-3 dev`, and everything of the milestone happens there. Where the worktree exists the milestone is open: continue in it. A track opened before 20 September keeps its branch and its worktree until it is merged.
- **What is still to be done is written in the website repository's `docs/FilmOpen-Open items.md`, never only in a note**: a gap, a defect left, a question for the owner, a proposal, a change proposed for this file, each under the milestone that raised it, as it arises, and struck in the change that settles it. A note says what was built and why; it is archived at the merge, and what is archived is not read again.
- **A milestone is merged into `dev` only when the owner says so.** Before the merge, on the milestone's branch: check that everything the milestone leaves to be done is in the open-items file, then `git mv` its plan, its note and any other document of its own into the website repository's `docs/archive/` and commit, so that its `docs/` holds active work only. The merge: from the checkout on `dev`, `git merge --no-ff`, then `npm run check` and `npm test` on the merged tree, then the commit; `dev` is pushed as §5 says, and `main` still takes a pull request the owner merges.
- **After the merge the branch becomes a tag and its worktree goes**: `git tag -a archive/<branch> <branch> -m "<branch>: <what it did>. Merged into dev at <short sha>, <date>."`, then `git worktree remove ../<branch>` and `git branch -d <branch>`; `git switch -c <branch> archive/<branch>` brings one back. Never force either: a worktree that is not clean, or a branch git will not delete, is left and named in the report. Never delete an unmerged branch, and never delete a branch on the remote or push a tag unless the owner says so.

## 8 Hard stops

Stop and ask the owner: anything that would make a **private document public**
— a new entry in the application's `publish.json` is the owner's; a key, a
token, an e-mail address or an address of ours in a page, a picture, a test or
a commit; moving or removing an address the app opens; deleting a Worker, a DNS
record, or a branch that is unmerged or on the remote; a change to the branch rules; a sign-in or an account
creation by a session; and merging anything into `main`.
