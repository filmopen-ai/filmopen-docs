# FilmOpen Project Specification

**A plain-text format for describing a film.**

| | |
|---|---|
| **Version** | 1.11 — Draft |
| **Date** | 17 September 2026 |
| **Format version** | `"filmopen": 1` |
| **Status** | Public draft. Open for comment. |
| **Licence** | This specification: CC-BY-4.0. The JSON Schemas derived from it: CC0. |
| **Canonical URL** | https://filmopen.ai/spec |
| **Schemas** | https://filmopen.ai/schema/1/ |

---

## Abstract

A FilmOpen project is a folder of plain JSON files that describes a feature film, series or short
completely: its characters, places, props and looks; its script; its shots and sound; and the media
that realises them. The format is designed to be read and written by people, by scripts, and by AI
systems; to reduce file conflicts when many contributors work on one film; and to remain
fully meaningful as a bare folder of files with no software present.

It serves two directions equally. **Forward:** write a film in text and generate it with AI models.
**Reverse:** analyse an existing film and describe it in text, so that it can be studied, adapted,
translated or regenerated.

---

## Changes in 1.11

- **Plug-ins, as an application runs them** (§14.4). A plug-in is a folder, `plugins/<tag>/` (1.10 wrote
  `plugin/`), holding its manifest, its code, its strings (`l10n/<locale>.arb`) and, when it brings one, a
  platform file for a platform the catalogue does not define. The manifest gains optional fields, so a
  1.10 manifest reads unchanged: `keys` (the keys the plug-in owns, one slot per platform key, named
  `<tag>:<slot>`), `uses` (other plug-ins' keys, or the application's, it asks to use), `provides` (the
  **platform hooks** it implements — `complete`, `render`, `estimateCost`, `verifyKey`), `entitySettings`
  (fields kept in an entity's own file), `actions`, a `scope` on a setting, and `l10n`. The code never sees
  a key: it names one, and the application adds the credential where the platform file says.
- **`plugins`, a common key** (§7): an object keyed by plug-in tag, holding the values of a plug-in's
  settings in a project file and of its `entitySettings` in an entity's file. The format does not
  interpret its contents; it is part of the version like any other attribute, kept through forks and
  copies, and written by an application, never by a plug-in.
- **`plugins/` is a reserved folder of a project** (§4.2), for a plug-in that belongs to one film.
- **A key's store name adds its owner** (§14.9): an application keeps the credentials of a plug-in's key
  under `filmopen/<owner>/<slot>`; a platform file's `keychain` stays `filmopen/<id>`, the base of the name.
- **`capabilities.ai`'s `ctx.ai.complete` takes messages** (§14.4): `(messages, options)`, the shape of the
  platform hook `complete`, where 1.10 wrote `(prompt, options)`. No application ran 1.10's shape, so `api`
  stays `1`.
- **The inline hooks of §14.3** are one way to extend a model or a platform; an application may call
  plug-ins' platform hooks instead (§14.4), and FilmOpen does.

## Changes in 1.10

- **`thumbnails/`** (§4.2, §6.3). A reserved folder of the project holds one small JPEG for each media
  file whose basename is unique, `tn_<basename without extension>.jpg`, fitting within 300 × 300 and
  named relative to the project folder. It travels with the JSON, so a clone browses a film whose media
  lives elsewhere — a synced folder, a cloud service — without fetching it; it is never the only copy of
  anything, and a reader that finds none shows a placeholder.
- **A prefix names a file's purpose, whatever produced it** (§5.5, §12.3). A reference a person supplies
  by hand is a take like any other: `cs` when it is a picture of a library entity, `cl` a clip, `vo` a
  character's audio reference, which is its voice sample, `am` any other sound reference. An
  application's upload is an **import batch** of the uploading author, whose item keeps the file's
  original name in `originalName` — not in the batch's `source.file`, which names the one work a whole
  import came from and an upload of a single reference has none of (§12.3). No prefix is added.
- **A take that exists is never replaced** (§18.3, §12.3). A conforming writer writes a take only where no
  file of that name is there, so nothing generated or uploaded is ever overwritten; a generated
  derivative — a `conform/` slot, a `thumbnails/` picture — is not a take and is re-made as needed.
- **Where a hand-supplied reference goes** (§9.0): the group its kind names, and `preview` following the
  first image when the file has none.
- **The `google-drive` locator** (§4.4): `path` is the folder's path under *My Drive*; the folder's
  identifier on the service is a per-machine substitute, and an application **MUST** ask for access to
  that folder alone and never to the rest of the Drive.
- **Pending platforms** (§14.6, §14.9). A platform in the model catalogue's index may carry
  `"status": "pending"` and `obstacles`, the sentences that say what stands in the way of supporting it,
  so that a developer can take it up. A pending platform keeps its file and its access rows, but an
  application should offer no key and no run on it. A supported platform carries neither field.

## Changes in 1.9

- **A location may say which location it lies within** (§9.3, A.3): `within`, the tag of another
  location — a pier within the harbour. It is informational: it does not nest the location, change its
  tag or resolve anything, and it is independent of sub-areas, whose tags are `<parent>.<area>`.
- **Platform files** (§14.6, §14.9). Each platform of the model catalogue moves out of the index into a
  file of its own, `platforms/<id>.json`. Besides where requests go and how a key is sent, a platform
  file now says what a user copies from the platform (`credentials`), a request that checks a key without
  running a model (`verify`), the hosts the platform's credentials may go to (`hosts`), the pages where
  an account is made, money added, a key created and prices listed, a guide to the platform, and the
  pages, the day and the unconfirmed values behind it (`sources`, `checked`, `unverified`). The index
  lists the platforms by file, name and kind, and a reader reports a platform file the index does not
  list.
- **How a key is kept and sent** (§14.3, §14.9). An application stores a platform's credentials as one
  JSON object under `auth.keychain`, fills `auth.header`'s placeholder from it, and sends it only to the
  platform's `hosts`, following no redirect elsewhere. Keys still stay out of files.

## Changes in 1.8

- **A fork starts without a version label** (§13.1). The copy leaves out `versionLabel` (and the 1.5
  spelling `label`): a label names the version it was written on, and a new version is given one of its
  own, or none.
- **The model catalogue** (§14.6–§14.9). An application's list of AI models is now specified: one JSON
  file per model per category, twelve categories tagged from `stt` to `flfa2v`, and an index,
  `models.json`, that also says for each platform where requests go and how a key is created and sent.
  An entry records what the model accepts and produces, its access rows with their prices, how to run it
  locally, and the pages its values came from. The catalogue is application data, not project data, and
  it is where a `mo` or `pl` library entry comes from.
- **`mo.kind` gains `text`** (§14.3), for the language models that write and reason.

## Changes in 1.7

- **A comparison is two versions, not a column per version** (§13.3). A reader shows the viewer's own
  working version beside **one** other at a time; the others — official, another author's, another
  epoch — are reached by selecting them. The block table and "copy-left is fork when needed" stand;
  the fork is now an explicit question, asked when a reader with no version of their own asks to
  compare.
- **Copy-left never removes what the other version does not have** (§13.3). A key only the viewer has
  is left alone, and so is one the other version holds as nothing — `null`, an empty object, an empty
  list, a blank string — since an empty value is how a key is deleted. Where the two disagree about
  the *shape* of a key, one holding an object and the other a list or a sentence, copy-left does not
  choose between them.
- **Copy-left for a whole section or a whole entity adds and overwrites; it never deletes.** §13.3's
  fourth block case — *id only in mine → delete mine* — belongs to that block's own control. One press
  that removed every line only the viewer had written is not what a bulk control is for.
- **A block copy-left needs an id it can address** (§13.3). A block with no `id`, an `id` that names two
  blocks in the same file, and a `blocks` holding the ids a cue writes (§10.3) rather than blocks are
  each outside the four cases, and offer no copy at all.
- **The version label never moves**, under either spelling: `versionLabel` and the 1.5 `label` (§7).
- **A scene's `epoch` is content, not a header field** (§7, §10.2). The header table's `epoch` row is
  for library entities, whose filename carries the epoch. A scene names the epoch it is set in, and a
  writer must not refuse the file for it.

## Changes in 1.6

- **The pick has its own key.** An author's pick is `pick` in their commentary file (§13.4). `prefer`
  is the 1.5 spelling: readers accept it and treat it as `pick` — `pick` wins when a file carries both
  — and a writer that rewrites the file writes `pick` and drops `prefer`.
- **A pick is dated.** `pickedAt` records when the pick was made, in the same shape as `pick`: a
  timestamp for an entity without epochs, an object keyed by epoch otherwise (§13.4).
- **Official comes before the author's own version** (§6.1 step 2). An author who has said nothing is
  on official; an author who forked is on their fork, because forking records a pick (§13.1). The
  author's own highest version remains the fallback where nothing is official.
- **A pick can be abandoned.** Removing the pick returns the author to official; that is what an
  application does when the author abandons one (§13.4). A pick is still never cleared to leave the
  author with nothing.
- **Official pointers state their time.** `setAt` is required when an application writes a pointer, and
  is RFC 3339 UTC like every other timestamp (§13.2). Comparing it with `pickedAt` tells an author that
  an official version was chosen after their pick — a reader may say so and offer to abandon it. No
  timestamp ever decides resolution (§7).
- **Times are UTC.** §1.4 now says so once, for every timestamp in the format.
- **The tracking value is optional.** `pick` may still be `<versions key>_official`, and readers honour
  it, but an application need not write it: no pick means official. A director's star now removes the
  director's own pick instead of writing the tracking value (§13.2).

## Changes in 1.5

- **Kind.** `kind` is now one of `short-film` · `film` · `mini-series` · `series` (§8.1). Readers read
  1.4's `franchise` as `series`.
- **Every project declares its epochs, and every library entity has one.** `epochs` is required in
  the project file with at least one entry; the first in order is the project's **default epoch**, the
  one an implicit reference falls back to (§6.1, §8.2). An epoch carries a `year`. A character may
  carry a `birthdate`; a reader proposes `appearance.age` at each epoch from the two and the author
  overrides it (§9.1). The reserved token `default` remains valid as an epoch name.
- **Version label.** The common header gains an optional `versionLabel`: a short word for the version
  in version lists (§7). A fork, being a copy, keeps it.
- **The creator directs.** A writer that creates a project lists its creator in `contributors` with
  `role: "director"` (§8.3, §18.3).
- **The pick.** The version an author marks with `prefer` in their commentary is their *pick*: the
  version in use for them. It comes first in resolution (§6.1 step 2), ahead of the author-first
  rule, which otherwise stands. `prefer` may name a stem per epoch (an object keyed by epoch) and may
  be `<versions key>_official`, meaning "the official version, whichever it is" (§13.4). An
  application that forks a version records the fork as the author's pick (§13.1); a director who makes
  a version official follows it (§13.2); an author's `prefer` on the project entity selects the project
  version for them (§4.1). Readers warn about a `prefer` that names no file (§18.2). Removing an
  official pointer is done by deleting the pointer file (§13.2).

## Changes in 1.4

- **Project manifest.** A project folder is identified by one file with a fixed name at its root,
  `filmopen-project.json` (§4.4). It holds the settings that belong to the folder rather than to any
  author's version of the film: the project tag and where the rendered media lives. It is not versioned,
  not authored and not creative content; it is the one file an application writes when it creates a
  project.
- **Media root.** Rendered and imported media may live in a separate folder from the JSON — a folder
  synced by a different service, or a folder outside version control. The manifest names it with a
  typed locator (§4.4); takes are discovered there (§12.1) and media references resolve against it
  (§6.3). Absent a manifest, the project folder is its own media root, as in 1.3.
- **Shared library location.** Models, platforms and plugins are the application's shared library
  (§14.5), installed and updated independently of any project and of the application itself. A project
  folder need not contain them; a project may still hold its own.

## Changes in 1.3

- **Authored projects.** `pj_<tag>_<author>_v<n>.json` uses the same author, version and
  `forkedFrom` conventions as other spec entities. A remake can change language, title, delivery
  settings and story roots in its own complete project file (§4.1, §8.6).
- **Project selection.** Opening an explicit project file selects it. Folder opening uses the project
  official pointer, a sole author's highest version, or an explicit user selection. The selected
  project supplies the context for reference resolution and export.
- **Portable references.** Grouped reference media, epoch choices, plain paths and URLs remain supported.
  Story-root and child lists accept tags or full entity references.
- **Consistent examples.** The worked example has a resolvable style, a declared import batch, explicit
  ambience trim and frame-aligned timings. Provider definitions are identified as outside that example.
- **Plugin contracts.** Validation inputs and response timing are clarified. Code trust is an application
  decision; an official pointer is a creative selection, not permission to execute changed code.
- **Editor handoff.** Final Cut Pro 7 XML is distinguished from FCPXML; relinking and export guarantees
  are limited to supported, tested behavior.

The format identifier remains `"filmopen": 1` during draft development. This is a revised draft, not a
promise that all previous draft projects validate unchanged. To update a 1.0/1.2 project, give its
`pj_<tag>.json` an author and version in the filename and header, update any explicit references to it,
and add an ordered story-root list (an empty list is valid for a blank project). No history records or
migration database are required. Grouped `refs` and fractional frame rates added in 1.2 remain optional.

---

## Contents

1. Introduction
2. Design principles
3. Concepts and terminology
4. Project structure
5. Naming
6. References and resolution
7. Common header
8. The project file
9. Library entities
10. Story structure and script
11. Shots and cues
12. Takes and render batches
13. Versions, official, compare and commentary
14. Extensibility: hooks, plugins, workspaces, shared library, model catalogue
15. Timeline export and round-trip
16. Interchange with existing standards
17. Editing by hand or by machine
18. Conformance
19. Not in this version

Appendix A — Attribute vocabulary
Appendix B — Worked example
Appendix C — MovieLabs OMC correspondence

---

## 1. Introduction

### 1.1 Purpose

Film has mature interchange standards for the script (Fountain, FDX) and for the finish (ASC CDL, LUTs,
OpenTimelineIO, EDL, FCPXML). It has nothing for the structured middle — the description of characters,
places, props, looks and shots that an AI production pipeline needs, and that a collaborative team needs
to share. This specification fills that gap.

### 1.2 Scope

This document defines:

- the folder and file layout of a project;
- the filename grammar that makes every file self-describing;
- the JSON content of each file type, with a small required header and a large optional vocabulary;
- how files refer to one another and how references resolve;
- how versions, forks, official selections and commentary work;
- how rendered and imported media is recorded;
- how the project maps to a timeline for an editing application;
- how the format extends through hooks and plugins;
- how a model catalogue describes the AI models and platforms a film is rendered with;
- how it maps to and from existing standards.

It does not define any application, user interface, storage service, or rendering model. Application
conveniences — caches, indexes, autosave, job queues — never become mandatory project files.

### 1.3 Audiences

- **Filmmakers**, who may use an application or read and edit the files themselves, and must never be
  required to do the latter.
- **Developers**, who should be able to understand the entire format in an afternoon.
- **Automated systems** — scripts, pipelines and AI agents — that read and write projects directly.

### 1.4 Conventions

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY** are to be interpreted as
described in RFC 2119. A **reader** is any software or person consuming a project. A **writer** is any
software or person producing or modifying one.

Requirements define syntax and how a reader interprets data. They cannot stop anyone editing a file.
Authorship and review conventions are human governance, not security features (§2, principle 8).

All examples are illustrative; some omit optional content. Field names in `monospace` are normative;
the values shown are not. Model and platform names in examples do not promise any provider's current
capabilities.

**Times.** Every timestamp in the format — `created`, `updated` (§7), `setAt` (§13.2), `pickedAt` and
an entry's `at` (§13.4), a batch's `created` (§12.2) — is RFC 3339 in **UTC**, with the `Z` designator
and to the second: `2026-09-06T14:20:00Z`. Writers **MUST NOT** write a local offset. Readers accept
any RFC 3339 offset and compare instants, never strings. Clocks on different machines differ; a
timestamp is a note about when something happened, never a rule about precedence (§7).

---

## 2. Design principles

1. **Plain JSON, complete documents.** Every file fully describes one thing. There are no deltas,
   overlays, inheritance, reserved key prefixes, canonical serialisation rules, or content-hash
   addressing of JSON. Any JSON tool works.
2. **One writer per file.** The author's handle is in the filename, and by convention nobody else edits
   that file. This reduces shared-folder conflicts and makes comparison meaningful. A
   delegated edit to someone else's file is still a valid file; a reader warns, and the maintainer
   decides.
3. **Self-describing filenames.** A filename states what a file is, whose it is, and which version.
   Directories organise; they carry no meaning.
4. **Fork is copy.** Versions are whole files: `v1`, `v2`, `v3`. Forking copies a file into your name.
   Files are edited in place; a new version is a deliberate act, not a side effect of saving.
5. **Official is a pointer.** A small `_official.json` file names the version the project has chosen.
   It neither locks that file nor authenticates its author.
6. **Reference within, copy across.** Inside one author's work, files point at each other. Across
   authors, content is copied. Media is always referenced, never duplicated.
7. **Media sits beside the JSON**, named so that any generated file traces back to its source. Imported
   media may keep its own name and is referenced by path.
8. **Warn, don't enforce.** Every file is editable text. Conventions are checked by readers and
   reported; nothing is locked. Whoever gatekeeps a shared repository makes the final call.

**Git is optional.** A project is a folder — on a disk, on a phone, or in a synced Drive or Dropbox
folder. Principles 2 and 3 reduce conflicts; simultaneous edits can still conflict. Git is layered on when a team wants
history or pull requests; **history belongs to Git**, and the format does not duplicate it.

---

## 3. Concepts and terminology

| Term | Meaning |
|---|---|
| **project** | A folder holding a film, series or franchise and its alternatives. An authored `pj_` file at its root describes one complete project version. |
| **author** | A handle naming the writer of a file. A person (`maria`) or a workspace or plugin run within a person's identity (`maria.locale-th`). |
| **owner** | The person behind an author handle: its first segment. |
| **entity** | Anything described by one JSON file: character, location, scene, shot, model, … |
| **library entity** | A reusable thing with an **epoch** axis: character, outfit, location, prop, style, misc, document. |
| **epoch** | How a library entity appears at a point in the story: `30yo`, `pre-war`, `1990s`, `wrecked`. Declared in the project file, at least one; the first is the default epoch. Each epoch of an entity is a separate, complete file that shares the entity's tag. |
| **story unit** | A level of the script: season or installment, episode or act, sequence, scene. |
| **block** | One unit of script inside a scene: a line of dialogue, an action, a title. |
| **shot** | A visual generation spec covering one or more blocks. |
| **cue** | An audio generation spec: dialogue, narration, music, sound effect, ambience. |
| **take** | One rendered or imported output of a shot, cue or library entity. A media file. |
| **render batch** | The record of how a set of takes was produced, imported, or generated by a plugin. |
| **media reference** | A take stem, a project-relative path, or a URL (§6.3). |
| **version** | A whole file, `v1`, `v2`, … The highest is the author's working copy. |
| **official** | The version the project has chosen for an entity, named by a pointer file. |
| **pick** | The version of an entity in use for one author at one epoch, recorded as `pick` in their commentary (`prefer` in 1.5); it comes first in resolution for them, ahead of official. An author's choice, not the project's: that is official. Without a pick an author is on official. |
| **picks** | Inside an entity, which take(s) its author chose. |
| **commentary** | An author's likes, ratings, comments and preferences about an entity. |
| **placement** | Where a shot or cue sits on the timeline: track, anchor, offset, trim. |
| **hook** | A short JavaScript function inside a model, platform, style or project file. |
| **plugin** | A packaged JavaScript extension that transforms, analyses, imports or exports. |
| **workspace** | A derived author handle (`john123.wild`) that keeps a body of work separate from the owner's main versions. Plugin runs are workspaces. A filename convention, nothing more. |

---

## 4. Project structure

### 4.1 The folder

A project folder contains one project tag and one or more `pj_<tag>_<author>_v<n>.json` files at its
root. They are complete alternatives of that project, with an optional `pj_<tag>_official.json` pointer.
Other entity files may be organised in subfolders. External media may be referenced by URL.

Opening an explicit project file selects that version. When opening only a folder, a reader uses the
viewer's own pick for the project entity when they have recorded one (`pick` in their `cm_pj_` file,
§13.4); otherwise the project official pointer if present; otherwise the highest version if there is
exactly one project author handle. If several handles have project files and nothing decides, the
reader asks which one to open (or a command-line caller supplies the filename), rather than guessing.
An invalid official pointer is reported. The selected project supplies contributors, defaults,
language, tracks and story roots for that view or export. Remembering a selection otherwise is an
application preference, not a required film file.

A separate film with another project tag belongs in its own folder. A full entity stem is unique within the project;
readers report duplicates rather than choosing the first file found.

Creative content and decisions live in JSON. Images, audio, video, fonts and LUTs are external files
beside it. Plugin code is JavaScript. None of these is embedded into JSON to make the project "text".

### 4.2 Reserved folders

| Folder | Purpose |
|---|---|
| `render/` | Render batch records, and emitted workflows for offline rendering. |
| `conform/` | Stable-name media slots for the editing application (§15). Generated; may be deleted and regenerated. |
| `_inbox/` | Where people put material awaiting assignment. |
| `plugins/` | Plug-ins that belong to this film, one folder per plug-in (§14.4). A reader reads a plug-in's manifest and code by their names and does not report the folder's other files — its strings, README and assets. |
| `thumbnails/` | Display derivatives of the project's media: one JPEG for each media file whose basename without its extension is unique, `tn_<basename without extension>.jpg`, fitting within 300 × 300 (§6.3). Small enough to live beside the JSON, so a clone browses without the media root. |

All other folder names are free. A reader **MUST NOT** move, rename or delete files it does not
understand; it reports them — but the files of a **reserved** folder are understood by the folder they
are in, so a reader does not report a `render/` batch record, a `thumbnails/` derivative, a `conform/`
slot or a plug-in's locale file under `plugins/` as an unknown file. `_inbox/` is the exception: what a person leaves there is exactly what a reader
**SHOULD** report, since it awaits assignment. Thumbnails live in `thumbnails/` (§6.3); application
caches and indexes may live wherever the application chooses. Neither is ever the only copy of creative
content.

### 4.3 Storage and collaboration

| Where the folder lives | Offline | Collaboration |
|---|---|---|
| Local disk, desktop or phone | yes | no |
| Drive / Dropbox / iCloud with offline sync | yes | yes — shared folder |
| Local folder that syncs to a cloud folder | yes | yes — also the desktop-to-phone path |
| Git repository | yes | yes — with history and review |

Because every file has one writer, a shared sync folder rarely sees a genuine conflict. The only files
with a shared-write role are `_official.json` files, normally written by directors (§8.3). Project
versions themselves follow the same author convention as other entities.

The remaining case is the same author editing the same file on two devices while both are offline. Sync
clients surface this as a sibling file (`… (conflicted copy)`, `… (1)`). A reader **SHOULD** recognise
such a sibling of its author's own file and present the two for comparison (§13.3); it **MUST NOT**
delete either silently.

Large media may live in the folder, in Git LFS, or in external storage reached by URL (§6.3). A clone
holding only LFS pointers does not yet hold the video; a reader shows unavailable media clearly and lets
the user fetch or relink. Keep API keys and machine-specific paths out of committed project data.

### 4.4 The project manifest and the media root

Every other file in a project is named by its author and version, because it is somebody's creative
work. One file is not: the file that says "this folder is a FilmOpen project" and records the settings
that belong to the folder itself. It has a fixed name so that any reader can recognise a project without
scanning, and so that a project folder — which normally carries the film's short name — is identified
by its content and not by its name:

```
filmopen-project.json
```

```json
{
  "filmopen": 1,
  "tag": "cartographer",
  "data": { "type": "local", "path": "../the-cartographer-data" }
}
```

| Field | Required | Meaning |
|---|---|---|
| `filmopen` | yes | The format version, as in every header (§7). |
| `tag` | yes | The project tag. The folder's `pj_<tag>_…` files carry the same tag; a reader reports a disagreement. |
| `data` | no | Where rendered and imported media lives — the **media root**. Absent, the project folder is its own media root. |
| `library` | no | Reserved: a locator for the shared library the project was seeded from (§14.5). Readers ignore it in this version. |
| `note` | no | Free text. |

The manifest is **not** an entity: it has no author, no version and no official pointer. It is
shared-write in the way `_official.json` files are (§4.3) and changes rarely — normally only when the
project is created or its media is moved. It **MUST NOT** hold credentials, API keys or anything
specific to one machine (§4.3); a locator names *where*, never *how to log in*.

**Locators.** `data` is an object, not a path string, because the media may live somewhere that is not
a folder on this machine:

| `type` | `path` means | Reader support in this version |
|---|---|---|
| `local` | a folder path with `/` separators, relative to the project folder (`../the-cartographer-data`, `media`) or absolute | **MUST** support. Relative paths are portable and are what a writer **SHOULD** write; an absolute path is machine-specific and is reported. |
| `dropbox` | a path inside the user's Dropbox | MAY support; otherwise report the media root as unavailable. |
| `google-drive` | the folder's path under *My Drive* (`FilmOpen/the-cartographer-data`) | as above. An application **MUST** ask the user for access to that folder alone and never to the rest of the Drive; the folder's identifier on the service is a per-machine substitute like any other, and the token is never part of the project (§4.3). |
| `onedrive` | a path inside the user's OneDrive | as above |
| `icloud` | a path inside iCloud Drive | as above |
| `url` | a base URL; media references are appended to it | MAY support |

A reader that does not support a locator type **MUST** still open the project: the JSON is complete
without the media, and unavailable media is shown as unavailable (§4.3), never as an error that hides
the film. An application MAY remember a per-machine substitute for a locator it cannot reach; that
memory is an application preference, not part of the project.

**A project without a manifest** is still a project (readers **SHOULD** warn, and continue, treating
the folder as its own media root), so that a folder hand-assembled from files, or one written by a 1.3
writer, opens. A writer that creates a project **MUST** write the manifest.

**Why a separate media root.** The JSON of a whole feature is a few megabytes and diffs cleanly; its
renders are gigabytes and do not. Keeping them apart lets the JSON live in Git while the media lives in
a synced folder, and lets a collaborator clone the film's text without its pictures. The media root is a
plain folder: files in it are named exactly as they would be inside the project folder (§5.4), so
moving media between the two changes nothing but the manifest.

---

## 5. Naming

### 5.1 Case and character set

Filenames are **lowercase ASCII**. macOS and Windows filesystems are case-insensitive by default; `r8Af0`
and `r8af0` are one file there and two files on Linux. Lowercase everywhere removes that class of bug.

### 5.2 Tokens

| Token | Rule | Examples |
|---|---|---|
| `type` | two lowercase letters (§5.3) | `ch` `lo` `sc` |
| `segment` | `[a-z0-9][a-z0-9-]{0,19}` — at most 20 characters; readers **SHOULD** warn above 10 | `main-hero` `cafe` `seedance25` |
| `tag` | one or more segments joined by `.`; a dot expresses containment | `main-hero` `main-hero.suit` `5.1` `e2.1` |
| `epoch` | one segment; reserved `default` | `30yo` `pre-war` `1990s` |
| `author` | `<owner>[.<workspace>]`; each a segment; reserved owner `official` | `john123` `maria.locale-th` `paul.wild` |
| `v<n>` | version, integer ≥ 1 | `v1` `v2` |
| `r<id>` | render batch: `r` + a segment, unique **per author**. Generated ids are lowercase hex digits — four for a render batch, eight where the id carries the time of an import (§12.3); people may name batches | `r8af0` `r68c8a1f0` `rstage0` |
| `<n>` | take number for one source and deliverable within a batch, integer ≥ 1 | `1` `2` |

The 20-character limit applies to every segment. Readers **SHOULD** report filesystem path-length limits
before writing rather than shorten names. Tags are unique **within a type**; the authors, epochs and
versions of one entity deliberately share its tag.

### 5.3 Entity types

| Prefix | Entity | Grammar | Epoch |
|---|---|---|---|
| `pj` | project | spec; versions at the project root | — |
| `ch` | character | library | yes |
| `of` | outfit | library; tag `<character>.<outfit>` | yes |
| `lo` | location | library; sub-areas as `<location>.<area>` | yes |
| `pr` | prop | library | yes |
| `st` | style | library | yes |
| `mi` | misc — fonts, logos, title cards, licensed audio, reference files | library | yes |
| `dc` | document — treatment, series bible, pitch, research | library | yes |
| `mo` | model — a generative or analysis model | spec | — |
| `pl` | platform — where models run | spec | — |
| `pg` | plugin manifest | spec | — |
| `se` | season / installment | spec | — |
| `ep` | episode / act / arc | spec | — |
| `sq` | sequence | spec | — |
| `sc` | scene — contains the blocks | spec | — |
| `sh` | shot; tag `<scene>.<n>` | spec | — |
| `cu` | cue; tag `<unit>.<n>` where unit is a scene, sequence or episode | spec | — |
| `cm` | commentary | `cm_<type>_<tag>_<author>.json` | — |
| `rd` | render batch | `rd_<id>_<author>.json` | — |

### 5.4 Grammars

```
library entity     <type>_<tag>_<epoch>_<author>_v<n>.json
spec entity        <type>_<tag>_<author>_v<n>.json
official pointer   <type>_<tag>[_<epoch>]_official.json
commentary         cm_<type>_<tag>_<author>.json
render batch       rd_<id>_<author>.json
take (output)      <deliverable>_<source stem>_r<id>_<renderer>_<n>.<ext>
```

A parser splits on `_`, reads the first token, and dispatches. A take's filename embeds the **entire
stem of its source file** and the **batch and renderer that produced it**, so a generated file traces to
its origin and to `rd_<id>_<renderer>.json` with no lookup. Imported media may instead keep its own name
and be referenced by path (§6.3).

### 5.5 Deliverable prefixes

| Prefix | Deliverable | From |
|---|---|---|
| `cs` | concept sheet — character, location, prop, outfit, style board | `ch` `lo` `pr` `of` `st` |
| `sb` | storyboard frame — sketch-quality | `sh` |
| `ff` | first frame | `sh` |
| `lf` | last frame | `sh` |
| `kf` | keyframe — an intermediate frame | `sh` |
| `cl` | clip — video, with or without sound | `sh` |
| `vo` | voice — dialogue, narration | `cu` |
| `mu` | music | `cu` |
| `sx` | sound effect | `cu` |
| `am` | ambience, room tone | `cu` |

A prefix names a file's **purpose**, whatever produced it. The *From* column says which entity a
deliverable is normally made for, not who or what made the file: a reference a person supplies by hand — a
picture browsed from disk, a clip fetched from a URL — takes the prefix of what it is for that entity, so a
picture of a library entity is a `cs` take, a clip a `cl` take, an audio reference of a character its voice
sample and so a `vo` take, and any other sound reference an `am` take. An application that names such a
file (§12.3) therefore adds no prefix of its own.

### 5.6 Workspaces and derived handles

An author handle may carry a second segment after a dot: `john123.locale-th`. The owner is the first
segment. Derived handles are used for:

- **Plugin runs.** A plugin invoked by `john123` writes under `john123.<plugin>[-<qualifier>]`, e.g.
  `john123.locale-th`. Everything one run produces starts at `v1`; a second run is `v2`. A run is
  therefore one glob: `*_john123.locale-th_v1.*`. The batch record lists the files (§12.4).
- **Personal workspaces.** `john123.wild` keeps an experiment from inflating the owner's main version
  numbers.

A reader treats a derived handle as a distinct author for versioning and as the owner's for warnings.
Derived handles are not listed in the project file.

### 5.7 Examples

```
pj_cartographer_john123_v1.json           John's project version
pj_cartographer_suda_v1.json              Suda's remake; its own language and story roots
pj_cartographer_official.json            → the chosen project version
ch_main-hero_30yo_john123_v2.json          John's second version of the 30-year-old main hero
ch_main-hero_30yo_maria_v1.json            Maria's fork of it
ch_main-hero_30yo_official.json            → names one of the above
ch_main-hero_50yo_maria_v1.json            a different epoch: a distinct file sharing the tag
of_main-hero.suit_30yo_john123_v1.json     an outfit belonging to main-hero
lo_cafe_1990s_john123_v1.json              the cafe as it looked in the 1990s
lo_cafe.kitchen_1990s_john123_v1.json      a sub-area of the cafe
pr_car_wrecked_susan_v1.json               the car, wrecked
st_war-grade_default_maria_v1.json         a look
dc_bible_default_john123_v3.json           the series bible
mo_seedance25_paul_v3.json                 a model, from the shared library
pl_fal_paul_v1.json                        a platform
pg_locale_paul_v2.json                     a plugin manifest; its code is pg_locale_paul_v2.js beside it
se_s1_john123_v1.json                      season 1
ep_e2_john123_v1.json                      episode 2
sq_e2.arrival_john123_v1.json              a sequence within episode 2
sc_5_john123_v1.json                       scene 5 and its blocks
sc_5_john123.locale-th_v1.json             scene 5 as produced by a localisation plugin John ran
sh_5.1_john123_v1.json                     shot 1 of scene 5
cu_5.1_john123_v1.json                     cue 1 of scene 5
cu_e2.1_maria_v1.json                      a cue spanning episode 2 — score
cm_ch_main-hero_maria.json                 Maria's commentary on main-hero
rd_8af0_maria.json                         Maria's render batch 8af0

cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1.png   concept sheet, take 1, Maria's render of John's v2
ff_sh_5.1_john123_v1_r8af0_maria_2.png              first frame, take 2, of shot 5.1
cl_sh_5.1_john123_v1_r8af0_maria_1.mp4              clip, take 1
vo_cu_5.1_john123_v1_r8af0_maria_1.wav              voice, take 1
ff_sh_5.1_john123_v1_r0001_john123_1.png            a frame John extracted from an existing film
references/kira/front.png                           an imported reference, kept under its own name
```

---

## 6. References and resolution

Entities point at one another constantly. Three forms exist: short references and full references name
entities; media references name files.

### 6.1 Short reference

A tag: `"location": "cafe"`. The field determines the type. Resolved by the reader in three steps.

**Step 1 — Epoch.** Use the explicit epoch on the referencing entry if present; else the enclosing
scene's epoch; else the enclosing unit's; else `default`. An outfit takes its character's resolved epoch
unless one is given. If the epoch was chosen **implicitly** and the entity has no file for it, fall back to
`default` and show that fallback. If the epoch was requested **explicitly** and does not exist, the
reference is unresolved: report it; never substitute a different age or state silently.

**Step 2 — Author.** Depends on the *referencing* file's status:

> A file that is **not** named by an `_official.json` resolves **pick first, then official, then
> author-first**: the referencing file's author's `pick` for the entity at that epoch (§13.4) when it
> names a file — the official version when it is `<versions key>_official`; then, for a derived
> handle, the owner's `pick`; then **official**; then the author's highest version at that epoch;
> then, for a derived handle, the owner's highest.
>
> A file that **is** named by an `_official.json` resolves through **official only**.

In plain words: *your pick wins, then the project's choice, then your own work.* An author who forked
an entity is on their fork, because forking records a pick (§13.1); an author who has said nothing is
on official, and abandoning a pick puts them back there. Where nothing is official the author still
sees their own latest version, so a hand-made fork or a plugin's output is self-consistent the moment
it is written. The pick is how an author says otherwise for one entity: "use John's cafe in my scene",
or "keep my fork although the project chose another". The version step 2 lands on is the version **in
use** for that author at that epoch; there is at most one.

**Step 3 — Fallback.** If nothing is official and exactly one owner has versions of this entity, use that
owner's highest version. Otherwise the reader **MUST** report an unresolved reference rather than guess.

Which `pj` version is in use is §4.1's rule — a pick, else official, else a sole author, else ask: the
project entity has no own-highest step.

Project-root references use the selected `pj` file as the referencing file, with its own author and
official status. Subsequent references use the file containing them. The selected project remains the
context for defaults and contributors; a full reference bypasses lookup.

This is a lookup over the current folder. Changing an official pointer or editing a referenced file
changes what the project uses; readers **SHOULD** show the resulting selections when previewing a
promotion. Historical states come from Git.

### 6.2 Full reference

A file stem: `"scene": "sc_5_john123_v1"`. Exact; no resolution. It names an editable file, not frozen
content.

### 6.3 Media reference

One of:

- a **take stem** — `cl_sh_5.1_john123_v1_r8af0_maria_1` — resolved to the unique file with that
  basename, or to a batch item naming it;
- a **media path** including extension — `references/kira/front.png` — using `/`, relative to the
  project's media root (§4.4: the folder the manifest's `data` names, else the project folder itself),
  never to the referencing file; a `thumbnails/` path is the one exception, below;
- an **external URL** — `https://…` — naming bytes outside the folder. Expiring signed URLs and
  credentials are not locators.

Generated takes carry their source, batch and renderer in the name. Media a person puts in the folder by
hand keeps its own name and is referenced by path; a batch item (§12) may describe it. A plain reference
to a PNG or WAV is sufficient; no registry entry is required. Media an *application* imports on a person's
behalf is named as a take of an import batch instead (§12.3), so that no upload overwrites another.

**Thumbnails.** A reader that shows many references at once needs a small picture it can load without
reaching the media root, which may be a synced folder or a cloud service. One lives in the **project**
folder for each media file whose basename, without its extension, is unique:

```
thumbnails/tn_<basename without extension>.jpg
cs_ch_main-hero_30yo_john123_v2_r68c8a1f0_john123_1.png
  → thumbnails/tn_cs_ch_main-hero_30yo_john123_v2_r68c8a1f0_john123_1.jpg
```

a JPEG fitting within 300 × 300 (§4.2). A `thumbnails/` path is the one media reference that is relative to
the **project** folder rather than to the media root, wherever it appears — in this section or in a batch
item's `thumbnail` (§12.2) — which is what lets a clone without the media root show the film. The flat
name rests on a media file's basename, extension aside, being unique — which the take grammar (§5.4) gives
every generated and every uploaded file, since the batch id and the take number are in the name. A
reference by path or URL whose basename is not unique that way (`kira/front.png` beside
`kira/front.wav`) has no thumbnail of its own. A thumbnail is a display derivative and never a model input by itself (§12.2), and
a reader that finds none shows a placeholder — a missing thumbnail is never an error.

### 6.4 Where each is used

- Project story roots and story-unit child lists accept tags or full references; the list key
  determines the type (`seasons` → `se`, `episodes` → `ep`, `sequences` → `sq`, `scenes` → `sc`).
- Story units, scenes, shots and cues use **short references** to library entities. A scene's `props`
  may be tags or `{ "prop": "car", "epoch": "wrecked" }`; a scene may set `locationEpoch`.
- A shot or cue **MAY** carry a full reference to the scene version its block ids belong to. Absent, it
  means the resolved scene of that tag.
- `forkedFrom`, `pick` and `on` use **full references** or, for `on`, media references.
- `picks`, `refs`, `preview`, `lut`, `file` and deliverable inputs use **media references**.

---

## 7. Common header

Every entity file begins with the same fields. They **repeat the filename** deliberately: the file stays
self-describing if renamed, and a reader can flag disagreement. Project versions use this common header without an epoch. Official pointers, commentary and render
batches use the headers shown in their own sections.

```json
{
  "filmopen": 1,
  "type": "ch",
  "tag": "main-hero",
  "epoch": "30yo",
  "author": "john123",
  "v": 2,
  "name": "Kira Voss",
  "forkedFrom": "ch_main-hero_30yo_john123_v1",
  "created": "2026-09-05T18:04:11Z",
  "updated": "2026-09-06T09:40:00Z"
}
```

| Field | Required | Meaning |
|---|---|---|
| `filmopen` | yes | format version, integer |
| `type` `tag` `author` `v` | yes | as in the filename |
| `epoch` | library entities | as in the filename. A spec entity that carries `epoch` — a scene naming the epoch it is set in (§10.2) — is stating content, not repeating its filename, and a writer must not refuse it. |
| `name` | yes | display name, any language |
| `versionLabel` | no | a short word for this version in version lists — `goth`, `classic` — at most 32 characters; never part of the filename or of any reference |
| `created` `updated` | no | RFC 3339 UTC (§1.4). Informational; never used for precedence |
| `forkedFrom` | no | stem this file was copied from. A note; nothing resolves through it |
| `by` | no | plugin stem, when a plugin produced this version |
| `source` | no | origin of imported material: `{ "batch": "rd_0001_john123" }` |
| `license` | no | SPDX identifier or CC URL for this entity's content, if it differs from the project's |
| `notes` | no | free text for people; excluded from prompts unless a user explicitly includes it |
| `x` | no | an object for application-specific data. Readers preserve it; the format ignores it |
| `plugins` | no | the values plug-ins keep in this version, keyed by plug-in tag: in a project file, a plug-in's project settings; in an entity's file, its `entitySettings` (§14.4). Part of the version — forked, compared and copied like any attribute — and written by an application on a person's behalf, never by a plug-in's code. The format does not interpret what a tag's object holds |

---

## 8. The project file

```json
{
  "filmopen": 1, "type": "pj", "tag": "cartographer", "author": "john123", "v": 1,
  "name": "The Cartographer",
  "kind": "series",
  "genre": ["drama", "mystery"],
  "year": 2026,
  "logline": "A mapmaker discovers her charts are rewriting the coastline.",
  "synopsis": "…",
  "lang": "pt-BR",
  "rating": "12",
  "format": { "aspect": "2.39:1", "fps": 24, "resolution": "1920x804", "color": "rec709" },
  "runtimeMin": 45,
  "credits": [
    { "role": "writer", "name": "João Silva", "handle": "john123" },
    { "role": "director", "name": "João Silva", "handle": "john123" }
  ],
  "epochs": {
    "default":  { "label": "Present day",    "order": 1, "year": 2026 },
    "pre-war":  { "label": "Before the war", "order": 2, "year": 1938 },
    "mid-war":  { "label": "During the war", "order": 3, "year": 1943 },
    "post-war": { "label": "After the war",  "order": 4, "year": 1947 }
  },
  "contributors": {
    "john123": { "name": "João Silva", "role": "director" },
    "maria":   { "name": "Maria Costa" },
    "susan":   { "name": "Susan Park" }
  },
  "tracks": [
    { "id": "pic",  "kind": "av",    "name": "Picture" },
    { "id": "pic2", "kind": "av",    "name": "Picture 2" },
    { "id": "dx",   "kind": "audio", "name": "Dialogue" },
    { "id": "vo",   "kind": "audio", "name": "Narration" },
    { "id": "sfx",  "kind": "audio", "name": "SFX" },
    { "id": "amb",  "kind": "audio", "name": "Ambience" },
    { "id": "mx",   "kind": "audio", "name": "Music" }
  ],
  "seasons": ["s1"],
  "license": "CC-BY-SA-4.0",
  "hooks": { "validate": "(ctx) => ctx.entity.type !== 'sc' || ctx.entity.blocks.length > 0 || 'empty scene'" }
}
```

### 8.1 Kind

`kind` ∈ `short-film` · `film` · `mini-series` · `series` (Short film, Feature film, Mini-series,
Series (ongoing)). It sets the labels of the story levels (§10.1) — a mini-series and a series have
seasons and episodes, a short and a feature have installments and acts — and the story-root list an
application starts a blank project with (`scenes`, `sequences`, `episodes`, `seasons` respectively).
Nothing else depends on it. Readers treat 1.4's `franchise` as `series` and preserve an unknown kind.

### 8.2 Epochs

Every project declares its epochs here, **at least one**, each with a `label`, an `order` and a
`year` (an application asks for the year; a reader tolerates its absence, proposing no ages then). Readers order them by `order` (an entry without one comes first, in the file's order); a writer
that reorders them renumbers `order` from 1. The **first** epoch is the project's **default epoch**:
the one an implicit reference resolves to (§6.1) and the one a new library entity is created at. The
reserved token `default` may be used as an epoch name and is what a new project starts with.

Every library entity has an epoch — there is no "base" file outside the epoch axis. An epoch variant is a
**separate, complete file** that shares the entity's tag and is treated as a distinct entity: nothing
propagates between epochs. A scene names an epoch and every library entity in it resolves to the
matching file (§6.1). Comparing two epochs side by side and copying attributes across (§13.3) is the
intended way to keep them consistent. `year`, when given, is the calendar year the epoch stands for;
readers use it to propose a character's age at that epoch (§9.1). An epoch token appears in filenames,
so an application does not rename one; it adds a new epoch and the author forks files into it.

Readers **SHOULD** warn when a project file declares no epochs.

### 8.3 Contributors and directors

`contributors` lists the people on the project by owner handle. `role: "director"` designates who
normally writes `_official.json` files. More than one director is allowed. Whoever creates a project
is its first director: a writer that creates a project lists the creator with that role (§18.3); how
a director appoints further directors is the project's own business, edited in this file. Handles are names, not
identities: a file can be created under any handle, and a commit's actor and a filename's author are
different information a maintainer can compare. Readers **SHOULD** warn, and continue, when: a file is
modified by someone other than its author; an `_official.json` is written by a non-director; a commit
or sync introduces a file under a handle other than the current user's. The repository maintainer
decides.

### 8.4 Tracks

The timeline tracks the project uses, in order, each with a kind and a display name. Shots are placed on
`av` tracks; cues on `audio` tracks; a `video` track holds picture with no sound. The list above is the
recommended default; a project may rename, reorder, add or remove. Placement (§11.3) refers to tracks by
`id`; the editing application sees `name`. Track *numbers* are an export artefact (§15.1) and appear
nowhere in a project.

### 8.5 Format and story roots

`format` describes the delivery target. `fps` is an integer for integer rates, or
`{ "num": 24000, "den": 1001 }` for fractional rates — never a rounded decimal. `resolution`, `aspect`
and `color` are strings; a project **MAY** add `width`, `height`, `pixelAspect`, colour primaries and
transfer, audio `sampleRate` and `channels`.

The project lists its **story roots** in order with exactly one of `seasons`, `episodes`, `sequences` or
`scenes`, whichever fits its structure. A short film can start with `"scenes": ["1", "2"]` and needs no
season or episode scaffolding. Entries are tags or full references of the indicated type. An empty list is valid while starting from
scratch. Order comes from these lists, not from sorting filenames.

### 8.6 Project alternatives and remakes

A project file is an ordinary spec entity: copy it into your author handle, set `forkedFrom`, and edit
its complete content. For example, `pj_cartographer_suda_v1.json` can name
`pj_cartographer_john123_v1` in `forkedFrom`, change `lang` to `th-TH`, and change its display name,
credits and story roots. The tag remains `cartographer` so these are alternatives of the same project.
No settings are inherited from `forkedFrom`.

Copying a project file neither copies nor translates all its descendants. Existing media references can
be reused. Full references in the copied root list can keep existing story units selected while the
remake is developed; switching those references or using author-first tags selects new story versions
when desired. A project language is a default, not an instruction to translate existing script text.
Users may copy other entities selectively, run a localisation plugin, or fork the Git repository.

---

## 9. Library entities

A library entity is reusable across the story and has an epoch axis. Every one has the common header
and may carry `refs`, `preview`, `picks` and a `prompt` object. The required content is small; Appendix A
lists the recommended optional vocabulary. An entity with no references yet is valid.

### 9.0 References, picks and previews

`refs` holds the media a model is shown when generating this entity. It is either a plain array of image
references, or an object of **named groups**:

```json
{
  "refs": {
    "sheets":      ["cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1"],
    "turnarounds": ["references/kira/turnaround.png"],
    "expressions": ["references/kira/expressions.png"]
  },
  "voice": {
    "description": "low, unhurried, slight rasp",
    "refs": ["references/kira/voice-calm.wav", "references/kira/voice-raised.wav"]
  },
  "preview": "references/kira/front.png"
}
```

Recommended group names — any may be used on any entity, and others may be added: `images` (generic),
`sheets`, `turnarounds`, `expressions`, `poses`, `details`, `materials`, `floorPlans`, `panoramas`,
`lighting`, `motion`, `sound`. Audio samples for a character's voice live in `voice.refs`; an outfit has
no voice. Every group is an array. Each epoch file has its own groups.

**Where a hand-supplied reference goes.** A writer that adds a reference on a person's behalf puts it in
the group its kind names: a picture in the plain array when `refs` is one, else in `images`; a clip in
`motion`; an audio file in `sound`, and on a character in `voice.refs`, where a character's audio
reference belongs. A plain array becomes `{ "images": [ … ] }` the first time a reference of another
kind arrives. Such a write adds only: it removes no reference and repeats none already present.

`preview` names the media shown for this entity in a library view. Absent, a reader may use the first
sheet or image, then an image pick, then a placeholder. A preview is not automatically a model input. A
writer **MAY** set `preview` to the first image it adds when the file has none, and **MUST NOT** change a
`preview` the author has set.

`picks` selects generated takes by deliverable; a value is one media reference or an array when several
frames are chosen. A reference used in several files reuses the bytes and nothing else.

### 9.1 Character `ch`

```json
{
  "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo", "author": "john123", "v": 2,
  "name": "Kira Voss",
  "kind": "principal",
  "aliases": ["KIRA", "the cartographer"],
  "summary": "A cartographer who discovers her maps are rewriting the coastline.",
  "appearance": {
    "age": 30, "gender": "woman", "build": "lean, athletic", "skin": "olive",
    "hair": { "color": "black", "length": "shoulder", "style": "loose, centre-parted" },
    "eyes": { "color": "dark brown", "notes": "heavy lids" },
    "marks": ["burn scar along the left forearm"],
    "posture": "upright, still; moves only when necessary"
  },
  "personality": {
    "summary": "Guarded, precise, allergic to being managed.",
    "traits": ["methodical", "dry humour", "conflict-avoidant until cornered"],
    "wants": "To prove the coastline is moving.",
    "speech": "Short sentences. Rarely finishes a question."
  },
  "voice": { "description": "low, unhurried, slight rasp", "pitch": "low", "pace": "slow", "accent": "Lisbon", "lang": "pt-BR",
             "refs": ["references/kira/voice-calm.wav"] },
  "relationships": [{ "character": "spouse", "relation": "married to, separating" }],
  "prompt": {
    "positive": "30yo woman, olive skin, black shoulder-length hair, lean athletic build, burn scar left forearm, upright posture",
    "negative": "cartoon, plastic skin, over-smoothed"
  },
  "creatorNotes": "Never smiles with teeth. Keep the scar visible in any shot showing the left arm.",
  "picks": { "sheet": "cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1" },
  "refs": { "sheets": ["cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1"] },
  "preview": "cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1"
}
```

- `kind` ∈ `principal` · `supporting` · `extra` · `group` · `narrator` · `creature` · `animal`. A `group`
  is a crowd described once.
- `birthdate` — optional: a year (integer) or an ISO calendar date (`YYYY-MM-DD`), the same in every
  epoch file of the character (it is part of each complete file, not inherited). With the epoch's
  `year` (§8.2) a reader proposes the apparent age `epoch.year − birth year` (year precision); an
  integer `appearance.age` overrides it — a character born in 1950 is 50 at an epoch set in 2000
  unless the file says 30 — and removing the override restores the proposal. The age is derived, not
  stored a second time: changing an epoch's year cannot leave a stale computed age. An impossible
  date (`1950-02-30`) is refused, not rounded.
- `aliases` — every name a script or transcript might use. Essential for import and for Fountain export.
- `appearance`, `personality`, `voice` — **open objects**. Readers display whatever keys are present.
  Appendix A.1 recommends a vocabulary; none of it is required.
- `creatorNotes` — for people; excluded from prompts unless a user explicitly includes it.

### 9.2 Outfit `of`

```json
{
  "filmopen": 1, "type": "of", "tag": "main-hero.suit", "epoch": "30yo", "author": "john123", "v": 1,
  "name": "Charcoal business suit",
  "garments": [
    { "item": "suit jacket", "color": "charcoal", "material": "wool", "fit": "tailored", "condition": "worn at the cuffs" },
    { "item": "shirt", "color": "white", "notes": "open collar, no tie" },
    { "item": "boots", "color": "brown", "material": "leather", "condition": "scuffed" }
  ],
  "accessories": ["steel wristwatch, left wrist"],
  "prompt": { "positive": "charcoal two-button suit, white open-collar shirt, worn brown leather boots, steel wristwatch" },
  "picks": { "sheet": "cs_of_main-hero.suit_30yo_john123_v1_r7c21_john123_1" }
}
```

### 9.3 Location `lo`

```json
{
  "filmopen": 1, "type": "lo", "tag": "cafe", "epoch": "1990s", "author": "john123", "v": 1,
  "name": "Café Atlântico",
  "aliases": ["CAFE", "the café"],
  "kind": "interior",
  "geography": { "city": "Lisbon", "country": "PT" },
  "description": "Tiled floor, ceiling fans, a long zinc bar, harbour visible through steamed windows.",
  "dressing": ["zinc bar", "six marble tables", "espresso machine, chrome", "framed harbour photographs"],
  "lighting": { "default": "late afternoon, warm, low sun through the windows", "practicals": ["pendant lamps over the bar"] },
  "sound": { "roomTone": "tiled, lively reverb", "ambience": "espresso machine, harbour gulls, distant traffic" },
  "areas": ["cafe.bar", "cafe.kitchen"],
  "prompt": { "positive": "1990s Lisbon café interior, tiled floor, zinc bar, ceiling fans, steamed windows, harbour beyond" },
  "picks": { "sheet": "cs_lo_cafe_1990s_john123_v1_r7c21_john123_2" }
}
```

`kind` ∈ `interior` · `exterior` · `both`. Sub-areas are locations with tag `<parent>.<area>` and their
own epoch files.

`within` — optional: the tag of another location this one lies inside (`"within": "harbour"` on a
pier). Informational only: a reader may show it, but it does not make the location a sub-area, does not
change its tag, and names no epoch or version. A tag no location has is kept and may be reported.

### 9.4 Prop `pr`

```json
{
  "filmopen": 1, "type": "pr", "tag": "chart", "epoch": "default", "author": "john123", "v": 1,
  "name": "The 1994 harbour chart",
  "kind": "document",
  "hero": true,
  "description": "Hand-drawn nautical chart on yellowed linen-backed paper, folded twice, ink faded to sepia.",
  "scale": "60 × 90 cm",
  "condition": "creased, one corner water-stained",
  "prompt": { "positive": "hand-drawn nautical chart, yellowed linen paper, sepia ink, fold creases, water stain" },
  "picks": { "sheet": "cs_pr_chart_default_john123_v1_r7c21_john123_4" }
}
```

`hero: true` marks a prop the camera will see closely; it needs a stronger reference than background
dressing.

### 9.5 Style `st`

```json
{
  "filmopen": 1, "type": "st", "tag": "war-grade", "epoch": "default", "author": "maria", "v": 1,
  "name": "War — gritty, desaturated",
  "description": "Episode 2 onward. Cold, grey, high contrast, grain.",
  "genre": "drama",
  "references": ["1970s political thrillers", "hand-processed 16mm"],
  "look": { "stock": "16mm colour negative", "grain": "medium", "halation": "slight", "contrast": "high", "saturation": "low" },
  "palette": ["#2b2f33", "#6b7076", "#b9bcb8", "#d9c9a3"],
  "prompt": { "positive": "desaturated, cold grey palette, high contrast, 16mm grain, handheld",
              "negative": "saturated, clean, glossy" },
  "cdl": { "slope": [0.95, 0.98, 1.05], "offset": [-0.02, -0.02, 0.0], "power": [1.1, 1.1, 1.05], "saturation": 0.6 },
  "lut": "style/war-grade/war-grade.cube",
  "refs": { "images": ["cs_st_war-grade_default_maria_v1_r8af0_maria_1"] }
}
```

`cdl` records ASC CDL values; `lut` is a media reference to a `.cube` file. Both record colour intent
and export with the timeline; whether an editing application applies them depends on its importer, and
an exporter reports what it could not carry (§15.3).

### 9.6 Misc `mi` and Document `dc`

```json
{ "filmopen": 1, "type": "mi", "tag": "title-font", "epoch": "default", "author": "john123", "v": 1,
  "name": "Title font", "kind": "font", "file": "misc/atlantico-bold.otf" }
```

```json
{ "filmopen": 1, "type": "dc", "tag": "treatment", "epoch": "default", "author": "john123", "v": 2,
  "name": "Treatment", "kind": "treatment",
  "text": "Kira Voss draws maps for a living and discovers that her maps are redrawing the coast…",
  "file": "docs/treatment-2026-08.docx" }
```

`mi.kind` ∈ `font` · `logo` · `title-card` · `audio` · `image` · `other`. `dc.kind` ∈ `treatment` · `bible`
· `pitch` · `beat-sheet` · `research` · `context` · `other`. For a document, `text` is the editable
FilmOpen content and survives a JSON-only checkout; `file` is an imported source or export. Either may be
present alone.

---

## 10. Story structure and script

### 10.1 Story units `se` `ep` `sq` `sc`

| Level | Series | Film / franchise | File |
|---|---|---|---|
| 1 | season | installment | `se_` |
| 2 | episode | act / arc | `ep_` |
| 3 | sequence *(optional)* | sequence *(optional)* | `sq_` |
| 4 | scene | scene | `sc_` |

Levels 1–3 are optional groupings. Each declares epoch, cast, locations and styles as **defaults for its
children**, and an ordered list of those children. A scene narrows or overrides what it inherits from
its unit; nothing is inherited between library files.

```json
{
  "filmopen": 1, "type": "ep", "tag": "e2", "author": "john123", "v": 1,
  "name": "Episode 2 — Low Tide",
  "synopsis": "Kira finds the first altered chart.",
  "epoch": "mid-war",
  "cast": [
    { "character": "main-hero", "epoch": "30yo", "outfit": "main-hero.suit" },
    { "character": "spouse", "epoch": "28yo" }
  ],
  "locations": ["cafe", "archive"],
  "styles": ["war-grade"],
  "scenes": ["3", "4", "5", "archive-exit"],
  "notes": "Cold open, no score until the reveal."
}
```

`scenes` (or `sequences`, or `episodes` on a season) fixes the order of children. If absent, a reader
**MAY** propose natural (numeric-aware) tag order and **MUST** say so; a reproducible timeline export
needs an explicit list. Cyclic or duplicate containment is reported.

### 10.2 Scene `sc`

A scene is one time and one place. Its file holds the **blocks** — the script — in order.

```json
{
  "filmopen": 1, "type": "sc", "tag": "5", "author": "john123", "v": 1,
  "name": "The archive",
  "location": "archive", "epoch": "mid-war",
  "storyDay": 3, "time": "night", "weather": "rain against the skylight",
  "cast": [{ "character": "main-hero", "epoch": "30yo", "outfit": "main-hero.suit" }],
  "props": [{ "prop": "chart", "epoch": "default" }],
  "style": "war-grade",
  "synopsis": "Kira compares the two charts and realises the coastline moved.",
  "purpose": "First proof. Turns the mystery from doubt to certainty.",
  "targetDurationSec": 165,
  "shots": ["5.1", "5.2"],
  "cues": ["5.1", "5.2", "5.3"],
  "blocks": [
    { "id": "bl_1", "kind": "action",
      "text": "Kira spreads both charts across the reading table." },
    { "id": "bl_2", "kind": "dialogue", "character": "main-hero",
      "text": "The bay was here last spring.",
      "direction": "flat disbelief, does not look up" },
    { "id": "bl_3", "kind": "action",
      "text": "Behind her, the window flashes white. A second later, the glass goes." },
    { "id": "bl_4", "kind": "dialogue", "character": "main-hero", "text": "Not now.", "offscreen": true },
    { "id": "bl_5", "kind": "transition", "text": "CUT TO:" },
    { "id": "bl_6", "kind": "note", "text": "Consider cutting bl_2 if pacing drags." }
  ]
}
```

`storyDay` is the script supervisor's continuity day. `purpose` states what the scene does for the
story, which is the single most useful field for an AI reading the project. `shots` and `cues` fix the
order of the scene's shots and cues; absent, natural tag order applies. `locationEpoch` overrides the
scene epoch for the location alone.

### 10.3 Blocks

| Field | Meaning |
|---|---|
| `id` | `bl_<n>`; stable for the life of the block in this file. **Never renumbered.** |
| `kind` | `dialogue` · `action` · `narration` · `transition` · `title` · `lyric` · `note` |
| `text` | the line, the action, the title text |
| `character` | short reference; dialogue, narration and lyric |
| `direction` | performance note — the screenplay parenthetical |
| `offscreen` `voiceover` | booleans — Fountain's `(O.S.)` and `(V.O.)` |
| `dual` | `true` when spoken simultaneously with the previous dialogue block |
| `lang` | BCP 47 override for this block |
| `startMs` `endMs` | observed timing, typically from import |

Rules: new blocks take the next unused number; order is array order; moving a block to another scene
copies it there with a new id; `note` blocks never render. Because ids are stable, two authors' versions
of a scene align by id with no diff algorithm (§13.3). Two forks that independently invent the same
id are not the same line; a reader shows the text, and the Git base when available, rather than
assuming.

### 10.4 Fountain correspondence

| Fountain | FilmOpen |
|---|---|
| Scene Heading `INT. CAFE – NIGHT` | scene `location` (+ `kind`), `time` |
| Action | block `action` |
| Character + Dialogue | block `dialogue`, `character` via `aliases` |
| Parenthetical | `direction` |
| `(O.S.)` `(V.O.)` | `offscreen` `voiceover` |
| Dual dialogue `^` | `dual` |
| Transition | block `transition` |
| Centered text | block `title` |
| Lyrics `~` | block `lyric` |
| Note `[[ ]]` | block `note` |
| Section `#` | story units |
| Synopsis `=` | `synopsis` |

The screenplay *content* round-trips. Title-page fields, emphasis, forced elements, scene numbers, page
breaks and boneyards are not represented; an importer or exporter reports them, and a `dc` may keep the
original text. Shot and sound information, which Fountain cannot express, lives in shots and cues.

---

## 11. Shots and cues

### 11.1 Shot `sh`

A visual generation spec covering one or more blocks, with its placement on the timeline.

```json
{
  "filmopen": 1, "type": "sh", "tag": "5.2", "author": "john123", "v": 1,
  "name": "Kira reacts; the window goes",
  "scene": "sc_5_john123_v1",
  "blocks": ["bl_3", "bl_4"],
  "characters": ["main-hero"],
  "size": "mcu", "angle": "low", "movement": "static",
  "lens": { "focalMm": 50, "aperture": 2.0, "dof": "shallow" },
  "lighting": { "key": { "direction": "side", "quality": "hard" }, "style": "low-key", "colorTempK": 3200,
                "practicals": ["desk lamp"], "notes": "window flash as a single hard white hit from behind" },
  "composition": { "headroom": "tight", "eyeline": "down-left", "screenDirection": "facing right" },
  "durationSec": 5,
  "continuity": ["chart still unfolded on the table", "scar visible, left forearm"],
  "vfx": "glass shatter, practical-looking, no debris toward lens",
  "deliverables": {
    "firstFrame": { "model": "nanobanana", "prompt": "…", "refs": ["cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1"] },
    "clip":       { "model": "seedance25", "prompt": "…", "from": "firstFrame",
                    "inputs": ["vo_cu_5.3_john123_v1_r8af0_maria_1"] }
  },
  "place": { "track": "pic", "after": "sh_5.1", "offsetMs": 0, "inMs": 0, "outMs": 5000 },
  "picks": { "firstFrame": "ff_sh_5.2_john123_v1_r8af0_maria_1",
             "clip":       "cl_sh_5.2_john123_v1_r8af0_maria_1" }
}
```

`size`, `angle`, `movement`, `lens`, `lighting` and `composition` use the vocabulary in Appendix A.4; all
are optional. `scene` is a full reference to the scene version the block ids belong to (§6.4). In a
deliverable, `from` names a preceding deliverable of the same shot and `inputs` names other media it
depends on — a chosen dialogue take for lip sync, for instance; the batch records what was actually
used. A still image placed as a shot takes its hold duration from `durationSec`.

### 11.2 Cue `cu`

An audio generation spec. A cue attaches to a scene, or to a sequence or episode when it spans scenes.

```json
{
  "filmopen": 1, "type": "cu", "tag": "5.1", "author": "john123", "v": 1,
  "name": "Kira — the bay line",
  "kind": "dialogue",
  "scene": "sc_5_john123_v1",
  "blocks": ["bl_2"],
  "character": "main-hero",
  "spoken": "The bay was here… last spring.",
  "delivery": { "effort": "quiet", "emotion": "flat disbelief", "processing": "none" },
  "model": "elevenlabs",
  "place": { "track": "dx", "with": "sh_5.1", "offsetMs": 400, "gainDb": -3 },
  "picks": { "voice": "vo_cu_5.1_john123_v1_r8af0_maria_1" }
}
```

```json
{
  "filmopen": 1, "type": "cu", "tag": "e2.1", "author": "maria", "v": 1,
  "name": "Low Tide — main theme",
  "kind": "music",
  "unit": "ep_e2_john123_v1",
  "music": { "tempoBpm": 72, "key": "D minor", "instrumentation": ["cello", "prepared piano", "tape hiss"],
             "mood": "unease held under restraint", "structure": "sparse intro, swell at the reveal, cut on the flash" },
  "sync": [{ "with": "sh_5.2", "offsetMs": 0, "event": "cut on the flash" }],
  "anchors": [{ "scene": "sc_5_john123_v1", "blocks": ["bl_3"] }],
  "model": "suno",
  "place": { "track": "mx", "with": "scene:3", "offsetMs": 0, "fadeInMs": 2000, "fadeOutMs": 4000, "gainDb": -12 },
  "picks": { "music": "mu_cu_e2.1_maria_v1_r91c0_maria_2" }
}
```

- `kind` ∈ `dialogue` · `narration` · `music` · `sfx` · `ambience`.
- **Text comes from the referenced blocks**, concatenated in order. **`spoken`, if present, replaces
  it** — for pauses, pronunciation, numbers spelled out, a translated line. Readers surface "spoken
  differs from script" as an intentional state, and warn when the block has changed since.
- `ssml` (W3C SSML) is an alternative to `spoken` for models that accept it; use one or the other.
- A cue attached to a unit that needs specific blocks from specific scenes uses `anchors`, since block
  ids are local to a scene.

### 11.3 Placement

`place` states where a shot or cue sits on the timeline. Every field is optional; a scene with no
placement at all is a straight sequential cut on the first `av` track, in the scene's `shots` order.

| Field | Meaning | Default |
|---|---|---|
| `track` | track `id` from the project (§8.4) | first `av` track for shots; `dx` for dialogue, `vo` narration, `sfx`, `amb`, `mx` music |
| `after` | anchor: start at this item's **end** plus `offsetMs`. A shot tag, or `prev` | `prev` for shots |
| `with` | anchor: start at this item's **start** plus `offsetMs`. A shot tag, `scene`, or `scene:<tag>` | for cues, the first shot covering the cue's first block |
| `offsetMs` | signed milliseconds from the anchor | `0` |
| `inMs` `outMs` | trim within the source take, from its first frame; `outMs` exclusive | whole take |
| `audio` | `false` to place picture only from an `av` clip | `true` |
| `gainDb` `pan` | mix | `0`, `0` |
| `fadeInMs` `fadeOutMs` | audio fades | `0` |
| `transitionIn` | `{ "type": "cut" \| "dissolve" \| "fade", "ms": n }` | cut |

Rules:

- `after` and `with` are the only anchors, and a placement uses **one** of them. `prev` is the previous
  shot in the scene's order, not the previous file on disk. Anchor cycles, missing anchors and negative
  starts are reported.
- **Two items on one track cannot overlap.** A negative `offsetMs` after a picture cut on the same
  track is a collision and is reported. Overlaps go on another track: a second picture track for an
  overlay, or — the common case — the dialogue track for a **J-cut**, where the next line begins before
  the picture cuts: `"with": "sh_5.2", "offsetMs": -1500` on the cue.
- A `dissolve` or `fade` needs **source handles**: media beyond the nominal trims on both sides. The
  exporter checks the picked takes and reports when handles are short; it never shortens the cut.
- Changing a duration ripples downstream through the `after` chain, as a rough assembly should.
- Timings are numbers in milliseconds. An exporter converts to the project frame rate and reports
  any rounding it applies. Equal boundaries must round identically; ties round toward the later frame.
  Source trims must also respect the source media rate and available range.

An observation at 12:04.625 in an imported film belongs in the batch's source timing (`at`).
A placement anchored to `scene` uses an offset from that scene's start, not the source film's start.
The first shot defaults to the scene start when `prev` has no predecessor. Scenes begin sequentially
in the selected story order; a scene's length is the latest end of its placed shots and scene cues.
Unit-level cues do not lengthen individual scenes. Cross-scene anchor cycles are reported.

---

## 12. Takes and render batches

### 12.1 Takes are discovered, never recorded in the entity

A take is a media file whose name embeds its source stem (§5.4), or an imported file named in a batch.
**No entity file lists its takes.** A reader finds them by scanning the media root (§4.4) — and the
project folder itself, so that a project without a manifest keeps working — and by reading batches; the
batch says how they were made. An entity's author writes no list of takes: only `picks`, and the
references of §9.0 — `refs` and `preview` — which say what a model is shown or what a library view shows,
not what exists. This is what lets one person render another's shot without touching their file, and lets
a character page show every sheet anyone has rendered for it.

### 12.2 Render batch `rd`

```json
{
  "filmopen": 1, "type": "rd", "id": "8af0", "author": "maria",
  "kind": "render", "tier": "final",
  "created": "2026-09-06T15:30:00Z", "status": "done",
  "items": [
    { "n": 1, "source": "sh_5.2_john123_v1", "deliverable": "clip",
      "model": "seedance25", "platform": "fal",
      "prompt": "…the fully resolved prompt as sent…",
      "params": { "seed": 41221, "steps": 30, "durationSec": 5, "fps": 24 },
      "inputs": ["ff_sh_5.2_john123_v1_r8af0_maria_1", "vo_cu_5.3_john123_v1_r8af0_maria_1"],
      "output": "s1/e2/sc5/cl_sh_5.2_john123_v1_r8af0_maria_1.mp4",
      "sha256": "9d02…", "durationMs": 5000, "elapsedMs": 61400, "costUsd": 0.42,
      "thumbnail": "thumbnails/tn_cl_sh_5.2_john123_v1_r8af0_maria_1.jpg",
      "human": { "selectedFrom": 4, "promptEditedBy": "maria" } }
  ]
}
```

| Field | Meaning |
|---|---|
| `created` | when the batch was made: RFC 3339 UTC (§1.4) |
| `kind` | `render` · `import` · `plugin` · `manual` |
| `tier` | `preview` · `final` — cheap fast previews versus locked finals |
| `output` | media reference — usually a project-relative path |
| `take` | take number in a generated filename when it is not `1` |
| `sha256` | recorded on ingest. Names carry meaning; hashes carry identity; together they survive renames, moves and duplicates |
| `durationMs` / `elapsedMs` | length of the output media / time the job took |
| `costUsd` | absent when unknown, never zero |
| `human` | the human contribution: candidates reviewed, who edited the prompt, manual edits. The authorship evidence (§16.5) |
| `status` `jobId` `attempts` `error` | job notes for a pending, failed or partial batch; a batch may be updated in place |
| `thumbnail` `poster` `proxy` `waveform` | display derivatives; never model inputs by themselves. A thumbnail is the one §6.3 names, in the project folder's `thumbnails/`, and its path is relative to that folder, not to the media root; the field records it and does not choose a second place for it |
| `mimeType` `bytes` `width` `height` `fps` `frameCount` `sampleRate` `channels` | measured media properties; measured on ingest if absent, never invented |

### 12.3 Import batches — describing a film that exists

`kind: "import"` records material taken from an existing work. Its takes are named like any other; the
renderer is the **importing author**, so the take always finds its batch.

```json
{
  "filmopen": 1, "type": "rd", "id": "0001", "author": "john123",
  "kind": "import",
  "source": { "file": "the-cartographer-2019.mp4", "sha256": "e1a4…", "fps": 24, "durationMs": 5412000 },
  "created": "2026-09-06T09:00:00Z", "status": "done",
  "items": [
    { "n": 1, "source": "sh_5.2_john123_v1", "deliverable": "firstFrame",
      "at": { "ms": 724625 }, "output": "s1/e2/sc5/ff_sh_5.2_john123_v1_r0001_john123_1.png", "sha256": "77b0…" },
    { "n": 2, "source": "cu_5.1_john123_v1", "deliverable": "voice",
      "at": { "startMs": 724625, "endMs": 727200 }, "output": "s1/e2/sc5/vo_cu_5.1_john123_v1_r0001_john123_1.wav", "sha256": "31cd…" },
    { "n": 3, "source": "ch_main-hero_30yo_john123_v1", "deliverable": "baseImage",
      "output": "references/kira/front.png", "width": 2048, "height": 2048 }
  ]
}
```

Reverse-engineering a film produces ordinary FilmOpen files: blocks from a transcript with timing, shots
from detected cuts with `place`, characters with `aliases` from speaker labels and `appearance` from
observed frames, takes extracted at timecodes. Each such entity carries `"source": { "batch": … }`. An
import item for a file a person put in the folder under its own name, as in item 3, simply names it.

**An application's upload is an import batch.** When a person hands an application a file — browsing it
from disk, pasting a URL — the application names it as a take of an import batch under the grammar of
§5.4: the importing person is the batch's author and the take's renderer, the entity version the upload was
made from is the item's `source`, and the purpose is the deliverable (§5.5). Its id is **eight lowercase
hex digits of the second the import began** (§5.2), made unique the way every batch id is made unique — by
checking it against the author's own batches and taking the next free one, so that two imports in the
same second do not share a batch stem. The guarantee that no upload overwrites another is the write
itself: a take that exists is never replaced (§18.3), so an importer that meets one — two people importing
into one media root in the same second, a clock set back — takes the next id and writes again. The
original name is kept in the item's `originalName` — the batch's `source.file` names the one work a whole
import came from, which an upload of a single reference has none of — and is never used as the file name,
so no upload displaces another, and a reference an author later drops from `refs` stays on disk as a take of
that entity. `sha256`, `bytes`, `mimeType` and an image's `width` and `height` are measured on ingest (§12.2). A batch record that cannot be written does not invalidate the
files: a take is found by its name (§12.1).

### 12.4 Plugin batches

`kind: "plugin"` records a plugin run: the plugin stem, the settings used, and the files produced under
the run's derived handle (§14.3).

### 12.5 Offline rendering

A batch may be **emitted instead of submitted**: `render/rd_<id>_<author>/` holds one workflow file per
item — for ComfyUI, a workflow JSON, labelled as UI graph or API payload — each already named for the
output it should produce. The workflows run anywhere; the outputs are dropped into the project; a reader
matches them by name and records hashes.

### 12.6 Ingest

On every scan a reader **SHOULD**: parse every filename; attach takes to sources; record `sha256` and
measured properties for new outputs in their batch; flag outputs whose hash no longer matches their
record; and report unknown files without moving them. On a network timeout a reader checks an existing
provider job before submitting another paid request, and keeps completed items when one fails. A reader
**MUST NOT** assume it is the only writer.

---

## 13. Versions, official, compare and commentary

### 13.1 Versions

A version is a whole file. All are readable; the highest is the author's working copy. Files are edited
in place and nothing is frozen; a filmmaker may edit `sc_5_john123_v1.json` for months. **Fork** on your
own version creates `v(n+1)` as a copy; fork on someone else's creates *your* `v1` (or next) with
`forkedFrom` set. The copy is identical apart from `author`, `v`, `forkedFrom` and fresh `created` /
`updated`, and without a version label: creative content, unknown fields and media references remain,
while `versionLabel` (or the 1.5 `label`) is left out, since a label names the version it was written on. A
forked project file additionally lists its new author among `contributors`, with no role (§8.3). An
application that forks also records the new version as the author's pick (`pick` and `pickedAt`,
§13.4) — a fork is made to be used — writing the entity first and the commentary second, so a failed
second write still leaves a usable fork. Prior states of a file are Git's business.

### 13.2 Official

```json
{ "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo",
  "official": "ch_main-hero_30yo_maria_v1",
  "setBy": "john123", "setAt": "2026-09-06T14:20:00Z", "note": "Maria's. Using hers." }
```

Written by a director. Applies to every versioned type. Everything downstream reads through official
unless the viewer has a pick of their own (§6.1). Editing a version that official names changes
what the whole project sees; readers **SHOULD** say so and offer to fork instead, and then allow it.
A project with no chosen version for an entity simply has no pointer file: to withdraw a choice, a
director deletes the pointer; an application that offers official as a toggle removes the file when
the toggle is cleared and writes it, with `setBy` and `setAt`, when it is set. `setAt` is required of
an application writing a pointer and is RFC 3339 UTC (§1.4); a pointer written by hand may omit it,
and a reader then simply does not know when the choice was made. A director who makes a version
official normally means to use it, and no pick is needed to say so (§6.1): an application **removes**
any pick of the director's own at that epoch, so the star alone marks what they use. Where removing
would not land on official — a derived handle whose owner has a pick of their own there — it writes
the tracking value `<versions key>_official` instead. Other authors' picks are theirs and do not move.

An author whose `pickedAt` is earlier than the pointer's `setAt` picked before the project chose. A
reader **MAY** show that pick as needing attention and offer to abandon it (§13.4) or to keep it,
re-dating it; it **MUST NOT** change what resolves (§7: no timestamp decides).

### 13.3 Compare and copy-left

The core collaborative act, and the only merge operation. **Two versions are shown side by side**: the
viewer's own working version on the left, and one other on the right — official, the version the viewer
has marked `pick`, another author's, or a plugin's or sync client's copy. The others are reached by
selecting them; there is no third column.

Copy-left runs down the split: beside each attribute, for each section of the presentation, and for
the whole entity.
Copying a nested object copies the subtree. A viewer with no version of their own is offered one —
copy-left is fork when needed — and the fork is of the version on screen, so the comparison they asked
for is the comparison they get. Copying is not confirmed; the re-rendered result is the check.

Comparing two **epochs** of one entity, or an entity with a plugin's or a sync client's copy, is the
same comparison with a different version on the right; a reader chooses what it offers.

**Copy-left adds and overwrites. It does not remove.** A key the other version does not have is left
alone, and so is one it holds as nothing — `null`, an empty object or list, a blank string — because an
empty value is how a key is deleted, and a copy that emptied the reader's own value would be a removal
wearing a copy's name. Where the two versions disagree about the *shape* of a key — one an object, the
other a list or a sentence — copy-left offers nothing rather than choose.

**What never moves**: the fields the filename owns — `filmopen`, `type`, `tag`, `author`, `v`, and
`epoch` **where the filename carries one** (a scene's `epoch` is content, §10.2, and copies like any
other attribute) — together with `created`, `updated`, `forkedFrom`, and the version label under
either spelling (`versionLabel` and the 1.5 `label`). A reader that draws the file's own metadata — `notes`, `by`, `source`, `license`,
`x` — apart from the entity's attributes should not offer those either: a remark an author wrote about
their own version is not true of somebody else's.

**Scenes compare by block id.**

| Case | Shown as | Copy-left does |
|---|---|---|
| same id, same text | collapsed: *6 unchanged* | — |
| same id, different text | side by side, changed words marked | replace mine |
| id only in theirs | a gap in my column at their position | insert it |
| id only in mine | greyed: *not in theirs* | delete mine |

"Not in theirs" does not prove they deleted it; when a Git base is available a reader can tell an
addition from a deletion.

**Deleting is the row's own control.** *Delete mine* belongs to the `<` on that block and to nothing
else: a control for a whole section or a whole entity adds and overwrites, so that one press can never
take away every line only the viewer has written. A block with no id, or an id that names two blocks
in one file, cannot be addressed by any of the four cases and offers no copy at all. A scene whose
`blocks` holds the ids a cue writes (§10.3) has no script to compare: `blocks` is then an ordinary
value on both sides and no block moves either way.

### 13.4 Commentary `cm`

One file per author per entity, covering all its epochs, versions and takes.

```json
{
  "filmopen": 1, "type": "cm", "target": "ch_main-hero", "author": "maria",
  "pick": { "30yo": "ch_main-hero_30yo_susan_v1" },
  "pickedAt": { "30yo": "2026-09-06T12:41:00Z" },
  "entries": [
    { "on": "ch_main-hero_30yo_john123_v2", "at": "2026-09-06T10:02:00Z", "rating": 1,
      "text": "I really like the tattoo." },
    { "on": "cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1", "at": "2026-09-06T11:15:00Z", "rating": 1 },
    { "on": "ch_main-hero_30yo_susan_v1", "at": "2026-09-06T12:40:00Z", "rating": -1,
      "text": "Too young for the mid-war scenes.", "block": "bl_2" }
  ]
}
```

`on` is a version stem or a media reference. `at` is RFC 3339 UTC (§1.4). `rating` is `1`, `-1`, or
absent. An entry may name a `block`, a `field` or a `gitCommit` for context.

`pick` is the author's **pick**: the version of the entity in use for them, ahead of official (§6.1
step 2). It is a full stem, or — because one commentary file covers every epoch of an entity and a
pick is made per epoch — an object of stems keyed by epoch:

```json
"pick": { "30yo": "ch_main-hero_30yo_susan_v1", "50yo": "ch_main-hero_50yo_official" }
```

A single stem applies at the epoch it names and nowhere else, so older files read unchanged; a writer
folds it into the object the first time it writes a pick for an entity with epochs. An entity without
epochs (a project file, a story unit, a shot, a cue, a model) uses the plain stem. In the object, each
key is the epoch of the stem under it; an entry filed under another epoch is reported and ignored. The value
`<versions key>_official` — the stem of the pointer file — means "the official version, whichever it
is", so a pick can follow the star rather than pin a version; an application need not write it, since
an author with no pick is already on official.

`prefer` is the 1.5 spelling of `pick`. A reader accepts it and treats it as `pick`; where a file
carries both, `pick` wins; a writer that rewrites the file writes `pick` and drops `prefer`.

`pickedAt` says when the pick was made, in the same shape as `pick` — a timestamp, or an object under
the same epoch keys — in RFC 3339 UTC (§1.4). A writer stamps it whenever it writes a pick and removes
it with the pick it belongs to. A pick without a time is valid: a reader then cannot tell whether it
predates an official choice.

**Abandoning.** Removing an author's pick at an epoch returns that author to official (§6.1) — or, for
a derived handle whose owner has a pick at that epoch, an application writes the tracking value
instead, which comes to the same thing (§13.2). That is the only reason to remove a pick: an application moves a pick rather than clearing it, and offers
removal as *abandon my pick and follow official*. For every entity and epoch that has versions,
exactly one version is in use whenever anything decides (a pick, official, the author's own version, a
sole author). An application shows an author's own pick with a check beside the official star; a
version in use because it is official, with nothing picked, needs no check — the star already says so —
while a version in use because it is the author's own latest, or the sole author's, keeps the check,
since no star says it.
Changing a pick rewrites only the author's own commentary file; a viewer without one gets an empty one
with `pick` and `pickedAt` set. A `pick` that names no file is reported and ignored (§18.2). Readers consolidate every `cm_` file for an entity into one feed. Review
can equally happen in pull requests or conversation; commentary is not required.

---

## 14. Extensibility

### 14.1 Language

Hooks and plugins are **JavaScript, ECMAScript 2020, single file, no `import`/`require`.** Functions
may be `async`. Code receives one argument, `ctx`, and returns a value; it never mutates project state.
Hooks and plugins are data until an application chooses to run them; plain readers never execute code.

### 14.2 Sandbox

Code runs with `JSON`, `Math`, `String`, `Number`, `Array`, `Object`, `RegExp`, `Map`, `Set`, `Promise`
and nothing else: no filesystem, no network, no clock, no randomness, no timers. That list is the API
surface, not the security boundary: an application **MUST** isolate untrusted code — runtime, memory and
output limits, no ambient filesystem or shell, no network except the services in §14.4 — and must protect
its credentials, which never enter project JSON or plugin output. The application decides which code
the user trusts to run and re-evaluates that trust when the code changes. An **official** pointer alone
does not grant execution permission. Trust decisions belong to the application, not to the film files.

### 14.3 Hooks

Short functions inside `mo`, `pl`, `st` and `pj` files, keyed by name. They are one way to extend a
model or a platform; an application may instead call the **platform hooks** of plug-ins (§14.4), which
live in a plug-in's code rather than in the film's files, and FilmOpen does: it runs no inline hook.

| Hook | Runs | Receives | Returns |
|---|---|---|---|
| `validate` | before save or render | `{ entity, project, params? }`; resolved generation parameters when rendering | `true` or an error string |
| `buildPrompt` | assembling a prompt | `{ shot \| cue \| entity, cast, location, style, project }` | string, or `{ positive, negative, refs, params }` |
| `buildRequest` | submitting to a platform | `{ model, platform, prompt, inputs, params }` | `{ url, body, headers? }` |
| `parseResponse` | platform replies | raw response | `{ output, durationMs?, elapsedMs?, cost? }` |
| `estimateCost` | before a batch | `{ model, platform, params }` | number, USD, or `null` for unknown |
| `postProcess` | after ingest | `{ item, take }` | modified item |

Prompt precedence: an explicit prompt on the deliverable; else the model's `buildPrompt`; else a simple
documented default. Builders include selected descriptions and references, never every note in a file.
Parameters a provider does not support are reported, not silently dropped.

```json
{
  "filmopen": 1, "type": "mo", "tag": "seedance25", "author": "paul", "v": 3,
  "name": "Seedance 2.5", "vendor": "ByteDance", "kind": "video",
  "capabilities": ["text2video", "image2video"],
  "inputs": { "prompt": "string", "image": "file?", "durationSec": "int 3..15", "seed": "int?" },
  "defaults": { "durationSec": 5, "fps": 24 },
  "platforms": ["fal", "runninghub"],
  "hooks": {
    "buildPrompt": "(ctx) => [ctx.shot.prompt, ctx.style && ctx.style.prompt.positive, ctx.cast.map(c => c.prompt.positive).join(', ')].filter(Boolean).join('. ')",
    "validate":    "(ctx) => !ctx.params || ctx.params.durationSec == null || ctx.params.durationSec <= 15 || 'Seedance 2.5 clips are 15 s max'"
  }
}
```

```json
{
  "filmopen": 1, "type": "pl", "tag": "fal", "author": "paul", "v": 1,
  "name": "fal.ai", "kind": "remote", "baseUrl": "https://fal.run",
  "auth": { "kind": "apiKey", "keychain": "filmopen/fal" },
  "models": { "seedance25": "fal-ai/bytedance/seedance/v2.5" },
  "hooks": {
    "buildRequest":  "(ctx) => ({ url: ctx.platform.baseUrl + '/' + ctx.platform.models[ctx.model.tag], body: { prompt: ctx.prompt, image_url: ctx.inputs.image, duration: ctx.params.durationSec, seed: ctx.params.seed } })",
    "parseResponse": "(res) => ({ output: res.video.url })",
    "estimateCost":  "(ctx) => 0.07 * ctx.params.durationSec"
  }
}
```

`mo.kind` ∈ `text` · `image` · `video` · `audio` · `music` · `tts` · `analysis`. Analysis capabilities include
`shot-detect`, `transcribe`, `diarize`, `face-cluster`, `describe-frame`, `describe-video`. Response parsers set `durationMs` only from the output media duration. Inference or request runtime
belongs in `elapsedMs`, converted from the provider's documented units; otherwise omit it.
Secrets never
appear in a project; `auth.keychain` names the credentials the application holds (§14.9).

### 14.4 Plugins

A plugin is a folder, `plugins/<tag>/`, in the shared library (§14.5) or in a project (§4.2). It holds
the manifest, a code file named after it, and its strings:

| File | Required | What |
|---|---|---|
| `pg_<tag>_<author>_v<n>.json` | yes | the manifest: a versioned spec entity, forked, picked and made official like any other |
| `pg_<tag>_<author>_v<n>.js` | yes | the code (§14.1), named in `entry` |
| `l10n/<locale>.arb` | `en` at least | the plugin's strings, below |
| `README.md` | for a shared plugin | what it does, what it needs, how to change it |
| `platforms/<id>.json` | when it brings a platform | a platform file (§14.9) for an id the catalogue does not define |
| `assets/` | | text the code reads, such as prompt templates |

A fork of a manifest and its code sits in the same folder (`pg_locale_maria_v1.*`) and is resolved like
any fork: official, then the viewer's pick (§6.1).

```json
{
  "filmopen": 1, "type": "pg", "tag": "locale", "author": "paul", "v": 2,
  "name": "Localiser", "api": 1,
  "description": "Translates dialogue and relocates settings to a target culture.",
  "entry": "pg_locale_paul_v2.js",
  "applies": ["sc", "cu", "lo"],
  "hooks": ["transform"],
  "capabilities": { "ai": true },
  "settings": { "target": { "type": "string", "default": "th-TH" }, "relocate": { "type": "boolean", "default": true } }
}
```

| Field | Required | Meaning |
|---|---|---|
| `api` | yes | the host interface version the plugin was written against; a host refuses one it does not support, naming both |
| `entry` | no | the code file beside the manifest; `<stem>.js` when absent |
| `description` | no | one sentence; a string key when the plugin's strings have it |
| `l10n` | no | the folder of locale files; `l10n` when absent |
| `applies`, `hooks` | no | the entity types the plugin works on, and the entity hooks below it implements |
| `capabilities` | no | `ai`: the plugin uses `ctx.ai.complete`; `network`: host names it may reach **without** credentials |
| `keys` | no | the keys the plugin **owns**, `{ "<slot>": { "platform": "<id>", "label"?, "help"? } }`. A key's id is `<tag>:<slot>`; `platform` names the platform file that says how the key is entered, checked and sent (§14.9) |
| `uses` | no | ids of keys the plugin asks to use: another plugin's (`locale:openrouter`) or the application's own, whose owner an application names (FilmOpen: `app`) |
| `provides` | no | `{ "platforms": { "<id>": ["complete", …] } }`: the platform hooks below, per platform |
| `settings` | no | the plugin's options, `{ "<key>": { "type", "default"?, "label"?, "help"?, "scope"? } }`; `type` is `string`, `text`, `number` (`min`, `max`), `boolean`, `enum` (`values`) or `model` (a catalogue entry of `category`, optionally on one `platform`, §14.6). A setting whose `scope` is `project` (the default) is kept in the project file under `plugins.<tag>` (§7); `machine` keeps it on one computer, outside the project |
| `entitySettings` | no | per entity type named in `applies`, fields of the same vocabulary kept in that entity's own file under `plugins.<tag>` — a character's version can carry other notes for a plugin than its sibling |
| `actions` | no | `{ "<id>": { "label", "call" } }`: commands an application offers on the plugin's own page; `call` names a function of the code |

`label` and `help` values, and `name` and `description` where the strings define them, are keys of the
plugin's locale files, which an application renders in its reader's language: `l10n/<locale>.arb`, JSON
objects of strings in the ARB shape, `@@locale` naming the file's locale, `{name}` placeholders. A key
does not contain `:`, which marks a namespace — an application's own strings are reached as
`<namespace>:<key>` (FilmOpen: `app:`), and a lookup falls back to `en`, then to the key itself.

**Entity hooks** — called on the entities the user selected:

| Hook | Purpose | Receives | Returns |
|---|---|---|---|
| `transform` | rewrite entities — polish, translate, restyle, relocate | `{ entities, project, settings, ai? }` | the modified entities |
| `analyze` | comment without changing — continuity, pacing, consistency | same | commentary entries |
| `import` | turn a foreign file into FilmOpen entities | `{ file, project, settings, ai? }` | entities and an optional batch |
| `export` | turn entities into a foreign format | `{ entities, project, settings }` | `{ filename, content }` |

**Platform hooks** — what a plugin provides for a platform, called by an application's own features
(text, images, video, sound) through the plugin the user prefers for that platform. `model` is a catalogue
entry's `id` (§14.7):

| Hook | Receives | Returns |
|---|---|---|
| `complete` | `{ model, messages, params }` | `{ text, usage?, cost? }` |
| `render` | `{ model, prompt, inputs, params }`, `inputs` as addresses the platform can fetch | `{ outputs: [{ url, mime, durationMs? }], usage?, cost? }`; the application downloads the outputs as takes (§12.4) |
| `estimateCost` | `{ model, params }` | a number, USD, or `null` |
| `verifyKey` | `{ key }`, a candidate key's id usable for that one call | `{ accepted, message? }`, for a platform whose key check its file cannot declare in `verify` |

A hook, a setting type or a field a host does not know is ignored and reported, and the plugin's other
hooks still run; a hook's shape only gains optional fields, and `api` changes when one changes
incompatibly.

Rules:
- A plugin has read access to the whole project and operates on the entities the user selected.
- A plugin **never writes files.** It returns entities; the application writes them as **new versions
  under the running user's derived handle** — `john123.locale-th` — all starting at `v1`, and records a
  `kind: "plugin"` batch. A second run is `v2`. If the source files changed while the run was in
  progress, the application shows that rather than overwriting.
- Plugin output is **never merged into the owner's own versions.** Accepting it is pointing official at
  it, entity by entity or as a whole run; taking parts is copy-left; hand-fixing it is forking it.
- **A plugin never sees a credential.** Its code names a key by id; the application sends the request
  to that key's platform — over `https`, to the platform file's `hosts`, following no redirect elsewhere —
  and adds the credential where the platform file says (§14.9). A plugin uses the keys it owns; another's,
  only when the user has granted it. Hosts in `capabilities.network` are reached without any credential.
- **A plugin may bring a platform file** for an id the catalogue does not define; one for an id the
  catalogue defines is ignored, since a platform's definition is shared by every entry that names it.
- `capabilities.ai` grants `await ctx.ai.complete(messages, options)` → `{ text, usage?, cost? }`, routed
  through the user's preferred text platform and key; where the host supports vision, also
  `ctx.ai.describe(media, prompt, options)`. The application owns paid-call consent, cancellation and
  retries within the user's configured limits.
- Trust remains the application's (§14.2): a manifest declares what the plugin asks for, so that an
  application can show it before the code first runs and again when the code changes.

A **localisation** plugin is the canonical example: fork the repository for a new territory, run the
plugin, point every `_official.json` at the run. The original is untouched in the same tree. An
**import** plugin with `ai: true` is the reverse-engineering tool of §12.3.

### 14.5 The shared library

Models, platforms, plugins and optionally styles live in a public repository the format maintainer
controls, using exactly the conventions above: versions, authors, `_official.json`, commentary. *Share*
on a forked entry is a pull request; the maintainer merges and, once tested, moves `_official.json`. No
central service is needed to use a locally installed entry.

The library is installed **beside** projects, not inside them: one copy per machine (or per user), in a
folder the application manages and can update on its own schedule — a `git pull`, a download — without
touching any project and without a new build of the application. A project therefore need not contain
`mo_`, `pl_` or `pg_` files at all; a reader resolves references to models, platforms and plugins
against the project first and then against the library. A project **MAY** hold its own — a fork of a
library entry made inside the project as one would fork a character, or a private model — and those
take part in resolution exactly like any other entity of the project. The same full stem present in both
the project and the library is reported as a duplicate; the project's file is used. Where the library
folder lives is an application preference (§4.2: application caches and indexes live wherever the
application chooses); a project's manifest may later name the library it was seeded from (§4.4,
`library`, reserved).

### 14.6 The model catalogue

A rendering application has to know which AI models exist, what each one accepts, what it costs, and
which platform and key reach it. A **model catalogue** says so in plain JSON: one file per model per
category, beside an index. This section defines its format so that applications, the shared library and
scripts can all read one; where a catalogue lives is the application's choice, and FilmOpen keeps its own
in `assets/models/`.

The catalogue is **application data, not project data**. No project refers to it, its files follow
neither the naming grammar (§5) nor the common header (§7), and a reader of projects ignores it. It is
where a library entry comes from: an entry's `model` becomes a `mo` file's `tag` and its `kind` that
file's `kind` (§14.3); an access row's `platform` and `model_id` become a `pl` file's `tag` and a value of
its `models`; and a platform's `auth.keychain` is the `pl` file's `auth.keychain`.

**No catalogue file holds a secret:** a platform file says how a key is created, sent and checked, never the key
(§14.2). **Nothing is guessed:** an entry lists the pages its values came from and the day they were
read; a value found only on a secondary source is named in `unverified`, and a value nobody publishes is
left out, with the gap said in `notes`.

| File | Holds |
|---|---|
| `models.json` | The index: the categories with their models, and the platforms with their files. |
| `<tag>-<model>.json` | One model in one category (§14.7, §14.8). |
| `platforms/<id>.json` | One platform: where requests go, and how a key is created, sent and checked (§14.9). |

A model offered in several categories is one file per category — `t2v-kling-30.json` and
`i2v-kling-30.json` — because each mode has its own endpoint, inputs and price. A newer version of a
model is a new file (`i2v-kling-31.json`), never an edit that changes what an existing name meant.

`<model>` is the model's **short name**. It **MUST** follow the `segment` rule of §5.2
(`[a-z0-9][a-z0-9-]{0,19}`), so that it can become a library `tag` unchanged, and it is the same in every
category the model appears in. A version is written after a hyphen and without its dot: `kling-30` for
Kling 3.0, `veo-31`, `gpt-image-25`.

**Categories.** Twelve tags, in the order a film is made:

| Tag | Category | Input → output | `kind` |
|---|---|---|---|
| `stt` | Transcription | speech → text | `analysis` |
| `write` | Writing | instructions and context → prose, a script | `text` |
| `llm` | LLM logic | instructions and text → JSON that validates against a schema | `text` |
| `t2i` | Text to image | prompt → image | `image` |
| `i2i` | Image to image | reference images and a prompt → image | `image` |
| `tts` | Voice | text → speech | `tts` |
| `ttm` | Music | a description and lyrics → music | `music` |
| `t2v` | Text to video | prompt → video | `video` |
| `i2v` | First frame | first frame and prompt → video that opens on it | `video` |
| `ia2v` | First frame + audio | first frame, a supplied audio clip and prompt → video synchronised to the clip | `video` |
| `flf2v` | First + last frame | first frame, last frame and prompt → video between them | `video` |
| `flfa2v` | First + last frame + audio | first frame, last frame, a supplied audio clip and prompt → video | `video` |

The tags follow the field's shorthand: STT and TTS for speech, TTM for text-to-music (T2M usually means
text-to-motion), T2I, I2I, T2V and I2V for pictures, and FLF2V for first-and-last-frame video. The `a`
marks an **audio input**: the audio categories hold models that take a sound file the application
supplies, such as the dialogue take a shot's deliverable names in `inputs` for lip sync (§11.1). A model
that only generates its own soundtrack is not one of them; that is `audio_output` in its `t2v`, `i2v` and
`flf2v` entries (§14.8). An entry's `kind` **MUST** be its tag's.

**The index.** `models.json` holds the categories and the platforms' files:

```json
{
  "checked": "2026-09-14",
  "categories": {
    "i2v": {
      "name": "First frame",
      "kind": "video",
      "description": "A video clip that opens on a given first frame.",
      "models": [
        { "file": "i2v-kling-30.json", "description": "Kling 3.0 animates a first frame into a 3–15 s shot…" }
      ]
    }
  },
  "platforms": {
    "fal": { "file": "platforms/fal.json", "name": "fal.ai", "kind": "remote" },
    "kling": {
      "file": "platforms/kling.json",
      "name": "Kling AI API",
      "kind": "remote",
      "status": "pending",
      "obstacles": ["Its API is sold in prepaid packages from USD 700 (5,000 units, valid 180 days)…"]
    }
  }
}
```

| Key | Type | Meaning |
|---|---|---|
| `checked` | string | `YYYY-MM-DD` on which the index was last rebuilt. |
| `categories` | object | Every tag of the table above, each `{ "name", "kind", "description", "models" }`. |
| `categories.<tag>.models` | array | `{ "file", "description" }` per entry, the recommended first. `description` is the entry's own, copied unchanged. |
| `platforms` | object | Every platform an entry's `access` names, keyed by its id, each `{ "file", "name", "kind" }` (§14.9), with `status` and `obstacles` when it is pending. |
| `platforms.<id>.status` | string | `pending` when an application built on the catalogue does not support the platform yet; left out when it does. |
| `platforms.<id>.obstacles` | array | With `pending`, and only then: one sentence for each thing that stands in the way of supporting the platform. |

JSON does not order an object's keys, so the order of the categories is this section's table, not the
index. A reader **MUST** report a listed file that is missing, an entry file that no category lists, and a
platform file that `platforms` does not list.

**Pending platforms.** A pending platform is still part of the catalogue: its file, its access rows and
their prices stay valid, and a reader reads them as it reads any other. An application **SHOULD NOT**
offer a key or a run on a pending platform; an entry's other access rows still apply.

### 14.7 Model entries

Every `<tag>-<model>.json` is one object. Writers **SHOULD** write its fields in this order; a field that
does not apply is left out, and a reader **MUST** ignore a field it does not know.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | string | yes | The filename without `.json`: `<tag>-<model>`. |
| `tag` | string | yes | One of the twelve tags (§14.6). |
| `model` | string | yes | The short name (§14.6). |
| `name` | string | yes | The vendor's name for the model. |
| `vendor` | string | yes | Who makes it; a lab inside a company in brackets, as `Alibaba (Qwen)`. |
| `kind` | string | yes | The tag's `kind`. |
| `description` | string | yes | One sentence of at most about 160 characters: what the model is, and why a filmmaker would pick it. |
| `released` | string | | `YYYY-MM-DD`, or `YYYY-MM`, of public availability. |
| `status` | string | yes | `ga`, `preview`, `beta`, `experimental` or `deprecated`. |
| `license` | string | yes | `proprietary`, or the open-weights licence, by its SPDX identifier where it has one. |
| `open_weights` | boolean | yes | Whether the weights can be downloaded and run on the user's machine. |
| `links` | object | | Whichever exist of `homepage`, `docs`, `pricing`, `weights`, `languages`. |
| `variants` | array | | Tiers or sizes of the model (below). |
| `access` | array | yes | The ways to reach the model, the recommended first (below); empty when none is public. |
| `local` | object | | How to run the model on the user's machine (below). |
| `capabilities` | object | yes | What the model accepts and produces (§14.8). |
| `notes` | array | | What a user or a developer must know: limits, sources that disagree, terms, how a request is made. |
| `unverified` | array | | Paths of values not confirmed on a primary source: `capabilities.fps`, `access[3].pricing`, `variants[].keeps_up_on`. |
| `sources` | array | yes | Every page a value came from. |
| `checked` | string | yes | `YYYY-MM-DD` on which the sources were read. |

**Variants.** Tiers or sizes of one model are variants of one entry, not files of their own:

```json
"variants": [
  { "id": "standard", "name": "Veo 3.1", "tier": "final" },
  { "id": "lite", "name": "Veo 3.1 Lite", "tier": "preview", "supported_resolutions": ["720p", "1080p"] }
]
```

`id` is unique in the file, and it is what an access row names. `tier` is `final` for finished work or
`preview` for cheaper, faster drafts. A key of `capabilities` inside a variant replaces that key for the
variant, whole: a variant's `inputs` replaces all of `inputs`. Any other key describes the variant:
`parameters_m` (the parameter count in millions), `weights_file`, `size_mb`, `memory_mb`, `keeps_up_on`
(the hardware that keeps up with it).

**Access.** One row for each way to reach the model:

```json
{
  "platform": "fal",
  "variant": "h3",
  "model_id": "minimax/h3/image-to-video",
  "endpoint": "https://queue.fal.run/minimax/h3/image-to-video",
  "params": { "prompt": "prompt", "first_frame": "image_url", "duration": "duration", "resolution": "resolution" },
  "pricing": [ { "usd": 0.06, "per": "second", "when": "768p, with sound" } ]
}
```

| Key | Meaning |
|---|---|
| `platform` | A key of `platforms` in the index (§14.9). |
| `variant` | The `id` of the variant the row serves, when the entry has variants. |
| `model_id` | What the platform calls the model; for `comfyui` and `huggingface`, the weight file or the repository. |
| `endpoint` | The URL a request goes to, where the platform has one per model. |
| `params` | The platform's field for each input and setting (below). |
| `pricing` | What a run costs on that platform (below). |

A reader offering a run takes the first row whose platform the user holds a key for, or needs none.

**Parameter names.** `params` maps the catalogue's name for an input or a setting to the platform's field:
a field name; a dotted path in the request body (`generationConfig.imageConfig.aspectRatio`); a path with
a selector where the body is a list of parts (`content[role=first_frame].image_url.url`); or, for ComfyUI,
`Node.input`. The catalogue's names are the same in every entry:

| Used by | Names |
|---|---|
| Every category | `model` (the field naming the model), `variant` (the field choosing a variant), `prompt`, `seed`, `language`, `output_format` |
| Pictures and video | `negative_prompt`, `first_frame`, `last_frame`, `reference_images`, `mask`, `audio`, `duration`, `resolution`, `width`, `height`, `aspect_ratio`, `fps`, `generate_audio`, `camera_control`, `multi_shot`, `num_images`, `quality`, `background`, `steps`, `guidance`, `prompt_expansion` |
| Voice and music | `text`, `voice`, `stability`, `timestamps`, `lyrics`, `instrumental`, `composition_plan`, `duration`, `bpm`, `key`, `time_signature`, `task`, `reference_audio`, `source_audio` |
| Transcription | `session_type`, `audio_format`, `sample_rate`, `partial_results`, `punctuation`, `smart_format`, `filler_words`, `custom_vocabulary`, `turn_detection`, `utterance_end`, `vad_events`, `delay`, `noise_reduction`, `training_opt_out` |
| Language models | `instructions`, `input`, `max_output_tokens`, `reasoning`, `structured_output`, `tools`, `stream` |

A setting with no name here keeps the platform's own, in snake_case: `person_generation`,
`resize_mode`, `storage_uri`, `input_fidelity`, `moderation`.

**Prices.** A row is `{ "usd", "per", "when" }`: the price the platform publishes, in US dollars, for one
unit; `when` says when the row applies — a resolution, audio on or off, a quality, a date. A discount is
said in `when` or `notes`, and a run on the user's own machine has no row, or a row of zero.

| `per` | One unit is |
|---|---|
| `second` | a second of generated output |
| `minute` | a minute of audio |
| `image`, `video`, `request` | one image, one video, one request |
| `1k_characters` | a thousand characters of text |
| `1m_input_tokens`, `1m_output_tokens` | a million tokens in or out; a video model billed by tokens uses `1m_output_tokens` |
| `1m_cached_input_tokens`, `1m_audio_input_tokens` | a million input tokens read from a cache, or of audio |
| `megapixel` | a megapixel of output |
| `credit` | one of the platform's credits |

**Local.** An entry whose weights can run on the user's machine says how:

```json
"local": {
  "runtimes": ["comfyui"],
  "comfyui": { "support": "native", "custom_nodes": [], "template": "Z-Image-Turbo: Text to Image" },
  "min_vram_gb": 8,
  "recommended_vram_gb": 16,
  "system_ram_gb": 16,
  "gated": false,
  "weights": [
    { "name": "z_image_turbo_int8_convrot.safetensors", "url": "https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/diffusion_models/z_image_turbo_int8_convrot.safetensors", "precision": "int8", "size_gb": 6.2 }
  ],
  "speed": "8 steps; about 2.3 s for a 1024x1024 image on an RTX 4090."
}
```

| Key | Meaning |
|---|---|
| `runtimes` | What runs the model: `comfyui`, `python`, `gradio`, `whisper.cpp`, or a serving engine such as `vllm-omni`; how to start each is in `notes`. |
| `comfyui` | `support`, `native` or `custom_nodes`; `custom_nodes`, one `{ "name", "repository" }` per node pack; `template`, ComfyUI's workflow template. |
| `min_vram_gb`, `recommended_vram_gb`, `system_ram_gb` | Memory, where published. |
| `gated` | The weights need a licence accepted on Hugging Face, and a token (`huggingface`, §14.9). |
| `weights` | One `{ "name", "url", "precision", "size_gb" }` per file to download. |
| `speed` | A timing on a named GPU. |

**Conventions.** Every entry writes its values the same way:

- A yes-or-no key is a boolean, and a condition goes in `notes`: Eleven Music's `commercial_use` is `true`,
  and its notes say that film rights need an Enterprise plan.
- A unit is part of a key's name — `_s`, `_ms`, `_mb`, `_gb`, `_px`, `_hz`, `_tokens` — and a count or a
  size is a number.
- Resolutions are written `480p` to `2160p`, `2K`, `4K` or `WIDTHxHEIGHT`; aspect ratios `W:H`; languages
  as ISO 639-1 codes. A platform's own spelling of a value, such as MiniMax's `768P`, stays in `notes`.
- Dates are `YYYY-MM-DD`, or `YYYY-MM` where the day is not published.
- Files are UTF-8 with LF line endings.

### 14.8 Capabilities

`capabilities` says what the model accepts and produces in its entry's category. The keys below are the
catalogue's vocabulary. A key that does not apply is left out; a key not listed here **MAY** be added, and
a reader that does not know it **MUST** ignore it.

**Inputs.** Image and video entries describe each input the mode accepts as `{ "required": true }` or
`{ "required": false }`, with its limits:

| Input | Limits |
|---|---|
| `prompt`, `negative_prompt` | `max_characters`, `max_tokens`, `languages` |
| `first_frame`, `last_frame`, `reference_images`, `mask` | `min` and `max` (how many images), `formats`, `max_mb`, `min_px`, `max_px`, `resolutions`, `aspect_ratios`, `aspect_ratio_range` (`[min, max]` of width ÷ height), `sets_aspect_ratio` (the output takes this image's shape), `fit` (`pad`, `crop`), `reference_types` |
| `audio` | `formats`, `max_mb`, `min_s`, `max_s`, `max_clips`, `max_total_s`, `kept_as_soundtrack`, `lip_sync`, `languages`, `use` |
| `seed` | `min`, `max` |

A video entry **MUST** mark as required the inputs its tag names: `prompt` in `t2v`; `first_frame` in
`i2v`; `first_frame` and `audio` in `ia2v`; `first_frame` and `last_frame` in `flf2v`; and `first_frame`,
`last_frame` and `audio` in `flfa2v`.

**Transcription** (`stt`)

| Key | Type | Meaning |
|---|---|---|
| `modes` | array | `realtime` (text while the user speaks), `file` |
| `transports` | array | `websocket`, `webrtc`, `http` |
| `input_audio_formats` | array | As the vendor names them |
| `supported_languages`, `language_count` | array, number | |
| `partial_results` | boolean | Text arrives before a turn ends |
| `word_timestamps`, `diarization` | boolean | |
| `punctuation` | string | `always`, `optional` or `none` |
| `filler_words` | string | `removed`, `optional` or `kept` |
| `custom_vocabulary` | boolean | Terms or a prompt can steer recognition |
| `turn_detection` | array | The vendor's end-of-turn modes |
| `max_session_minutes`, `max_file_mb` | number | |
| `data_retention` | string | What the provider keeps, in a sentence |

**Writing and logic** (`write`, `llm`)

| Key | Type | Meaning |
|---|---|---|
| `context_window_tokens`, `max_output_tokens` | number | |
| `input_modalities`, `output_modalities` | array | `text`, `image`, `audio`, `video`, `pdf` |
| `structured_output` | object | `{ "json_schema", "parameter" }`: whether output can be held to a JSON Schema, and the request field that does it |
| `reasoning` | object | `{ "supported", "parameter", "levels" }` |
| `tool_use`, `streaming`, `batch`, `prompt_caching` | boolean | |
| `knowledge_cutoff` | string | `YYYY-MM` or `YYYY-MM-DD` |
| `supported_languages`, `language_count` | array, number | |

**Images** (`t2i`, `i2i`)

| Key | Type | Meaning |
|---|---|---|
| `inputs` | object | `prompt`, `negative_prompt`, `reference_images`, `mask`, `seed` |
| `supported_resolutions`, `max_resolution` | array, string | `WIDTHxHEIGHT`, or the vendor's size labels (`1K`, `2K`, `4K`) |
| `supported_aspect_ratios` | array | |
| `output_formats` | array | `png`, `jpeg`, `webp` |
| `max_images_per_request` | number | |
| `quality_levels` | array | The vendor's quality settings |
| `transparent_background` | boolean | |
| `edit_operations` | array | In `i2i`, what an edit can do |
| `strengths` | array | Short phrases |
| `watermark` | string | Such as `SynthID` |

**Voice** (`tts`)

| Key | Type | Meaning |
|---|---|---|
| `supported_languages`, `language_count` | array, number | |
| `voice_cloning` | object | `{ "instant", "professional", "min_sample_s" }` |
| `voice_design` | boolean | A voice made from a description |
| `emotion_control` | string | How delivery is directed: inline tags, a style note |
| `multi_speaker` | boolean | One request voices several speakers |
| `streaming`, `timestamps` | boolean | |
| `max_characters_per_request`, `latency_ms` | number | |
| `output_formats`, `sample_rates_hz` | array | |
| `commercial_use` | boolean | |

**Music** (`ttm`)

| Key | Type | Meaning |
|---|---|---|
| `min_length_s`, `max_length_s` | number | |
| `vocals`, `lyrics_input`, `instrumental`, `reference_audio`, `stems` | boolean | |
| `supported_languages` | array | |
| `structure_control` | array | How the structure is set: `composition_plan`, `section_durations`, `bpm`, `key`… |
| `edit_operations` | array | `extend`, `inpaint`, `cover`, `repaint`… |
| `output_formats` | array | |
| `sample_rate_hz` | number | |
| `commercial_use` | boolean | |

**Video** (`t2v`, `i2v`, `ia2v`, `flf2v`, `flfa2v`)

| Key | Type | Meaning |
|---|---|---|
| `inputs` | object | `prompt`, `negative_prompt`, `first_frame`, `last_frame`, `reference_images`, `audio`, `seed` |
| `supported_durations_s` | array | Every allowed length, in whole seconds |
| `max_length_s` | number | The longest clip |
| `supported_resolutions` | array | `480p` to `2160p`, `2K`, `4K` |
| `supported_aspect_ratios` | array | `W:H`, or `adaptive`: the output follows an input frame or the model chooses, and `inputs.first_frame.sets_aspect_ratio` says which |
| `fps` | array | Frame rates |
| `audio_output` | object | `{ "generates", "optional", "dialogue", "lip_sync", "languages" }`: whether the model makes its own soundtrack, whether that can be switched off, whether it speaks lines, whether mouths match them, and in which languages |
| `multi_shot` | boolean | Several shots in one generation |
| `camera_control` | array | `prompt` (moves described in words), `presets` (named moves, listed in `camera_presets`), `trajectory` (a keyframed camera path) |
| `camera_presets` | array | The named moves |
| `output_format` | string | `mp4` |

### 14.9 Platforms

Each platform is one file, `platforms/<id>.json`, that says where requests go and how a key is created,
sent and checked; `platforms` in the index lists the files. Access rows name a platform by its id; an id
is lower case, it is the file's name, and a new platform takes a new one. FilmOpen's catalogue uses
`openai`, `anthropic`, `google` (the Gemini API), `vertex`, `elevenlabs`, `deepgram`, `kling`,
`byteplus`, `minimax`, `ltx`, `openrouter`, `fal`, `replicate`, `comfyui` and `huggingface`. FilmOpen's
first version supports `openrouter`, `fal` and `openai`, and the index marks the others pending (§14.6).

```json
{
  "id": "fal",
  "name": "fal.ai",
  "kind": "remote",
  "base_url": "https://queue.fal.run",
  "hosts": ["api.fal.ai", "fal.run", "queue.fal.run"],
  "auth": {
    "kind": "apiKey",
    "header": "Authorization: Key <key>",
    "env": "FAL_KEY",
    "keychain": "filmopen/fal"
  },
  "credentials": [{ "id": "key", "label": "API key", "secret": true }],
  "verify": {
    "method": "GET",
    "url": "https://api.fal.ai/v1/models/pricing?endpoint_id=fal-ai/z-image/turbo"
  },
  "signup_url": "https://fal.ai/login",
  "keys_url": "https://fal.ai/dashboard/keys",
  "docs": "https://fal.ai/docs/model-apis/model-endpoints/queue",
  "notes": [
    "POST https://queue.fal.run/<model_id> returns request_id, status_url and response_url; …"
  ],
  "sources": [
    "https://fal.ai/docs/model-apis/authentication",
    "https://fal.ai/docs/platform-apis/v1/models/pricing"
  ],
  "checked": "2026-09-14"
}
```

| Key | Type | Required | Meaning |
|---|---|---|---|
| `id` | string | yes | The platform's id: the file's name without `.json`. |
| `name` | string | yes | The platform's name. |
| `kind` | string | yes | `remote` (a service), `local` (software on the user's machine) or `weights` (where weights are downloaded). |
| `base_url` | string | yes | Where requests go. |
| `hosts` | array | unless `auth.kind` is `none` | Every host a request carrying the platform's credentials may go to: at least the hosts of `base_url`, of `verify.url`, and of each `endpoint` in the access rows that name the platform. |
| `auth` | object | yes | `kind`, one of `apiKey`, `oauth`, `token` or `none`; `header`, the header with a placeholder that names a `credentials` id, such as `Authorization: Key <key>`; `env`, the environment variable the vendor's own SDKs read, where one is documented; `keychain`, the name an application keeps the platform's credentials under, as a `pl` file's `auth.keychain` (§14.3). |
| `headers` | object | | Other headers every request needs, such as `anthropic-version`. |
| `credentials` | array | when `auth.kind` is `apiKey` or `token` | What a user copies from the platform, one object per field: `id`, the field's name in the stored value and in `auth.header`'s placeholder; `label`, the platform's word for it; `secret`, whether it is hidden while it is typed; `prefix`, how the platform's values start, where it says. |
| `verify` | object | | A documented authenticated request at a fixed URL that runs no model, to check a key: `method` and `url`. It carries `auth.header` and `headers` like any other request. |
| `signup_url` | string | | Where an account is created. |
| `billing_url` | string | | Where money is added and a limit is set. |
| `keys_url` | string | | Where a key is created. |
| `pricing_url` | string | | The platform's prices. |
| `guide` | string | | The route, below a documentation site, of a guide to the platform, such as `docs/platforms/fal`. |
| `docs` | string | | The platform's documentation. |
| `notes` | array | | Regional hosts, how a job is polled, where the platform is not offered. |
| `unverified` | array | | Paths of values not confirmed on a primary source, as in a model entry (§14.7). |
| `sources` | array | yes | Every page a value came from. |
| `checked` | string | yes | `YYYY-MM-DD` on which the sources were read. |

Writers **SHOULD** write the fields in the table's order; a field that does not apply is left out, and a
reader **MUST** ignore a field it does not know. The index repeats each platform's `name` and `kind`;
where they differ from the file's, the file is right.

**Keys stay out of files.** An application keeps a platform's credentials in the operating system's
credential store under a name built on `auth.keychain` — the name itself, or, where a key belongs to a
plugin (§14.4), `filmopen/<owner>/<slot>`, the plugin's tag and the key's slot added to the name's
`filmopen` base, so that two plugins' keys for one platform never share a name — as one value: a JSON object keyed by the `credentials` ids,
whose values fill `auth.header`'s placeholders. It **MUST** send them only over `https` or `wss`, only
to the hosts in `hosts`; it **MUST NOT** follow a redirect to a host outside them; and it never writes
them into the catalogue, a project or a plugin's output (§14.2). What an `oauth` platform's stored value
holds is not specified by this version.

**Checking a catalogue.** Before a catalogue is published, a writer **SHOULD** check that every entry's
and every platform file's `id` is its filename; that `tag` and `kind` agree; that every
`access[].platform` is a key of `platforms`, that every `platforms` entry's `file` exists with the same
`name` and `kind`, that a `status` is `pending` and comes with at least one obstacle, and that every
`access[].variant` is an `id` in `variants`; that a platform whose
`auth.kind` is `apiKey` or `token` lists its `credentials`, and that `hosts` holds the hosts of its
`base_url`, its `verify.url` and every `endpoint` of the access rows naming it; that every `per` is a
unit of §14.7; that `max_length_s` is the largest of `supported_durations_s`; that a video entry marks
its tag's inputs as required; and that every listed file exists.

---

## 15. Timeline export and round-trip

### 15.1 Track mapping

OpenTimelineIO and every editing application have separate video and audio tracks; there is no
audio-visual track. A FilmOpen `av` track exports as a video track and an audio track that share a name.
The mapping is deterministic:

> Video tracks: each `av` and `video` track in declared order → V1, V2, …
> Audio tracks: the sound of each `av` track in declared order → A1, A2, …; then each `audio` track in
> declared order, continuing the numbering after those `av` audio tracks
> Every exported track carries its FilmOpen **name**.

Nobody in a project ever writes a track number. A cue on `dx` lands on a track labelled *Dialogue*
whether that is A3 or A4 in a given project.

### 15.2 Timing, checks and report

One flat timeline per episode or film. Tracks span the whole timeline; scenes appear in unit order
(§10.1) with a marker at each scene start carrying the scene stem, and a marker on each clip carrying
its shot or cue stem. **No nested compositions** — importers handle them badly.

Timings are computed from `place` by walking `after` chains, in milliseconds, then converted once to the
project rate using the exact rate ratio for fractional rates given as `num`/`den`.
Millisecond inputs may require rounding; conversion does not promise sample-exact interchange. Source in/out are start-inclusive,
end-exclusive. Source timecode and timeline position are distinct.

Before writing, the exporter checks and **reports**: unresolved or ambiguous references; missing or
unreadable media; trims beyond the take's measured duration; anchor cycles; same-track collisions;
transitions without sufficient handles; a cue's embedded audio duplicated on two tracks; any timing rounding applied. An incomplete project is still editable and still exports as a labelled
preview if asked; a final conform stops on the first impossibility and names the field.

Every export ships a **manifest** — source stem, media path, hash, target path, source and timeline
ranges — and the **report** above.

### 15.3 What travels and what does not

OTIO represents tracks and names, clips, source ranges, gaps, markers, transitions and linear speed.
Support in each editing application or adapter must be tested. Metadata can preserve other intent, but
does not guarantee that the editor applies grades, effects, audio automation or titles. Consequently:

- Export is a **conform of raw footage**: picked takes placed as specified, nothing more. The editor
  finishes in the editing application. CDL and LUT values ship as sidecars.
- Additional export formats are optional. Final Cut Pro 7 XML (`xmeml`, `.xml`) and Final Cut Pro X
  XML (`.fcpxml`) are different formats. Premiere supports the former; direct FCPXML import requires
  conversion. Choose a tested target profile rather than promising generic round-trip fidelity.
  CMX3600 EDL is a limited fallback, with unsupported structure reported.
  [Adobe interchange documentation](https://helpx.adobe.com/premiere/desktop/organize-media/import-files/migrate-from-final-cut-pro-x.html)
- An editor's export back to FilmOpen is **lossy by nature**. The format does not attempt to hold what
  OTIO cannot carry.

### 15.4 Never overwrite the editor's timeline

Two things change after the editor has started: takes get re-rendered, and the editor changes timing.
They are handled by different mechanisms, and neither one emits a new timeline over the editor's.

**Re-rendered takes → relink.** Export media into `conform/` under **stable slot names** that do not
change when a pick changes — `sh_5.2_clip.mp4`, `cu_5.1_voice.wav`. Picking a new take and re-exporting
overwrites the slot file as a deliberate act. The editor's timeline references the same path; the
editor can refresh or relink the media while retaining timeline edits. Preservation of grades, effects
and transitions depends on the editor and compatible replacement media; verify it in the named target
version rather than guaranteeing it. A new take of a
different duration no longer fits the editor's in/out — exactly as when a live-action take is swapped —
and the report **MUST** say so.

**Editor's timing → import.** When the editor exports OTIO, a reader **MAY** read it and propose changes
to `place` — track by name, anchor as `with: scene`, offset, in/out. Clip identity comes from the media
filename or slot name and from the markers. Split clips, repeated occurrences and structure the format
cannot express are reported, not compressed into one wrong placement. FilmOpen's representation stays in
step with the editor's decisions without ever emitting over them.

**New material → additive.** New scenes and shots export as a separate timeline in the same project, or
as a bin of slot media. The editor drags them in.

Under this model the editor can begin finishing as soon as an assembly exists. What still has to wait is
structural change — reordering shots after cutting has begun — which no format can make free.

---

## 16. Interchange with existing standards

### 16.1 Summary

| Domain | Standard | Status |
|---|---|---|
| Screenplay | **Fountain** | adopted, import and export of screenplay content (§10.4) |
| Screenplay | FDX | import via Fountain, with a loss report |
| Subtitles and timing | **SRT**, **WebVTT** | adopted; import produces timed blocks, export from dialogue cues |
| Production entities | **MovieLabs OMC v2.8** / OMC-JSON | concepts aligned; export mapping (Appendix C) |
| Colour | **ASC CDL**, **`.cube`** | adopted in styles; exported as sidecars |
| Edit | **OpenTimelineIO**; optional **EDL CMX3600**, **FCP7 XML**, **FCPXML** | export as conform; OTIO import proposes timing |
| Speech | **SSML** | optional on cues |
| Provenance | **C2PA**, **XMP** | embedded on export (§16.5) |
| Workflows | **ComfyUI workflow JSON** | native local workflow and offline batches |
| AI character definition | Character Card V2 | precedent; `creatorNotes` and PNG-embedded JSON borrowed |
| Location, prop, shot, cue, render batch | — | none exists; defined here |

### 16.2 MovieLabs OMC

The Ontology for Media Creation, published by MovieLabs and governed with the major studios, defines
Character, Location, Prop, Costume, Scene, Shot, Sequence, Asset and **Depiction** as first-class
entities. FilmOpen's entity list is nearly OMC's; `picks` is OMC's Depiction — the link from a narrative
object to the asset that depicts it. FilmOpen keeps its own readable field names and maps on export
(Appendix C). FilmOpen is not an OMC implementation. The OMC-JSON schema repository and the ontology
documentation carry their own licences; confirm them before reusing artefacts.

### 16.3 Character Card V2

The AI-conversation community's character format embeds its JSON inside the PNG that pictures the
character. FilmOpen readers **MAY** embed the entity JSON in a concept-sheet PNG's `tEXt` chunk under
the key `filmopen`, so a shared image carries its own definition. The JSON file remains authoritative;
embedding changes the image's bytes and hash.

### 16.4 ComfyUI

ComfyUI embeds the workflow that produced an image in the image's metadata. FilmOpen readers **SHOULD**
do the same for takes produced through ComfyUI, and **SHOULD** preserve any embedded workflow found on
ingest.

### 16.5 Provenance

Each batch item is the provenance of its take. On export a reader **SHOULD** write it into the output's
XMP and, where tooling allows, emit a C2PA manifest: `trainedAlgorithmicMedia` for rendered takes, and
for imported takes whatever the batch's `source` states — imported media may itself be generated or
composite and is never labelled camera capture by default. The `human` block records the human
contribution to each output; it is evidence, not a legal determination. A reader **MAY** produce an
authorship report walking batches, picks and commentary.

---

## 17. Editing by hand or by machine

The format is meant to be edited without any FilmOpen application. For a person or an agent:

1. **Never rename an entity file.** Create a new version.
2. **Edit only files whose author is you.** To change someone else's, fork it: copy, rename to your
   handle and `v1`, set `forkedFrom`. A delegated edit to another's file is still valid data; the
   maintainer decides whether to accept it.
3. **Prefer not to edit a version named by `_official.json`.** Fork instead. If you must, you are changing
   what everyone sees.
4. **Keep the header in step with the filename.**
5. **Never renumber block ids.** Add with the next unused number; reorder by moving array elements.
6. **Short references** in story files; **full references** in `forkedFrom`, `pick`, `on`; **media
   references** in `picks`, `refs`, `preview`, `file`.
7. **Do not write takes into entities.** Drop conforming media beside the JSON, or name it in a batch;
   a reader will find it. If you cannot name it, use `_inbox/`.
8. **No secrets in the project.**
9. **Preserve fields you do not understand.**
10. What the format cannot say goes in `notes`, or in `x` for structured application data.
11. **Your fork is used by you without further ado** — because forking records it as your pick
    (§13.1, §6.1). Without a pick you are on official. To use someone else's version in your work, set
    `pick` in your `cm_` file for the entity; to go back to official, remove it (§13.4). An application
    does this for you when you fork, pick or abandon.

A machine generating a project from a film should produce: `pj_`; one `ch_` per identified speaker with
`aliases`; `lo_` per setting; `sc_` files with timed blocks; `sh_` per detected cut with `place`; `cu_`
per dialogue line; an import batch; extracted takes — and nothing else.

---

## 18. Conformance

### 18.1 Files

A conforming file is UTF-8 JSON with no duplicate keys, named by the grammar for its category, with the
required header for that category. Writers **SHOULD** pretty-print with two-space indentation for
readable diffs; whitespace is not semantic.

### 18.2 Readers

A conforming reader:

- **MUST** parse every filename by the grammars in §5.4 and dispatch on type;
- **MUST** read `filmopen-project.json` when present (§4.4) and use the media root it names; **MUST
  NOT** refuse a folder that lacks it;
- **MUST** resolve references by §6;
- **MUST** discover takes by scanning and by batches, and **MUST NOT** require entities to list them;
- **MUST** preserve unknown fields and the `x` object when rewriting a file it authors;
- **MUST NOT** assume it is the only writer, and **MUST NOT** move, rename or delete files it does not
  understand;
- **SHOULD** warn, and continue, on: a header that disagrees with its filename; a file whose author is
  not the current user being modified; an `_official.json` written by a non-director; a version named by
  `_official.json` being edited; a segment longer than 10 characters; a reference that resolves
  ambiguously; an explicit epoch that does not exist; a project file that declares no epochs; a
  `pick` (or its 1.5 spelling `prefer`) that names no file.

Authorship warnings are not validity tests. A file edited by someone other than its named author is
still a conforming file; whether it is accepted is the maintainer's decision.

### 18.3 Writers

A conforming writer:

- **MUST** write lowercase filenames matching §5;
- **MUST** write `filmopen-project.json` when creating a project folder (§4.4), and **SHOULD** write the
  creator's first project version with the creator as director and at least one epoch (§8.2, §8.3);
- **MUST** write the required header for the file's category;
- **MUST NOT** replace a **take** that exists: a take is written only where no file of that name is
  there, so nothing generated or uploaded is ever overwritten (§12.1, §12.3). A generated derivative is
  not a take and is re-made as often as it is needed: a `conform/` slot (§15.4), a `thumbnails/`
  picture (§6.3);
- **SHOULD** write only under the current user's owner handle or a workspace of it;
- **MUST NOT** delete another author's files.

### 18.4 Schemas and tests

JSON Schemas for every file type are intended to be published at `https://filmopen.ai/schema/1/<type>.json`, CC0, and
usable offline. Until released and tested, the URLs are publication targets. Schemas mark the header
and category-specific required fields (including one project story-root list) as required, and enumerate the
vocabularies in Appendix A without restricting free-form objects to them. Cross-file resolution and
timeline arithmetic are reader and exporter work beyond schema validation.

A first implementation should demonstrate at least: a blank project written, rendered and exported with
no account and no Git; the same project opened in a text editor and a third-party reader; a delegated
edit shown clearly to a maintainer; base and two epochs of one character used in different scenes with
independent references; another contributor's shot rendered and discovered without changing their file;
an imported file with a non-conforming name referenced through a batch; a plugin run compared and partly
accepted; an interrupted provider job recovered without a second paid request; and an integer-rate and
a fractional-rate export opened in a named editing application.

---

## 19. Not in this version

- **Overlays or inheritance.** Every file is complete.
- **Reserved key prefixes, canonical serialisation, hash-addressed JSON, UUIDs.** Any editor works.
- **Per-field attribution, immutable revisions, history files.** Credit lives in `forkedFrom`, `by`,
  batches and commentary; history lives in Git.
- **Frame- or sample-unit timing fields.** Milliseconds only; exporters convert and report rounding.
- **Cast instances.** A scene selects one appearance per character; a story needing two at once uses two
  tags.
- **A full edit model** — L-cut audio splits beyond cue placement, parameterised transitions, effects.
  That is the editing application's job; the format hands it a conform with timing.
- **Alternate cuts as first-class objects.** An alternate assembly is a set of shot versions with
  different `place`. An explicit assembly entity may be added in a later version.
- **Identity or authentication.** Handles are names. Trust is the repository gatekeeper's.

---

## Appendix A — Attribute vocabulary

Everything in this appendix is **optional**. It exists so that writers — human, scripted or AI — share a
vocabulary, so that comparisons line up attribute by attribute, and so that a reverse-engineering tool
has a checklist of what to look for. Free-form objects (`appearance`, `personality`, `lighting`, …) may
carry any additional keys.

Enumerated values are lowercase strings. Where a field accepts free text, the enumeration is a suggested
vocabulary, not a constraint. "media ref" means a media reference as defined in §6.3.

### A.1 Character `ch`

| Key | Type | Values / notes |
|---|---|---|
| `kind` | enum | `principal` `supporting` `extra` `group` `narrator` `creature` `animal` |
| `aliases` | string[] | script cue names, nicknames, transcript labels |
| `summary` | string | one or two sentences |
| `arc` | string | how the character changes across the story |
| `birthdate` | integer or `YYYY-MM-DD` | birth year or date, the same in every epoch file; with the epoch's `year` a reader proposes `appearance.age` (§9.1) |
| `appearance.age` | number or string | `30`, `"late thirties"`; proposed from `birthdate` and the epoch's `year`, an integer here overrides |
| `appearance.gender` | string | free |
| `appearance.ethnicity` | string | free; optional; for continuity only |
| `appearance.species` | string | `human` default |
| `appearance.heightCm` `appearance.weightKg` | number | |
| `appearance.build` | string | `slight` `lean` `athletic` `average` `stocky` `heavy` … |
| `appearance.skin` | string | tone, texture, notable features |
| `appearance.hair.color` `.length` `.style` `.texture` | string | length: `bald` `buzz` `short` `chin` `shoulder` `long`; texture: `straight` `wavy` `curly` `coily` |
| `appearance.facialHair` | string | |
| `appearance.eyes.color` `.shape` `.notes` | string | |
| `appearance.face` | string | shape, notable features |
| `appearance.marks` | string[] | scars, tattoos, birthmarks, with location |
| `appearance.glasses` `appearance.jewellery` | string | worn habitually |
| `appearance.posture` `appearance.gait` | string | how they stand and move |
| `appearance.hands` `appearance.teeth` | string | often visible in close-ups |
| `appearance.notes` | string | |
| `personality.summary` | string | |
| `personality.traits` | string[] | |
| `personality.wants` `.needs` `.fears` | string | |
| `personality.speech` | string | rhythm, vocabulary, verbal habits |
| `personality.mannerisms` | string[] | physical habits |
| `voice.description` | string | |
| `voice.pitch` | enum | `very-low` `low` `mid` `high` `very-high` |
| `voice.pace` | enum | `slow` `measured` `normal` `quick` `rapid` |
| `voice.timbre` | string | `breathy` `rasp` `nasal` `resonant` `thin` … |
| `voice.accent` `voice.lang` | string | free; BCP 47 |
| `voice.refs` | media ref[] | reference voice samples for this character and epoch |
| `voice.providerBindings` | object | platform tag → provider voice id; samples and text remain the portable truth |
| `relationships[]` | object | `{ character, relation }` |
| `defaultOutfit` | tag | outfit used when a scene does not say; resolved at the character's epoch |
| `prompt.positive` `prompt.negative` | string | |
| `creatorNotes` | string | for people; excluded from prompts unless explicitly included |
| `picks.sheet` `picks.turnaround` `picks.expressions` | media ref or media ref[] | chosen concept sheets |
| `refs` | media ref[] or grouped object | §9.0 |
| `preview` | media ref | shown in library views |

### A.2 Outfit `of`

| Key | Type | Values / notes |
|---|---|---|
| `garments[]` | object | `{ item, color, material, fit, pattern, condition, notes }` |
| `accessories` | string[] | |
| `footwear` | string | |
| `palette` | string[] | hex or names |
| `era` | string | |
| `condition` | enum | `new` `worn` `distressed` `damaged` `bloodied` `wet` `muddy` |
| `prompt` `creatorNotes` `picks.sheet` `refs` `preview` | | as for character; no `voice` |

### A.3 Location `lo` and Prop `pr`

**Location**

| Key | Type | Values / notes |
|---|---|---|
| `kind` | enum | `interior` `exterior` `both` |
| `aliases` | string[] | slugline names |
| `geography` | object | `{ city, region, country, coordinates }` |
| `era` | string | period of the architecture and dressing |
| `architecture` | string | style, materials, scale |
| `description` | string | |
| `dressing` | string[] | props and set dressing habitually present |
| `areas` | tag[] | sub-locations `<parent>.<area>` |
| `within` | tag | the location this one lies inside; informational (§9.3) |
| `lighting.default` | string | |
| `lighting.practicals` | string[] | visible light sources |
| `lighting.windows` | string | direction, size, coverings |
| `sound.roomTone` `sound.ambience` | string | |
| `weather` | string | default, exteriors |
| `timeOfDay` | enum | default; see A.5 |
| `access` | string | entrances, exits, sightlines |
| `palette` | string[] | |
| `prompt` `creatorNotes` `picks.sheet` `refs` `preview` | | groups often used: `floorPlans`, `panoramas`, `lighting` |

**Prop**

| Key | Type | Values / notes |
|---|---|---|
| `kind` | enum | `vehicle` `weapon` `document` `device` `furniture` `food` `tool` `clothing-item` `creature` `other` |
| `hero` | boolean | seen close; needs a strong reference |
| `description` `scale` `material` `condition` | string | |
| `interaction` | string | how characters handle it |
| `sound` | string | what it sounds like |
| `prompt` `creatorNotes` `picks.sheet` `refs` `preview` | | |

### A.4 Shot `sh`

| Key | Type | Values |
|---|---|---|
| `size` | enum | `ecu` extreme close-up · `cu` close-up · `mcu` medium close-up · `ms` medium · `mls` medium long / cowboy · `ls` long / wide · `els` extreme long · `ots` over-the-shoulder · `pov` · `two-shot` · `group` · `insert` · `establishing` · `master` |
| `angle` | enum | `eye` `low` `high` `dutch` `overhead` `birds-eye` `worms-eye` `profile` `three-quarter` `frontal` `reverse` |
| `movement` | enum | `static` `pan` `tilt` `push-in` `pull-out` `truck` `pedestal` `crane` `boom` `handheld` `steadicam` `tracking` `arc` `orbit` `zoom-in` `zoom-out` `rack-focus` `whip-pan` `drone` |
| `movementNotes` | string | speed, start and end framing |
| `lens.focalMm` | number | |
| `lens.aperture` | number | f-stop |
| `lens.dof` | enum | `shallow` `moderate` `deep` |
| `lens.anamorphic` | boolean | |
| `lens.focus` | string | what is sharp; rack targets |
| `speed` | enum | `normal` `slow` `fast` `timelapse` `freeze` |
| `speedFactor` | number | `0.5` = half speed |
| `lighting.key.direction` | enum | `front` `side` `three-quarter` `back` `rim` `top` `under` |
| `lighting.key.quality` | enum | `hard` `soft` |
| `lighting.style` | enum | `high-key` `low-key` `natural` `practical` `silhouette` `neon` `firelight` `mixed` |
| `lighting.colorTempK` | number | |
| `lighting.contrast` | enum | `flat` `normal` `high` `extreme` |
| `lighting.practicals` | string[] | |
| `lighting.notes` | string | |
| `composition.headroom` | enum | `tight` `normal` `loose` `none` |
| `composition.leadRoom` | string | |
| `composition.eyeline` | string | |
| `composition.screenDirection` | string | `facing left` `moving right` … |
| `composition.symmetry` | enum | `centred` `thirds` `asymmetric` |
| `composition.depth` | object | `{ foreground, midground, background }` |
| `composition.blocking` | string | where characters are and move |
| `characters` | tag[] | visible in frame; appearance and outfit come from the scene cast |
| `props` | tag[] | visible in frame |
| `action` | string | what happens within the shot, in order |
| `continuity` | string[] | states that must match adjacent shots |
| `vfx` | string | |
| `aspect` | string | override of project aspect |
| `durationSec` | number | target; the hold for a still |
| `deliverables` | object | keys `storyboard` `firstFrame` `lastFrame` `keyframes` `clip`; each `{ model, platform?, prompt, negative?, refs?, from?, inputs?, params? }` |
| `place` | object | §11.3 |
| `picks` | object | one media ref, or several frames, per deliverable |
| `coverage` | string | notes on what else was shot for this beat |

### A.5 Scene `sc` and story units

| Key | Type | Values |
|---|---|---|
| `location` | tag | `locationEpoch` overrides the scene epoch for the location |
| `epoch` | epoch | |
| `storyDay` | number | continuity day |
| `time` | enum | `dawn` `morning` `midday` `afternoon` `golden-hour` `dusk` `blue-hour` `night` `late-night` |
| `weather` | string | `clear` `overcast` `rain` `storm` `fog` `snow` `wind` `heat-haze` … free |
| `cast[]` | object | `{ character, epoch?, outfit?, notes? }` — one selection per character |
| `props` | array | tags, or `{ prop, epoch }` for an explicit state |
| `style` | tag | |
| `synopsis` | string | |
| `purpose` | string | what the scene does for the story |
| `mood` | string | |
| `pacing` | enum | `slow` `measured` `brisk` `frantic` |
| `targetDurationSec` | number | |
| `sound` | object | `{ ambience, notes }` |
| `continuity` | string[] | |
| `vfx` | string | |
| `shots` `cues` | tag[] | order of the scene's shots and cues |
| `blocks` | array | §10.3 |

Units add `scenes` / `sequences` / `episodes` for order, and cascade `epoch`, `cast`, `locations`,
`styles`.

### A.6 Cue `cu`

| Key | Type | Values |
|---|---|---|
| `kind` | enum | `dialogue` `narration` `music` `sfx` `ambience` |
| `scene` or `unit` | full ref | what the blocks belong to |
| `blocks` | id[] | span, within `scene` |
| `anchors[]` | object | `{ scene, blocks }` when a unit-level cue cites specific scenes' blocks |
| `character` | tag | dialogue and narration |
| `spoken` | string | replaces block text |
| `ssml` | string | alternative to `spoken` |
| `lang` | string | BCP 47 |
| `delivery.effort` | enum | `whisper` `quiet` `normal` `raised` `shout` |
| `delivery.emotion` | string | |
| `delivery.processing` | enum | `none` `phone` `radio` `pa` `distant` `underwater` |
| `delivery.adr` | boolean | replaces on-camera sound |
| `music.tempoBpm` `music.key` | | |
| `music.instrumentation` | string[] | |
| `music.mood` `music.genre` `music.structure` | string | |
| `music.reference` | string | a description, never a copyrighted recording as a target |
| `music.lyrics` | string | |
| `music.stems` | object | named stem → media ref, when a delivered piece is split |
| `sfx.description` | string | |
| `sync[]` | object | `{ with, offsetMs, event }` — hit points |
| `model` `platform` | tag | |
| `place` | object | §11.3 incl. `gainDb` `pan` `fadeInMs` `fadeOutMs` |
| `picks` | object | `voice` `music` `sfx` `ambience` |

### A.7 Style `st`

| Key | Type | Values |
|---|---|---|
| `genre` | string | |
| `references` | string[] | descriptive — eras, movements, techniques |
| `look.stock` | string | film stock or digital emulation |
| `look.grain` | enum | `none` `fine` `medium` `heavy` |
| `look.halation` | enum | `none` `slight` `strong` |
| `look.contrast` | enum | `flat` `normal` `high` `extreme` |
| `look.saturation` | enum | `mono` `low` `normal` `high` |
| `look.sharpness` | enum | `soft` `normal` `crisp` |
| `look.vignette` | enum | `none` `slight` `strong` |
| `palette` | string[] | hex |
| `colorTempBias` | enum | `cool` `neutral` `warm` |
| `aspect` `letterbox` | string / boolean | |
| `lensCharacter` | string | flare, breathing, distortion |
| `cdl` | object | `{ slope[3], offset[3], power[3], saturation }` |
| `lut` | media ref | `.cube` |
| `prompt` `refs` `preview` | | groups often used: `images`, `lighting`, `sound` |

### A.8 Block kinds and per-kind fields

| Kind | Fields |
|---|---|
| `dialogue` | `character` `text` `direction` `offscreen` `voiceover` `dual` `lang` |
| `action` | `text` `characters?` |
| `narration` | `character` `text` `lang` |
| `transition` | `text` — `CUT TO:` `DISSOLVE TO:` `FADE OUT.` … |
| `title` | `text` `font?` (misc tag) `position?` `durationMs?` |
| `lyric` | `character` `text` |
| `note` | `text` |

All kinds: `id`; optional `startMs`, `endMs`.

### A.9 Project `pj`

`author` `v` `forkedFrom?` `versionLabel?` `name` `kind` (`short-film` `film` `mini-series` `series`) `genre[]` `year`
`logline` `synopsis` `lang` `rating` `format{aspect,fps,resolution,color,…}` `runtimeMin`
`credits[{role,name,handle}]` `epochs{<token>: {label?, order?, year?}}` (at least one; the first is the
default) `contributors` `tracks` `license` `hooks`, and exactly one story root list: `seasons`,
`episodes`, `sequences` or `scenes`.

Recommended `genre` tokens: `action` `adventure` `animation` `biography` `comedy` `crime` `documentary`
`drama` `family` `fantasy` `historical` `horror` `musical` `mystery` `noir` `romance` `science-fiction`
`thriller` `war` `western`. A project may name others.

### A.10 Render batch item

`n` `source` `deliverable` `take` `model` `platform` `prompt` `negative` `params` `inputs[]` `output`
`sha256` `costUsd` `durationMs` `elapsedMs` `at{ms|startMs,endMs}` `human{selectedFrom,promptEditedBy,manualEdits[]}`
`status` `jobId` `attempts` `error` `thumbnail` `poster` `proxy` `waveform` `mimeType` `bytes` `width`
`height` `fps` `frameCount` `sampleRate` `channels` `workflow`.

---

## Appendix B — Worked example

One scene of *The Cartographer* as a story and conform example. The story and selected media are
listed below; provider/model definitions for regeneration are intentionally omitted. Model/platform
labels in the historical batch are illustrative. The supplied media has the durations recorded in the
batches. Shortened hashes are illustrative; real files use complete hashes. B.10 follows the placements.

### B.1 Files

```
the-cartographer/
  filmopen-project.json
  pj_cartographer_john123_v1.json
  character/main-hero/
    ch_main-hero_30yo_john123_v1.json
    ch_main-hero_30yo_maria_v1.json
    ch_main-hero_30yo_official.json
    cm_ch_main-hero_maria.json
    cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1.png
  references/kira/
    voice-calm.wav
  location/archive/
    lo_archive_mid-war_john123_v1.json
    cs_lo_archive_mid-war_john123_v1_r7c21_john123_1.png
  prop/chart/
    pr_chart_default_john123_v1.json
  style/war-grade/
    st_war-grade_default_maria_v1.json
    st_war-grade_default_official.json
  s1/
    se_s1_john123_v1.json
    e2/
      ep_e2_john123_v1.json
      sc5/
        sc_5_john123_v1.json
        sh_5.1_john123_v1.json
        sh_5.2_john123_v1.json
        cu_5.1_john123_v1.json
        cu_5.2_john123_v1.json
        cu_5.3_john123_v1.json
        ff_sh_5.1_john123_v1_r8af0_maria_1.png
        cl_sh_5.1_john123_v1_r8af0_maria_1.mp4
        ff_sh_5.2_john123_v1_r8af0_maria_1.png
        cl_sh_5.2_john123_v1_r8af0_maria_1.mp4
        vo_cu_5.1_john123_v1_r8af0_maria_1.wav
        am_cu_5.2_john123_v1_r8af0_maria_1.wav
        vo_cu_5.3_john123_v1_r8af0_maria_1.wav
  render/
    rd_7c21_john123.json
    rd_8af0_maria.json
```

Here the media sits beside the JSON, so the manifest names no `data` locator and the project folder is
its own media root:

```json
{ "filmopen": 1, "tag": "cartographer" }
```

Had the renders been kept in a synced folder next to the project, the manifest would say
`"data": { "type": "local", "path": "../the-cartographer-data" }` and every `.png`, `.mp4` and `.wav`
above would live there instead, under the same names (§4.4).

### B.2 Project

```json
{
  "filmopen": 1, "type": "pj", "tag": "cartographer", "author": "john123", "v": 1,
  "name": "The Cartographer", "kind": "series", "genre": ["drama", "mystery"], "year": 2026,
  "logline": "A mapmaker discovers her charts are rewriting the coastline.",
  "lang": "pt-BR",
  "format": { "aspect": "2.39:1", "fps": 24, "resolution": "1920x804", "color": "rec709" },
  "epochs": { "default": { "label": "Present day", "order": 1, "year": 2026 }, "mid-war": { "label": "During the war", "order": 2, "year": 1943 } },
  "contributors": { "john123": { "name": "João Silva", "role": "director" }, "maria": { "name": "Maria Costa" } },
  "tracks": [
    { "id": "pic", "kind": "av", "name": "Picture" },
    { "id": "dx", "kind": "audio", "name": "Dialogue" },
    { "id": "amb", "kind": "audio", "name": "Ambience" },
    { "id": "mx", "kind": "audio", "name": "Music" }
  ],
  "seasons": ["s1"],
  "license": "CC-BY-SA-4.0",
  "created": "2026-09-05T18:00:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

### B.3 Character — two versions and the official pointer

```json
{
  "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo", "author": "john123", "v": 1,
  "name": "Kira Voss", "kind": "principal", "aliases": ["KIRA"],
  "summary": "A cartographer who discovers her maps are rewriting the coastline.",
  "appearance": { "age": 30, "gender": "woman", "build": "lean", "skin": "olive",
                  "hair": { "color": "black", "length": "shoulder", "style": "loose" },
                  "eyes": { "color": "dark brown" }, "marks": ["burn scar, left forearm"] },
  "personality": { "summary": "Guarded, precise.", "speech": "Short sentences." },
  "voice": { "description": "low, unhurried, slight rasp", "pitch": "low", "pace": "slow", "lang": "pt-BR",
             "refs": ["references/kira/voice-calm.wav"] },
  "prompt": { "positive": "30yo woman, olive skin, black shoulder-length hair, lean build, burn scar left forearm",
              "negative": "cartoon, plastic skin" },
  "created": "2026-09-05T18:04:11Z", "updated": "2026-09-05T19:22:40Z"
}
```

```json
{
  "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo", "author": "maria", "v": 1,
  "name": "Kira Voss", "kind": "principal", "aliases": ["KIRA"],
  "forkedFrom": "ch_main-hero_30yo_john123_v1",
  "summary": "A cartographer who discovers her maps are rewriting the coastline.",
  "appearance": { "age": 30, "gender": "woman", "build": "lean", "skin": "olive",
                  "hair": { "color": "copper red", "length": "short", "style": "cropped, undercut" },
                  "eyes": { "color": "dark brown" }, "marks": ["burn scar, left forearm", "small compass-rose tattoo, right wrist"] },
  "personality": { "summary": "Guarded, precise.", "speech": "Short sentences." },
  "voice": { "description": "low, unhurried, slight rasp", "pitch": "low", "pace": "slow", "lang": "pt-BR",
             "refs": ["references/kira/voice-calm.wav"] },
  "prompt": { "positive": "30yo woman, olive skin, cropped copper-red hair with undercut, lean build, burn scar left forearm, small compass tattoo right wrist",
              "negative": "cartoon, plastic skin" },
  "picks": { "sheet": "cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1" },
  "refs": { "sheets": ["cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1"] },
  "preview": "cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1",
  "created": "2026-09-06T09:12:00Z", "updated": "2026-09-06T10:31:02Z"
}
```

```json
{ "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo",
  "official": "ch_main-hero_30yo_maria_v1",
  "setBy": "john123", "setAt": "2026-09-06T14:20:00Z", "note": "The red hair reads better against the archive." }
```

### B.4 Location, prop, style

```json
{
  "filmopen": 1, "type": "lo", "tag": "archive", "epoch": "mid-war", "author": "john123", "v": 1,
  "name": "The municipal archive", "aliases": ["ARCHIVE"], "kind": "interior",
  "geography": { "city": "Lisbon", "country": "PT" }, "era": "1930s building, wartime neglect",
  "description": "Long reading room, iron shelving to the ceiling, one skylight, dust in the air.",
  "dressing": ["oak reading table", "green-shade lamps", "map drawers", "sandbags at the windows"],
  "lighting": { "default": "single skylight, cold; lamps warm and low", "practicals": ["green-shade desk lamps"] },
  "sound": { "roomTone": "large, dead, high ceiling", "ambience": "rain on skylight, distant sirens" },
  "prompt": { "positive": "1930s municipal archive reading room, iron shelving, skylight, green desk lamps, sandbagged windows, wartime, dust" },
  "picks": { "sheet": "cs_lo_archive_mid-war_john123_v1_r7c21_john123_1" },
  "refs": { "sheets": ["cs_lo_archive_mid-war_john123_v1_r7c21_john123_1"] },
  "created": "2026-09-05T18:30:00Z", "updated": "2026-09-05T18:30:00Z"
}
```

```json
{
  "filmopen": 1, "type": "pr", "tag": "chart", "epoch": "default", "author": "john123", "v": 1,
  "name": "The 1994 harbour chart", "kind": "document", "hero": true,
  "description": "Hand-drawn nautical chart, yellowed linen-backed paper, sepia ink, folded twice.",
  "prompt": { "positive": "hand-drawn nautical chart, yellowed linen paper, sepia ink, fold creases" },
  "created": "2026-09-05T18:40:00Z", "updated": "2026-09-05T18:40:00Z"
}
```

```json
{
  "filmopen": 1, "type": "st", "tag": "war-grade", "epoch": "default", "author": "maria", "v": 1,
  "name": "War — gritty, desaturated",
  "look": { "stock": "16mm colour negative", "grain": "medium", "contrast": "high", "saturation": "low" },
  "palette": ["#2b2f33", "#6b7076", "#b9bcb8", "#d9c9a3"],
  "prompt": { "positive": "desaturated, cold grey palette, high contrast, 16mm grain, handheld", "negative": "saturated, glossy" },
  "cdl": { "slope": [0.95, 0.98, 1.05], "offset": [-0.02, -0.02, 0.0], "power": [1.1, 1.1, 1.05], "saturation": 0.6 },
  "created": "2026-09-06T08:00:00Z", "updated": "2026-09-06T08:00:00Z"
}
```

```json
{ "filmopen": 1, "type": "st", "tag": "war-grade", "epoch": "default",
  "official": "st_war-grade_default_maria_v1", "setBy": "john123" }
```

### B.5 Story units

```json
{ "filmopen": 1, "type": "se", "tag": "s1", "author": "john123", "v": 1,
  "name": "Season 1", "episodes": ["e2"],
  "created": "2026-09-05T18:00:00Z", "updated": "2026-09-05T18:00:00Z" }
```

```json
{
  "filmopen": 1, "type": "ep", "tag": "e2", "author": "john123", "v": 1,
  "name": "Episode 2 — Low Tide", "synopsis": "Kira finds the first altered chart.",
  "epoch": "mid-war",
  "cast": [{ "character": "main-hero", "epoch": "30yo" }],
  "locations": ["archive"], "styles": ["war-grade"],
  "scenes": ["5"],
  "created": "2026-09-05T18:00:00Z", "updated": "2026-09-06T12:00:00Z"
}
```

### B.6 Scene

```json
{
  "filmopen": 1, "type": "sc", "tag": "5", "author": "john123", "v": 1,
  "name": "The archive",
  "location": "archive", "epoch": "mid-war", "storyDay": 3, "time": "night", "weather": "rain",
  "cast": [{ "character": "main-hero", "epoch": "30yo" }],
  "props": ["chart"], "style": "war-grade",
  "synopsis": "Kira compares the two charts and realises the coastline moved.",
  "purpose": "First proof. Turns the mystery from doubt to certainty.",
  "targetDurationSec": 40,
  "shots": ["5.1", "5.2"],
  "cues": ["5.1", "5.2", "5.3"],
  "blocks": [
    { "id": "bl_1", "kind": "action", "text": "Kira spreads both charts across the reading table." },
    { "id": "bl_2", "kind": "dialogue", "character": "main-hero", "text": "The bay was here last spring.",
      "direction": "flat disbelief, does not look up" },
    { "id": "bl_3", "kind": "action", "text": "Behind her, the window flashes white. A second later, the glass goes." },
    { "id": "bl_4", "kind": "dialogue", "character": "main-hero", "text": "Not now.", "offscreen": true }
  ],
  "created": "2026-09-06T11:58:02Z", "updated": "2026-09-06T12:02:11Z"
}
```

### B.7 Shots — eight seconds, then a straight cut to five seconds

```json
{
  "filmopen": 1, "type": "sh", "tag": "5.1", "author": "john123", "v": 1,
  "name": "Kira at the table", "scene": "sc_5_john123_v1", "blocks": ["bl_1", "bl_2"],
  "characters": ["main-hero"], "props": ["chart"],
  "size": "mcu", "angle": "eye", "movement": "push-in", "movementNotes": "slow, ends tight on her hands",
  "lens": { "focalMm": 50, "dof": "shallow" },
  "lighting": { "key": { "direction": "side", "quality": "soft" }, "style": "low-key", "colorTempK": 3200, "practicals": ["green desk lamp"] },
  "durationSec": 8,
  "deliverables": {
    "firstFrame": { "model": "nanobanana", "prompt": "Kira leaning over two nautical charts on an oak table, green desk lamp, archive shelving behind, 16mm grain",
                    "refs": ["cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1", "cs_lo_archive_mid-war_john123_v1_r7c21_john123_1"] },
    "clip": { "model": "seedance25", "prompt": "slow push in as she traces the coastline with a finger and speaks without looking up", "from": "firstFrame" }
  },
  "place": { "track": "pic", "with": "scene", "offsetMs": 0 },
  "picks": { "firstFrame": "ff_sh_5.1_john123_v1_r8af0_maria_1", "clip": "cl_sh_5.1_john123_v1_r8af0_maria_1" },
  "created": "2026-09-06T12:10:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

```json
{
  "filmopen": 1, "type": "sh", "tag": "5.2", "author": "john123", "v": 1,
  "name": "The window goes", "scene": "sc_5_john123_v1", "blocks": ["bl_3", "bl_4"],
  "characters": ["main-hero"],
  "size": "ms", "angle": "low", "movement": "static",
  "lens": { "focalMm": 35, "dof": "moderate" },
  "lighting": { "key": { "direction": "back", "quality": "hard" }, "style": "low-key", "notes": "single white flash from behind, then darkness with lamp only" },
  "continuity": ["charts still on the table", "scar visible, left forearm"],
  "vfx": "glass shatter, no debris toward lens",
  "durationSec": 5,
  "deliverables": {
    "firstFrame": { "model": "nanobanana", "prompt": "low angle, Kira in medium shot at the archive table, the window behind her blown white", "refs": ["cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1"] },
    "clip": { "model": "seedance25", "prompt": "the window flashes white, glass falls, she does not turn", "from": "firstFrame" }
  },
  "place": { "track": "pic", "after": "sh_5.1", "offsetMs": 0, "transitionIn": { "type": "cut" } },
  "picks": { "firstFrame": "ff_sh_5.2_john123_v1_r8af0_maria_1", "clip": "cl_sh_5.2_john123_v1_r8af0_maria_1" },
  "created": "2026-09-06T12:12:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

### B.8 Cues — dialogue riding with picture, a J-cut leading the second shot, ambience under the scene

```json
{
  "filmopen": 1, "type": "cu", "tag": "5.1", "author": "john123", "v": 1,
  "name": "Kira — the bay line", "kind": "dialogue", "scene": "sc_5_john123_v1", "blocks": ["bl_2"],
  "character": "main-hero",
  "delivery": { "effort": "quiet", "emotion": "flat disbelief" },
  "model": "elevenlabs",
  "place": { "track": "dx", "with": "sh_5.1", "offsetMs": 2750, "gainDb": -3 },
  "picks": { "voice": "vo_cu_5.1_john123_v1_r8af0_maria_1" },
  "created": "2026-09-06T12:20:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

```json
{
  "filmopen": 1, "type": "cu", "tag": "5.3", "author": "john123", "v": 1,
  "name": "Kira — not now (J-cut)", "kind": "dialogue", "scene": "sc_5_john123_v1", "blocks": ["bl_4"],
  "character": "main-hero",
  "delivery": { "effort": "quiet", "emotion": "clipped" },
  "model": "elevenlabs",
  "place": { "track": "dx", "with": "sh_5.2", "offsetMs": -1500, "gainDb": -3 },
  "picks": { "voice": "vo_cu_5.3_john123_v1_r8af0_maria_1" },
  "notes": "Her line starts 1.5 s before the picture cuts to 5.2 — we hear her before we see the window go.",
  "created": "2026-09-06T12:22:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

```json
{
  "filmopen": 1, "type": "cu", "tag": "5.2", "author": "john123", "v": 1,
  "name": "Archive — rain and sirens", "kind": "ambience", "scene": "sc_5_john123_v1", "blocks": ["bl_1", "bl_2", "bl_3", "bl_4"],
  "sfx": { "description": "rain on a skylight, large dead room, one distant siren rising and falling" },
  "model": "elevenlabs-sfx",
  "place": { "track": "amb", "with": "scene", "offsetMs": 0, "inMs": 0, "outMs": 13000, "fadeInMs": 1000, "fadeOutMs": 1500, "gainDb": -18 },
  "picks": { "ambience": "am_cu_5.2_john123_v1_r8af0_maria_1" },
  "created": "2026-09-06T12:25:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

### B.9 Render batch and commentary

```json
{ "filmopen": 1, "type": "rd", "id": "7c21", "author": "john123", "kind": "manual",
  "status": "done", "items": [
    { "n": 1, "source": "lo_archive_mid-war_john123_v1", "deliverable": "sheet",
      "output": "location/archive/cs_lo_archive_mid-war_john123_v1_r7c21_john123_1.png" }
  ] }
```

```json
{
  "filmopen": 1, "type": "rd", "id": "8af0", "author": "maria", "kind": "render", "tier": "final",
  "created": "2026-09-06T15:30:00Z", "status": "done",
  "items": [
    { "n": 1, "source": "ch_main-hero_30yo_maria_v1", "deliverable": "sheet", "model": "midjourney", "platform": "midjourney",
      "prompt": "character sheet, 30yo woman, olive skin, cropped copper-red hair with undercut, lean build, burn scar left forearm, compass tattoo right wrist, front three-quarter profile, neutral grey",
      "output": "character/main-hero/cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1.png", "sha256": "a4f1…", "costUsd": 0.08,
      "width": 2048, "height": 2048, "human": { "selectedFrom": 6 } },
    { "n": 2, "source": "sh_5.1_john123_v1", "deliverable": "firstFrame", "model": "nanobanana", "platform": "fal",
      "inputs": ["character/main-hero/cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1.png", "location/archive/cs_lo_archive_mid-war_john123_v1_r7c21_john123_1.png"],
      "output": "s1/e2/sc5/ff_sh_5.1_john123_v1_r8af0_maria_1.png", "sha256": "0c9e…", "costUsd": 0.04, "human": { "selectedFrom": 4 } },
    { "n": 3, "source": "sh_5.1_john123_v1", "deliverable": "clip", "model": "seedance25", "platform": "fal",
      "params": { "seed": 41221, "durationSec": 8, "fps": 24 }, "inputs": ["s1/e2/sc5/ff_sh_5.1_john123_v1_r8af0_maria_1.png"],
      "output": "s1/e2/sc5/cl_sh_5.1_john123_v1_r8af0_maria_1.mp4", "sha256": "9d02…", "durationMs": 8000, "elapsedMs": 64200, "costUsd": 0.56, "human": { "selectedFrom": 3 } },
    { "n": 4, "source": "sh_5.2_john123_v1", "deliverable": "firstFrame", "model": "nanobanana", "platform": "fal",
      "output": "s1/e2/sc5/ff_sh_5.2_john123_v1_r8af0_maria_1.png", "sha256": "5b77…", "costUsd": 0.04 },
    { "n": 5, "source": "sh_5.2_john123_v1", "deliverable": "clip", "model": "seedance25", "platform": "fal",
      "params": { "seed": 41222, "durationSec": 5, "fps": 24 }, "inputs": ["s1/e2/sc5/ff_sh_5.2_john123_v1_r8af0_maria_1.png"],
      "output": "s1/e2/sc5/cl_sh_5.2_john123_v1_r8af0_maria_1.mp4", "sha256": "e310…", "durationMs": 5000, "elapsedMs": 41800, "costUsd": 0.35 },
    { "n": 6, "source": "cu_5.1_john123_v1", "deliverable": "voice", "model": "elevenlabs", "platform": "elevenlabs",
      "output": "s1/e2/sc5/vo_cu_5.1_john123_v1_r8af0_maria_1.wav", "sha256": "31cd…", "durationMs": 2500, "sampleRate": 48000, "channels": 1, "costUsd": 0.01 },
    { "n": 7, "source": "cu_5.3_john123_v1", "deliverable": "voice", "model": "elevenlabs", "platform": "elevenlabs",
      "output": "s1/e2/sc5/vo_cu_5.3_john123_v1_r8af0_maria_1.wav", "sha256": "c0de…", "durationMs": 1000, "sampleRate": 48000, "channels": 1, "costUsd": 0.01 },
    { "n": 8, "source": "cu_5.2_john123_v1", "deliverable": "ambience", "model": "elevenlabs-sfx", "platform": "elevenlabs",
      "output": "s1/e2/sc5/am_cu_5.2_john123_v1_r8af0_maria_1.wav", "sha256": "88a2…", "durationMs": 14000, "costUsd": 0.02 }
  ]
}
```

```json
{
  "filmopen": 1, "type": "cm", "target": "ch_main-hero", "author": "maria",
  "pick": { "30yo": "ch_main-hero_30yo_maria_v1" },
  "pickedAt": { "30yo": "2026-09-06T15:41:00Z" },
  "entries": [
    { "on": "ch_main-hero_30yo_john123_v1", "at": "2026-09-06T09:05:00Z", "rating": 1, "text": "Good bones. Hair is too safe for the archive — trying red." },
    { "on": "cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1", "at": "2026-09-06T15:40:00Z", "rating": 1 }
  ]
}
```

### B.10 What the export produces

One timeline, *Episode 2*, 24 fps, 13 seconds (312 frames). All boundaries in this example
are frame-aligned, so no timing rounding is needed:

| Track | Clip | Start | End |
|---|---|---|---|
| V1 *Picture* | `cl_sh_5.1…` | 0:00.000 | 0:08.000 |
| V1 *Picture* | `cl_sh_5.2…` | 0:08.000 | 0:13.000 |
| A1 *Picture* | the two clips' embedded sound | as above | |
| A2 *Dialogue* | `vo_cu_5.1…` | 0:02.750 | 0:05.250 |
| A2 *Dialogue* | `vo_cu_5.3…` | 0:06.500 | 0:07.500 — leads the cut by 1.5 s |
| A3 *Ambience* | `am_cu_5.2…` | 0:00.000 | 0:13.000, 1 s in, 1.5 s out |

A marker *sc_5* at 0:00.000; a marker on each clip carrying its stem; `conform/` holding
`sh_5.1_clip.mp4`, `sh_5.2_clip.mp4`, `cu_5.1_voice.wav`, `cu_5.3_voice.wav`, `cu_5.2_ambience.wav`; a
manifest; and a report noting that the ambience take is 14 s and is trimmed to 13.

---

## Appendix C — MovieLabs OMC correspondence

Concept-level. Property names must be confirmed against the OMC-JSON v2.8 schema before an exporter is
written.

| FilmOpen | OMC concept | Notes |
|---|---|---|
| `pj` | Creative Work | title, synopsis; `contributors` and `credits` → Participants |
| `ch` | Character | `name`; `appearance` → profile / physical characteristics; `aliases` → alternate names |
| `of` | Narrative Wardrobe / Costume | linked to Character |
| `lo` | Narrative Location | `areas` → contained Locations |
| `pr` | Narrative Prop | `hero` → notable |
| `st` | — | no OMC equivalent; export as Asset with CDL sidecar |
| `se` `ep` `sq` | Creative Work structure / Sequence | nested by `scenes`, `sequences`, `episodes` |
| `sc` | Narrative Scene | blocks → scene description and dialogue; `storyDay` → Context |
| `sh` | Shot | `place` → editorial timing; with Slate where an import batch supplies one |
| take | Asset | media file with identifiers; `sha256` → identifier |
| `picks` | **Depiction** | the narrative-object-to-asset link |
| `rd` | Task and Asset provenance | `human` → participant contribution |
| `author` | Participant | owner segment |
| epoch | Context | "in which circumstances" |

---

*FilmOpen Project Specification 1.3 Draft · filmopen.ai · CC-BY-4.0*
