# Conventions for contributors, and third-party code

## 13. Conventions for contributors

- **No user-facing text outside `filmopen_l10n`.** The format and the store emit codes. Widgets take strings from `context.l10n`; providers from `localizationsProvider`.
- **Every write goes through `ProjectWriter`** (or `writeNewProject` for a new project), through the source's `writeText` / `deleteFile`, followed by `refresh`. No widget writes a file, and nothing edits the index in memory.
- **Write only as the viewer.** A write without a handle throws `NoViewerException`, another author's file `NotYourFileException`; the UI turns these into messages and offers Fork or Settings.
- **No Flutter and no plugin in `filmopen_format`, `filmopen_store` or `filmopen_test_support`; no widget package in `filmopen_state`.**
- **A package imports another only through its barrel** (`package:filmopen_x/filmopen_x.dart`), never `lib/src/`; a new dependency is a line in that package's pubspec and a row in §3; a boundary that needs a cycle is redrawn, never merged.
- **Every control an agent drives carries a `Semantics(identifier:)`** — `nav.*`, `tree:<node id>`, `tree:<node id>.menu` with `tree.add-folder`, `tree.add-scene`, `tree.move-up`, `tree.move-down`, `tree.move-to` and `tree.remove`, `contents.*`, `move.*`, `tree.*`, `project.*`, `new-project.*`, `category.add`, `new-entity.*`, `version.*`, `label.*`, `file.*`, `field:<stem>:<key>` (the key a field pairs on), `epochs.*`, `banner.fork`, `compare.copy-*`, `compare.fork-*`, `draft.*`, `guard.*`, `pick.*`, `json.*`, `settings.*`, `account.*`, `keys.*`, `usage.*`, `<box>.dictate` and `dictation.*` (§9.4, §9.6) — unique on every page `test/identifiers_test.dart` walks (a version page, the project menu, a category page, three dialogs, the dictation popup, Compare, Settings and its Provider keys and Usage tabs), and by construction elsewhere (path-like row ids, the file's stem in a field's, an enum's name in a notice's). Tabs carry none: Material's tab bar merges each tab's semantics into one node and an identifier inside breaks that merge; a tab is opened by name (`AutomationHost.setTab`).
- **No product widget knows it is recorded; a control an agent drives carries an identifier, and renaming one breaks every tape that names it** (§6.8: the issue recorder hears a person through Flutter's own bindings and the state's seams, never through a line that says "if recording").
- **Platform code comes in threes:** `x.dart` (conditional export), `x_io.dart`, `x_stub.dart`; the stub answers "not available" (`canX = false`, null, or `UnsupportedError`) and the UI hides the affordance. Never import `dart:io` from a file the web build reaches.
- **Log events, not sentences:** `AppLog.instance.info('project.opened', data: {...})`; dotted identifiers, structured data, no user-facing text. Log every open, write, failure and setting change; log timings at debug.
- **One rule for short names:** anything that must be a segment goes through `ShortName` and, in the UI, `ShortNameField`.
- **Never throw on a bad file.** Add a `WarningKind` and report.
- **Never choose for the user** where the Project Specification says report. Return an unresolved `Resolution` or a null selection.
- **One way to navigate:** `browserProvider.navigate(...)`.
- **Comments explain why**, and cite the Project Specification section (`§6.1`) when a rule comes from it.
- **Filenames and identifiers follow the format's vocabulary:** `stem`, `tag`, `epoch`, `author`, `official`, `take`, `batch`, `cue`, `block`.
- **Tests for every spec rule** on an in-memory fixture, not only on the sample.
- **Keep `kAppVersion` in `lib/consts.dart` equal to `version:` in `pubspec.yaml`.** The constants the packages read (the name, the development-mode switch, the bundled sample) are `filmopen_state/consts.dart`.
- **Commit `pubspec.lock`** (it is an application) and the generated localisation files.

**A media source is a package.** It implements `MediaStore` (and, above, its own `MediaSourceUi`) and is registered by its locator type in one list; **no other file names a source**. A page that shows media asks `ProjectMedia` and the store it was given, and never where the bytes are.

**No media file is ever overwritten.** A store writes with `create`, and a name comes from the take grammar with a batch id made unique against the author's own batches (Project Specification §5.4, §12.3, §18.3). A thumbnail is the exception that proves it: a derivative a reader may re-make, written without `create`.

## 15. Third-party code

`packages/filmopen_ui/lib/src/split_view.dart` is adapted from API Dash (`lib/widgets/splitview_dashboard.dart`, Apache License 2.0, revision `8044b218…`). The licence is vendored at `third_party/apidash/LICENSE`, registered with Flutter's `LicenseRegistry` in `main.dart`, and listed in `THIRD_PARTY_NOTICES.md`. The rail-beside-sidebar arrangement follows API Dash's dashboard; the theme, model, tree, views and state are FilmOpen code. FilmOpen's own licence is not yet decided.
