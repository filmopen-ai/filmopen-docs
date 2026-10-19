# Localisation, and the sample project

## 10. Localisation

Three layers, all in `filmopen_l10n` (`packages/filmopen_l10n/lib/l10n/` for the ARB files and the generated code, `lib/src/` for the two hand-written files):

1. **Messages** — `app_en.arb` (template) and `app_es.arb`, compiled by `gen-l10n` (`l10n.yaml`: `nullable-getter: false`) into `app_localizations.dart` and one file per language. Widgets use `context.l10n`; providers use `localizationsProvider`. Counts use ICU plurals (`countScene(n)` → "1 scene" / "3 scenes").
2. **The format's vocabulary** — the JSON keys are normative and never translated. `fieldLabel(l10n, key)` in `field_labels.dart` maps 310 keys from Appendix A to messages (`fieldName`, `fieldForkedFrom`, …) and returns null for unknown keys, in which case the raw key is shown. Entity types (`typeScene`, `typeScenePlural`, `countScene`) and deliverables (`deliverableClip`) have their own messages, reached through the `Labels` extension in `labels.dart` (`typeLabel`, `typePlural`, `typeCount`, `deliverableLabel`).
3. **Diagnostics** — `warningText(ProjectWarning)` and `problemText(ResolutionProblem)` in `labels.dart` turn model codes into sentences.

The generated files are committed so editors and the analyzer see them; `flutter gen-l10n` inside the package regenerates them. English is the source of the keys, and `filmopen_l10n/test/arb_keys_test.dart` fails when another language lacks one. To add a language: copy `app_en.arb`, translate, add the language name to `settings_page.dart` — one file per language, so a translator and a colleague adding a language never touch the same file. To add a field label: add `field<Key>` to every ARB and one case to `field_labels.dart`. British spelling is used in English messages (colour, licence).

## 11. The sample project

`assets/sample/` holds *The Cartographer* from Appendix B of the Project Specification, extended so the tree has depth, laid out the way a real project is meant to be (§4.4, §14.5):

- `the-cartographer/` — the project: `filmopen-project.json` (tag `cartographer`, `data` → `../the-cartographer-data`) and 38 JSON files, flat (directories carry no meaning in the format): two project versions (John's, and Suda's Thai remake forked from it) with an official pointer; the character `main-hero` at two epochs with three versions at `30yo` and an official pointer to Maria's fork; a second character; two outfits; two locations, one with an area; a prop, a style with an official pointer, a misc entry, a document; four **folders** — *Season 1* (`fo_s1`, kind `season`) holding *Episode 1 - High Water* and *Episode 2 - Low Tide* (`fo_e1`, `fo_e2`, `episode`), the first holding *Arrival* (`fo_arrival`, `sequence`), their short names made by hand and none of them saying anything about what its scenes hold; two scenes, one of which has two versions and an official pointer; shots and cues including a J-cut and a music cue that spans the second episode and names it in `folder`; two commentary files; two render batches; and one unknown text file so the *Other files* row appears.
- `the-cartographer-data/` — the media root: the nine placeholder takes (four small PNGs, and `.mp4` and `.wav` files named as takes, each the smallest honest file of its kind — an MP4 with a header and no tracks, a 44-byte silent WAVE with no frames — so a player says it cannot read them rather than the file failing to load; `flutter run -d web-server` answers 500 for a zero-length asset, which the older empty placeholders were), and `references/kira/voice-calm.wav`, the one hand-supplied reference a character names (§9.0 of the Project Specification).
- `library/` — the seed of the shared library: a model, a platform and a plugin manifest.

Being under `assets/` and in Git is a development convenience (the build copies them to `build/flutter_assets/assets/sample/…`); a real project's media root is a synced folder, and the real library is the folder the app installs beside its preferences.

The sample is what the app opens at start — as a session copy on the web, and in development mode on every platform (§9.5), so it can be edited and then kept with *Copy to a folder…* — and what most tests read. In-memory fixtures (`filmopen_test_support`'s `fixtures.dart`) cover what the sample cannot: ambiguity, missing epochs, multi-author project folders, bad field types, cycles.
