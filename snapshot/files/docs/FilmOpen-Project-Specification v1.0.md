# FilmOpen Project Specification

**A plain-text format for describing a film.**

| | |
|---|---|
| **Version** | 1.45 — Draft |
| **Date** | 8 November 2026 |
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

## Changes in 1.45

- **New content is checked through every record** (§7, §9.1, §10.3, §18, Appendix A): every document and every
  block may carry `metadata`, an object of free-form attributes; the descriptive objects — `appearance`,
  `personality`, `voice`, `lighting`, … — are defined records, and new content a model submits holds to them, what
  they lack going under `metadata`; Appendix A names its dynamic maps with their keys and values, and is reconciled
  with its sections (a Style's `description`, a scene's and a block's imported fields, `next_epoch`); a file on
  disk is still read losslessly, its other keys kept and warned about. The project's `format` names its optional
  members, and a plug-in's offer the members an application reads (§8.5, §14.4).
- **Pending sets** (§12.7): an `as` record names what its chat was asked — `action`, the catalog action's id it opened
  with, and `entity`, the entity a field's or form section's action opened at — both absent on a record from before
  them, and neither inferred from the items, whose first may be of another entity.
- **A chat's conversation** (§12.7): an `as` record keeps `messages`, the conversation as the model was told it, in
  order — the person's and the assistant's words with `at`, and each tool call with its arguments and the tool's
  answer — and is written from the chat's opening, so that a chat that changed nothing has a record too; absent on a
  record from before it or of a chat not opened in a chat window, and nothing inferred in its place.
- **A character's birth month** (§9.1, A.1): `birth_date` may also be a month, `YYYY-MM` (`"2014-01"`); its year
  fills the age as a year's does. A month is 01–12 and a day 01–31; anything else is malformed.

## Changes in 1.44

- **An unused default era** (§8.2): when describing a new era through import, the first unknown label
  relabels the sole declared era if nothing explicitly uses its token; later labels append, never merged by year.
- **A prompt's stamp carries its neighbours** (§7, §9): a save that stamps a prompt stamps the holder's other current
  prompts the same time, where the holder's other content is the same; a fork written with content does not.
- **A character's birth date** (§9.1, A.1): `birth_date` is a year or a full date. Its year fills a numeric
  `appearance.age` when the birth date changes or a version is made at another era; the stored age otherwise
  stays as written, including when an era's year is edited. The legacy `"N (YYYY)"` form remains readable.

## Changes in 1.43

- **A kept recording** (§9.1): an uploaded voice sample may gain its provider and voice id without a generated
  preview id. Each sample may carry its own known `audition_text`; keeping writes those words on the sample and
  on the legacy character field, never borrowing another sample's words when none are known.
- **Recording keep capability and price** (§14.7–§14.8): `keeps_recording` declares a design model's reference keep,
  `reference` declares speech's reference input, and `clone` prices one recording kept as a voice.

## Changes in 1.42

- **An answer is not searched** (§14.4): the application does not search an answer for a credential, so a platform
  that echoes one hands it back to the plugin as sent.

## Changes in 1.41

- **A render records where it ran** (§12.2): a render record's `request` may hold `destination`, the server the
  render was sent to as the application named it, so that a take continued returns there; absent for the person's
  own computer or a server address they set, and on every record written before.
- **A clip's sound** (§9.0, §12.2): `audio`, `true` or `false`, measured once when the clip is inserted, on its entry
  and its record's item, absent where it could not be measured; a clip without it plays its sound where the file has
  one.
- **A spanning clip plays across its blocks** (§10.3, §15.5): from its block's start over the blocks it covers, a
  covered block's own clip drawn over it and both sounds played; it does not set its block's output duration.

## Changes in 1.40

- **A dangling entry of `children`** (§8.5): an entry naming a folder or scene the project does not have, or one whose
  every version is discarded, is left out by a reader with no warning, and the file keeps it until its list is next
  changed.
- **Discarding is for good** (§7): an application writes `discarded` once and never removes it, so a discarded
  version stays discarded; 1.39's *comes back when the key is removed* is withdrawn.
- **Pending sets** (§12.7): an `as` item's `result` is `{updated}` alone, with no hash, and its outcome `restored` is
  withdrawn (`open`, `accepted` or `discarded`); an `as` record lists the session's `picks`, and an item keeps its
  command's `summary`; sessions are one per chat, so an author may have several open at once; a queue item's `take`
  and `record` are defined, and a queue goes back from `submitting` to `pending` where a pass leaves an item
  unresolved.

## Changes in 1.39

- **Pending sets** (§5.3, §5.4, §12.2, §12.7): a comp `cp_<id>_<author>.json` and an assistant session
  `as_<id>_<author>.json`, and a render batch's queue, `kind: "queue"` — one shape, a record of numbered items with
  `status` and `next_item`, pending until it is committed and then its own history. An older reader lists `cp` and
  `as` among the other files.
- **`discarded` on a version** (§6.1, §7, §13.1, §18.2): the version is set aside — absent from every step of
  resolution, hidden from version lists, its number kept — and comes back when the key is removed; a pick or an
  official pointer naming it is reported and ignored. Not a fork's content, never copied.

## Changes in 1.38

- **A block's subtitles** (§10.3, A.8): `subtitles`, an ordered list of `{position?, text?, duration_sec?}` — the
  beats' shape with `text` for `description`, timed by the beats' rule: the lines burnt over the picture while the
  block plays. Part of the block's text, so a change moves its `updated`; a subtitle travels with its block in
  copy-left and exchange.
- **The subtitles' look** (§8.5): `format.subtitles`, `{font, size}` — one font family and one size in pixels at
  the output's height for the whole project; absent, the application's default.

## Changes in 1.37

- **A block's output duration** (§10.3): `output_duration_sec`, the seconds the scene's output gives the block, a
  number greater than zero, set by a person or an assistant; absent, the application's rule decides. It is stored
  only when someone sets it, never as a derived value, and moves neither the block's nor the file's `updated`.
  `rendered_sec`, which nothing wrote, leaves the format.
- **A scene's export** (§15.5): one scene as an OpenTimelineIO file with direct file references, its manifest and
  its report.

## Changes in 1.36

- **A block's beats** (§10.3, A.8): `beats`, an ordered list of `{position?, description?, duration_sec?}` —
  instructions that guide the block's video, each placed `before_dialogue`, `during_dialogue` or
  `after_dialogue` where the block has dialogue, its seconds in `duration_sec` as the block's own. Part of the
  block's text, so a change moves its `updated`; a beat travels with its block in copy-left and exchange. A
  block's `prompts` may hold `clip`, its clip prompt. A block is *one unit of the script*, no longer *a beat*.
- **Modes as variants** (§14.7): a model's modes that a platform reaches by separate routes — a text mode and a
  reference mode — are variants of its entry, as its tiers and sizes are; each access row names its variant.

## Changes in 1.35

- **The plugin interface's revision 16** (§14.4): `character-transform` is removed, with no backwards
  compatibility — a package that still offers `transformCharacter` loads with an ordinary offer that nothing
  calls; a prompt writer may serve `prop-sheet` and `clip`, and a clip's writer is handed the block, the later
  blocks it covers, the entities they name and the block's language.
- **A character's age** (§9.1, A.1): `birthdate` was removed (`birth_date` returns in 1.44);
  `appearance.age` is a whole number, a phrase, or
  `"N (YYYY)"` — the age and the year of birth it came from — stored in each epoch's file. A new epoch's file
  uses the copy's birth data, with the default epoch's pick as a second source (1.44); an epoch's year edited later recomputes
  nothing. `arc` leaves A.1: a file that holds it keeps it as an unknown key (`arc` stays a folder's kind).
- **Each type's media places** (§9.0, A.1, A.3, A.7): a character, an outfit, a location, a prop, the project and a
  folder each have fixed places, in order — `inspirations` also on the outfit, the location and the prop; a group
  its type does not list stays in the file and is not shown; the appendices' *groups often used* go.
- **An outfit's `description`** (A.2): a free description of the outfit as a whole, the one prose an outfit's
  prompt writer reads beside its garments.
- **A prop's sheet prompt** (§9, A.3): a prop holds `prompts.sheet` beside its `reference`, as a location and an
  outfit do; its sheets are rendered from it.

## Changes in 1.34

- **Screenplay import** (§16.6, formerly *Final Draft XML*): a screenplay is imported from Final Draft (`.fdx`),
  Fountain (a `.txt` included), text PDF, Word (`.docx`), RTF or Fade In, the file's content deciding its format, never its extension. Every format
  maps through the same element list onto the same documents; a non-FDX file that is not a recognised
  screenplay is refused with one code, `not_screenplay`. A heading's time of day is the tail after a spaced dash
  or a period followed by a space that holds a recognised time word, every format FDX included; an unknown tail
  stays in the location's name. Provenance is
  kept per format beside `source.fdx`: `source.fountain`, `source.pdf`, `source.docx`, `source.rtf` and `source.fadein`, on the project and as
  the first source place of each scene, block, resource and folder, never a copy of the document.
- **Fountain's correspondence** (§10.4): numbered headings give `scene_number`, and the title page is kept in
  `source.fountain.title_page`.

## Changes in 1.33

- **The media tokens a prompt may name** (§9): a reference prompt its holder's `@inspiration-<n>`; a sheet prompt
  its `@inspiration-<n>` and `@reference-<n>`; a block's frame prompts the film's characters', locations' and
  props' pictures as `@<stem>:reference-<n>`, `@<stem>:character_sheet-<n>` and `@<stem>:location_sheet-<n>`;
  none in the treatment and the voice. The file keeps the token; a renderer is sent the pictures and the model's
  words for them.
- **An access row's `placeholders`** (§14.7): the model's words on that platform for its `n`th input picture,
  required on every row that maps `reference_images`; and the catalogue's new checks (§14.9).

## Changes in 1.32

- **One `prompts` object on every holder of prompts** (§9, A.1–A.3, A.7, A.8, A.11), keyed by kind — a
  character's `reference`, `sheet` and `voice`; a location's and an outfit's `reference` and `sheet`; a prop's
  `reference`; a block's `first_frame` and `last_frame`; a treatment's `treatment` — each prompt `{ positive,
  negative?, created?, plugin? }`. It replaces `prompt`, `voice.prompt` and `visual_style.prompt`, which are not
  read: a project written before 1.32 is not read as such.
- **A prompt's `created` and `plugin`** (§9): the writer stamps `created` with the time it writes to the holder's
  `updated` where the prompt's words or writer changed, or where `created` was removed; `plugin` names the plug-in
  that wrote the words and goes when a person changes them. A prompt is current when its `created` is not
  earlier than its holder's `updated`.
- **`render_stage` is not content** (§7): choosing a stage moves neither `updated` nor a prompt's currency; a
  render asked at a stage below its holder's is outdated by the stage (§9.0).
- **Copy-left never moves a prompt's `created` or `plugin`** (§13.3), and words it copies are a person's.
- **One installed version of each plugin runs** (§14.4, §14.5): the stock author's highest, else the folder's
  highest; a pick or an `_official.json` on a plugin stays a legal file and chooses nothing, and another version is
  run by removing the package and installing it.
- **A treatment's `preset` is the chosen style, stored** (§8.7, §14.4, A.11): inherited like any leaf, which a
  writer may use; an application rendering with a treatment does not add its words to the prompt.

## Changes in 1.31

- An access row's `strings`; a ComfyUI row names no `model_id`; list values in the platform's spelling (§14.7).

- **A treatment's `preset`** (§8.7, A.11): a reference `<tag>:<entry id>` to a style a prompt builder's catalogue
  names, inherited like any leaf and never brought by a Style; its words come after the entity's own prompt and
  before the primary leaves.
- **The `prompt-builder` interface** (§14.4): a catalogue of entries a person picks from, declared and never called.

## Changes in 1.30

- **The sole owner's plain handle first** (§6.1 step 3): where nothing is official and exactly one owner has
  versions, that owner's highest version under their plain handle is used before the highest under any of their
  derived handles (§5.6), so an abandoned `aaron.ai_v3` does not show over `aaron_v2`. Only where the owner has
  no version under the plain handle does the highest among the derived handles decide.
- **`deleted` on an entity** (§7): `true` says the entity is absent at that epoch for whoever has that version in
  use; the file stays, and the entity comes back by removing the key or by picking another version.

## Changes in 1.29

- **An access row's `render` and a price's `match`** (§14.7): `render: true` marks a row reviewed for a render
  plug-in that names no models; `match` names the settings a price applies to. A call that no price applies to —
  no `match` it meets and no `when` naming its resolution — has no price where any row has a `match`, never the
  least.
- **The stage a version's renders are asked at** (§9.0, A.1–A.5): `render_stage` at the top level of a version that holds media, `prototype`, `draft` or `final`, `prototype` where absent or of another shape; written only when a person sets it; a fork keeps it; a comparison does not show it. A render still records its stage in its record (§12.2).

## Changes in 1.28

- **FilmOpen Cloud sync** (§4.4): `sync.target` may be `filmopen`, with `id` `<username>/<tag>`, beside `drive` and `folder`.
- **A person's username** (§5.2, §5.6) is `[a-z0-9][a-z0-9-]{2,31}`: 3 to 32 characters, never starting with a dash, the owner `official` reserved — the same grammar as a filmopen.ai account's username. A handle's owner part is a username; its workspace part keeps its bound of 20.
- **An allocated id** (§5.2) may have an owner of up to 32 characters, so up to 43 characters in all, and is accepted wherever an epoch, a tag segment or a reference's segment is, past the ordinary segment's 32.
- **No advice on a segment's length** (§5.2, §18.2): readers no longer warn of a segment longer than ten characters; a segment within the grammar, of any length up to 32, draws no warning.

## Changes in 1.27

- **A render's record** (§12.2, A.10) is `kind: "render"`, one per render job, with a required `request`: what was asked, once — `render_id`, `plugin`, `model`, `platform`, `stage` (`prototype` · `draft` · `final`), `prompt`, `params`, `seed_random`, `inputs`, `sources` and `asked_at`, and where they apply `inputs_by_name`, `treatment`, `purpose` and `from`. `stack`, `seed_applied`, the plug-in's shared container `metadata`, and the record's one `cost_usd` stand at its top (`metadata_refused` is no longer written; a record from an older version may carry it, and it is kept as read); an item holds the file's own facts only, with what the plug-in said of the file under `reported` and its own container under `metadata`, and an output the render did not fetch keeps its item with `fetched: false` and its `error`. `tier` and `partial` are gone and a writer refuses them; `status` is `done`, `failed` or `cancelled`. A render record without `request` is reported and stays listed.
- **Seven keys on a media entry** (§9.0): `duration_ms`, `width`, `height`, `stage`, `spans`, `unreviewed` and `kept_at`. Every other fact of a render is read from its record.
- **A block's `updated`** (§10.3): when its text last changed.
- **A block's `media` and its entries' `spans`** (§10.3): a block holds media in six groups; `spans` is `blocks`, the consecutive blocks from the owning block a render covers, or `until` — `end_of_scene`, a block or seconds — the extent it plays over; each group allows its own shapes, and a wrong shape reads as absent.
- **`updated` is when the content last changed** (§7): inserting a take, keeping or rejecting one, a favourite or a note moves nothing, and a fork keeps its source's.
- **The `plugins` row of §7 has no exception**: a writer no longer drops the bundled assistant's former `imageModel`; every value a plug-in keeps survives a write.

## Changes in 1.26

- **Final Draft import** (§16.6) maps screenplay paragraphs, production tags and outline groups directly into FilmOpen documents. Source identities and otherwise unmapped XML are retained in `source.fdx` as ordered JSON. The imported project starts with its creator's `<owner>-1` epoch, as any new project (§8.2).
- **Opaque UUID tags** (§5.2) retain foreign entity identities without relaxing the rules for authors, epochs or ordinary segments. An imported outfit may have no known character owner; it is read with the warnings of an outfit without a character (§9.2).
- **Screenplay metadata** (§10.2–§10.3) preserves the original element type, scene heading and number, parallel dialogue group, and scene resource references while retaining the editor's dialogue/direction/action shape.

## Changes in 1.24

- **The bundled assistant's `imageModel` leaves the project file** (§7, `plugins`). FilmOpen opens an image
  render on the model last sent from the machine and no longer reads `plugins.default-ai-assist.imageModel`: a
  reader reads it as any value, and a writer that rewrites the project file drops it, with the assistant's
  object where nothing else is left in it and `plugins` where it is empty then. Nothing else in a plug-in's
  object is touched.
- **A treatment's five primary leaves** (§8.7, A.11): `camera`, `camera_mount`, `lens`, `depth_of_field_prompt`
  and `color_grading`, each a person's words — a camera as a prompt names it (*Cell phone camera (iPhone)*), a
  mount, a focal length, a depth of field in an f-stop's words (*f/2.8 shallow*), a grade — inherited leaf by
  leaf as any other. An application that renders with a treatment names each that applies after the entity's own
  prompt and before the treatment's `prompt.positive`, in that order and in English whatever its language:
  `Camera: …`, `Camera mount: …`, `Lens: …`, `Depth of field: …`, `Color grading: …`. The older leaves stay as
  they were: `depth_of_field` keeps its scale and never holds an f-stop's words, `camera_character` is how the
  camera feels, never a body or a mount, and `lens_character` how the lens draws, never a focal length.

## Changes in 1.23

- **One shape for a block** (§10.3, A.8). A block is `id`, `character`, `dialogue`, `direction`, `action`,
  `duration_sec`, `rendered_sec`, `lang` and the import's `start_ms` and `end_ms`; it may hold dialogue and
  action at once, and has one speaker at most. `kind` and `text` leave the format, and with them
  `offscreen`, `voiceover`, `dual`, an action's `characters` and a title's `duration_ms`, `font` and
  `position`: Fountain's `(O.S.)`, `(V.O.)` and dual dialogue are words at the head of `direction`
  (§10.4). `duration_sec` is the seconds the writer asks for, absent meaning *auto*; `rendered_sec` the
  seconds a render produced, written by the render alone. A block written before 1.23 reads by one rule
  and is rewritten only when an editor changes it.
- **A block's id is never shown and never given out twice** (§10.3). Ids stay in the file — cues, shots and
  copy-left address a block by id — and mean nothing to a person. A scene's new `next_block` (A.5) is the
  number the next new block takes, so a block deleted while a cue still names it is never replaced by a
  stranger under its id.
- **A moved block takes the target scene's next number**, and the target is written before the block
  leaves its first scene: a failure between the two writes leaves the block in both, never in neither
  (§10.3).
- **A cue speaks the `dialogue` of the blocks it names** (§11.2): `direction` and `action` are never read
  as its text.
- **The `lifecycle` interface is named** (§14.4): `onEnable`, a plug-in told it was turned on, which may
  look quickly whether it can work, reading only the routes its manifest declares (`discovery`), and
  `onDisable`, told it was turned off, to tidy its own state — both called by the application on the
  person's switch. Made in the 1.22 draft, on the owner's word, and carried here.

## Changes in 1.22

- **A category for voice design** (§14.6–§14.8). The catalogue's thirteenth tag, `ttv`, *Voice design*,
  of kind `voice`: a model that makes preview voices from a written description, one of which an
  application keeps on the person's account for speech. Its capabilities are §14.8's *Voice design*, and a
  model document's `kind` may be `voice` (§14.3).
- **A take rendered under a person's workspace is theirs to delete** (§9.0): its renderer's owner is the
  person, as for a plug-in's render made under `<person>.<tag>` (§5.6), where 1.21 counted only the exact
  handle.
- **The voice a character speaks with** (§9.1, §9.0, §13.3, A.1). `voice.provider_bindings` stays the
  **active binding**: per platform, the voice id speech uses there, changed only when a person chooses a
  voice. An entry of `voice_samples` may carry **`voice_binding`** — `{ provider, voice_id?,
  generated_voice_id? }` — as that sample's provenance: the platform it came from, the voice it was saved
  as, the preview it was; an uploaded sample has none. **`voice.active_reference`** may name the live
  `voice_samples` entry whose voice is in use: cleared when that entry is deleted, kept when it is
  archived, copied by copy-left only where the reader's version holds that entry after the copy, and
  ignored by a reader where it names no live entry. **`voice.prompt`** is the description a voice was
  designed from, and **`voice.audition_text`** what its previews say.
- **A visual treatment for a project and a folder** (§8.7, §10.1, §12.2, A.5, A.9, A.10, A.11). `visual_style`, a
  profile of the look — mood, medium, palette, the `look`, the grade, the lens and the camera, depth of
  field, lighting, texture, composition and a prompt of its own — on the project file and on any folder.
  What applies to a scene is the project's, then each folder's from the outermost in, then the Style the
  scene names, then what a person sets for one render: a leaf a profile leaves out is inherited, a list
  replaces the one it inherits, and a leaf removed from a profile is inherited again. A scene whose place
  in the script is ambiguous or cyclic is reported and takes the project's treatment, as though no folder
  held it. This is the one thing a folder passes to what it holds. A render made with a treatment records
  it in its batch item as **`treatment`** (§12.2, A.10): the leaves that applied and the document each came
  from.
- **A shot's camera character** (§11.1, A.4): `camera_character`, how the camera feels in that shot,
  beside `lens.dof`, its depth of field; a render of the shot prefers both to the treatment's.
- **A platform's hosts made per deployment** (§14.9): an entry of `hosts` may be `*.` and a domain of two
  labels or more — `*.salad.cloud` — standing for each host of exactly one label before it, and only as the
  endpoint a server provider resolved for the server a call is bound to, so that a provider's key reaches the
  servers it makes per deployment and no address a plugin names; a `*` anywhere else makes the file unusable.
- **The plugin interface's revision 2** (§14.4): a route's options and its quote, a job's lifecycle
  (`pending`, `collect`, `cancel`) under `ctx.job`, media sent by its grant and kept behind a handle, a
  call's destination, usage with its units and basis, `ctx.now`, and five interfaces — `reference-analysis`,
  `character-transform`, `style-analysis`, `voice` and `server-provider` — defined in
  `filmopen-plugin-api.json` at revision 2.

## Changes in 1.21

- **An entity's media in one container of entries** (§9.0, §6.3). `refs` and `voice.refs` are replaced by
  `media`, one object whose keys are **groups** and whose values are arrays of **entries**. The recommended
  groups are `reference_images`, `character_sheets`, `location_sheets`, `turnarounds`, `expressions`,
  `poses`, `details`, `materials`, `floor_plans`, `panoramas`, `lighting`, `motion_clips`, `sound_samples`,
  `voice_samples` and `inspirations`; others may be added, and `preview` and `media` are reserved. Every entry
  is an object: `reference`, a media reference; `batch` and `item`, the record and the item that made it,
  where one exists; `favorite`, `archived`, `deleted` and `note`, what the version decides about it; and any
  other key, which every writer keeps. A reference appears once in a document; a repeat, and an entry of
  another shape, are reported and left where they are. An archived entry is not shown and given to no model
  by default; a deleted one is never shown, and clears `preview` and the `picks` that named it. A writer adds
  media to the group a person chose, never to one chosen by the file's kind. The rest of `voice` stays.
  Nothing is released, so a reader need not read `refs`.
- **A batch item's `n` is its ordinal, and it names its `group`** (§12.2). `n` runs `1`, `2`, … in the order
  the outputs were given, unique within the record — a take's file number stays per purpose — and `group`
  names the group of the entity's `media` the output was put in, absent where none took it.
- **An import without its record is refused** (§12.3): an application that cannot write an import's batch
  record removes the files it wrote and says so, where 1.20 kept them.
- **`visited`** (§13.4): the author's commentary file records when they last had an entity's media on screen,
  per epoch, so that an application can mark what arrived since.

## Changes in 1.20

- **Every key and every token in lowercase `snake_case`** (§1.4). A key of any file of a project folder — the manifest, every document in `data/`, a batch record, a commentary file, an official pointer, a model or platform document — and of the model catalogue is spelled in lowercase words joined by underscores, and so is every enumerated token this specification defines; this edition renames every key and token that was camelCase. The header's `version_label` and `forked_from`; a project's `runtime_min`, and the `pixel_aspect` and `sample_rate` its `format` may add; a character's `appearance.height_cm`, `appearance.weight_kg`, `appearance.facial_hair`, `default_outfit` and `voice.provider_bindings`, and the `creator_notes` a location has too; a location's `sound.room_tone` and `time_of_day`, and the reference group `floor_plans` (§9.0); a scene's `story_day`, `target_duration_sec` and `location_epoch`; a shot's `duration_sec`, `movement_notes`, `speed_factor`, `lens.focal_mm`, `lighting.color_temp_k`, `composition.lead_room` and `composition.screen_direction`; a style's `color_temp_bias` and `lens_character`; a shot's or a cue's `place` (§11.3) — `offset_ms`, `in_ms`, `out_ms`, `gain_db`, `fade_in_ms`, `fade_out_ms` and `transition_in` — and a cue's `music.tempo_bpm` and the `offset_ms` of its `sync[]`; a script block's `start_ms` and `end_ms`, and a `title` block's `duration_ms`; an official pointer's `set_by` and `set_at`; a commentary file's `picked_at`, and an entry's `git_commit`; a batch's `source.duration_ms`, and an item's `cost_usd`, `duration_ms`, `elapsed_ms`, `mime_type`, `frame_count`, `sample_rate`, `original_name`, `job_id`, `seed_applied` and `inputs_by_name`, its `at`'s `start_ms` and `end_ms` and its `human`'s `selected_from`, `prompt_edited_by` and `manual_edits`; a platform's `base_url` and the `auth.kind` token `api_key`; and the deliverable tokens `first_frame` and `last_frame` wherever a deliverable is named — an item's `deliverable`, a shot's `deliverables` and `picks`, a clip's `from`. Each new spelling is the old camelCase one with its words split (`versionLabel` is now `version_label`); nothing is released, so a reader need not read the old spellings.
- **What keeps its owner's spelling** (§1.4): the plugin interface's names, which are JavaScript's — a hook's name, including as a key of a model or platform document whose hook's code is inline, and what code receives and answers, as `inputs_by_name` records it (§14.3, §14.4); the names a model gives its parameters, in its model document's `inputs` and `defaults`, as its code reads them in `ctx.params` and a batch records them in `params`; and what `params`, `x` and `plugins.<tag>` hold. The kinds `short-film` and `mini-series` keep their hyphens.

## Changes in 1.19

- **Sharing configuration in the manifest** (§4.4): optional `sync` names a Drive folder or a folder target; machine paths and credentials stay outside the film. Readers that do not sync ignore it.

## Changes in 1.18

- **Reference and resolution wording clarified** (§3, §6.3, §14.4): thumbnail paths are batch-item metadata relative to the project folder, never media references in `refs`, `preview` or `picks`; a plugin manifest resolves the viewer's pick before official, as §6.1 specifies.

## Changes in 1.17

- **One project folder, three flat subfolders** (§4): the manifest at the root, every document in `data/`, every local media file in `media/`, and derived pictures in `thumbnails/`. Media references name files in `media/`; the manifest no longer chooses another media root. Readers report misplaced and nested files without changing them. Plug-in code lives in the shared library or a developer's folder, and offline workflows and editing conform slots are exports outside the project.

## Changes in 1.16

- **An explicit reference group and an ordered selection** (§9.0): a writer may use the caller's named group and may insert a selection before the existing references while keeping its order.

## Changes in 1.15

- **A take's item records its inputs by name** (§12.2): **`inputs_by_name`**, the render's inputs under the input names of §14.8 — `first_frame`, `reference_images`, `audio`, … — each the descriptor the plugin received — `reference_images` an array of them, as §14.4 gives them — with what the import measured of it (§12.2, §12.3). `inputs[]` stays as it is, the flat list of media references every reader of 1.14 and before already reads. A flat list cannot say which reference was the first frame and which were references, so a take recorded with more than one input could not be made again without guessing.

## Changes in 1.14

Written ahead of FilmOpen's own code, on the owner's word of 20 September 2026, so that plugins and the application are written towards one text; FilmOpen's milestone 5-2b built it, and where a part is not built yet — a render that outlives a call, `ctx.upload`, the interfaces no feature runs — this text says so.

- **A plugin implements interfaces** (§14.4). An interface is a named set of functions; a manifest declares the ones it implements in **`implements`**, which takes the place of `hooks` and `provides`, and may declare several. The two tables of hooks become one table of interfaces. `platform` is new: the functions `run` and `request`, which other plugins call.
- **The shapes are defined once, as data** (§14.4): what every function receives and answers, and everything an application hands a plugin, are in the **interface definition** that accompanies this specification, `filmopen-plugin-api.json` — JSON Schema, one file per `api`, with a `revision` that grows when something is added. It is normative for those shapes; this section names the interfaces and states their rules, and restates no shape.
- **`status`** (§14.4): every plugin has it. It answers whether the plugin can do its work now — `ready`, `unconfigured`, `unavailable` or `degraded` — and starts, spends and installs nothing.
- **Who may call a function** (§14.4): an application, a person, or other plugins, said per function in the definition. `minRevision` in a manifest says the least the plugin needs.
- **An application chooses the plugin by the model asked for** (§14.4), prepares a render's request once, keeps a seed its caller gave, and records the request in the batch (§12.2) — from the plugin's answer only `stack` and `seed_applied: false`.
- **Where a key may go** (§14.4, §14.9): a platform file's **`paths`** limits, per host, the paths a request carrying the platform's credentials may reach, because a platform's hosts can serve more than models — fal's `api.fal.ai` creates keys for a key of its ADMIN scope — and a plugin allowed to use a key holds that key's authority. And an application says, in its own words, that a plugin which uses a key, or calls one that may use a key — its own, one granted to it, or one of a plugin it calls in turn — can spend on that account.
- **A render answers by `state`** (§14.4): `succeeded`, `pending` with a job the application is to ask about again — planned: an application that cannot wait for one yet says so — or `failed` with the problem as data. An output may say its `role`.
- **`ctx.log`** (§14.4) takes a line of a plugin author's own words, not only an event name; where an application keeps it is its own, and its own log of events is not the place.
- **Two fields an application reads for what they are** (§14.4): `x`, an object it reads nothing of, kept as written; and `capabilities.upload`, of which a user is told before the code first runs.

## Changes in 1.13

- **What a `render` receives** (§14.4): `inputs` by the input names of §14.8, each a descriptor of a piece of the film's media and never the media itself; a `seed` the application makes; and the entity the render is for. `kind` and `provides.models` say what sort of plugin it is and which catalogue entries it speaks for.
- **A plugin may call a function another plugin offers** (§14.4): `offers` names what may be called and `calls` what this plugin calls, `ctx.call("<tag>:<name>", args)` is the door, and the function runs as its owner.
- **A request that names a server, and an output on one** (§14.4): `ctx.http({ server, path })` goes to the address the user gave, with no credential and following no redirect off it, and a `render`'s output may be `{ server, path, mime }` for the application to download.
- **A `server` setting** (§14.4): the address of a server the user runs or chooses — a renderer on their own machine or on their network. It is always kept on one computer, whatever `scope` says, is not allowed under `entitySettings`, and its `default` may only name the computer itself, since any other address is one the user never typed.
- **A plugin's code may be several files** (§14.1, §14.4). `entry` is a file name, as it was, or an
  ordered list of them: each a `.js` file of the plugin's own folder named by a relative path, loaded
  in that order into one scope, the plugin being the last file's value. Nothing changes for a plugin
  written as one file.
- **What a user consents to is every file of the plugin's folder** (§14.4), not the manifest and the
  code alone: a workflow or a prompt in `assets/`, a platform file, a locale file. A change to any of
  them asks again.

## Changes in 1.12

- **Folders replace the three story levels** (§3, §5.3, §10.1). The script is folders and scenes. A
  **folder**, `fo_<tag>_<author>_v<n>.json`, holds a name, an optional `kind`, a synopsis, notes and the
  ordered list of what it contains; folders nest freely, to any depth, and a scene is the leaf. The types
  `se`, `ep` and `sq` leave the format, and with them the four list keys `seasons`, `episodes`,
  `sequences` and `scenes`: a reader gives the keys no meaning, and a file of one of those types is a
  file the grammar does not describe, reported like any other (§4.2). Nothing converts a 1.11 project.
- **`children`** (§8.5, §10.1) is the one list of the script, in the project file and in a folder. Because
  folders and scenes mix, every entry carries its type: a short stem `<type>_<tag>` (`sc_1`, `fo_f4`), or
  a full reference, which pins that version. The types an entry may name are `fo` and `sc`. A bare tag,
  an entry of another type, a second listing and a cycle are each reported, never guessed.
- **A folder's `kind`** (§10.1) is a word and not a rule: `season`, `installment`, `episode`, `act`,
  `arc`, `sequence`, `part`, `chapter`, or any other token. Nothing is enforced by it, and it is never
  part of a filename.
- **Nothing is inherited** (§6.1, §10.1, §10.2). A folder says nothing about what its scenes hold — no
  `epoch`, `cast`, `locations` or `styles` — and a scene says everything itself: one location, one epoch,
  its cast. §6.1's step 1 loses its fallback through what 1.11 called the enclosing unit.
- **`type` says what file this is, and `kind` what sort of thing it describes** (§7). The two keys that
  broke the rule are renamed: the manifest's locator is `"data": { "kind": "local", … }` (§4.4), and a
  placement's transition `"transition_in": { "kind": "dissolve", … }` (§11.3). The 1.11 spellings are not
  read.
- **A project's `kind` is optional** (§8.1) and names no levels: a word for people, for the OMC mapping
  and for a website.
- **A cue that spans scenes hangs under a folder** (§5.3, §11.2, A.6): its tag is `<folder>.<n>`, and it
  names the folder's version in `folder`, where 1.11 wrote `unit`; the appendix's table of a cue's keys
  says the same. A cue that carries both `folder` and `scene` hangs under the folder, `scene` saying
  whose block ids it cites.
- **A tag says nothing a person may change** (§17). A filename is permanent, so an application numbers
  the scenes (`1`, `2`, …) and the folders (`f1`, `f2`, …) it creates, and asks a person for the name
  alone.

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
  original name in `original_name` — not in the batch's `source.file`, which names the one work a whole
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

- **A fork starts without a version label** (§13.1). The copy leaves out `version_label` (and the 1.5
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
- **The version label never moves**, under either spelling: `version_label` and the 1.5 `label` (§7).
- **A scene's `epoch` is content, not a header field** (§7, §10.2). The header table's `epoch` row is
  for library entities, whose filename carries the epoch. A scene names the epoch it is set in, and a
  writer must not refuse the file for it.

## Changes in 1.6

- **The pick has its own key.** An author's pick is `pick` in their commentary file (§13.4). `prefer`
  is the 1.5 spelling: readers accept it and treat it as `pick` — `pick` wins when a file carries both
  — and a writer that rewrites the file writes `pick` and drops `prefer`.
- **A pick is dated.** `picked_at` records when the pick was made, in the same shape as `pick`: a
  timestamp for an entity without epochs, an object keyed by epoch otherwise (§13.4).
- **Official comes before the author's own version** (§6.1 step 2). An author who has said nothing is
  on official; an author who forked is on their fork, because forking records a pick (§13.1). The
  author's own highest version remains the fallback where nothing is official.
- **A pick can be abandoned.** Removing the pick returns the author to official; that is what an
  application does when the author abandons one (§13.4). A pick is still never cleared to leave the
  author with nothing.
- **Official pointers state their time.** `set_at` is required when an application writes a pointer, and
  is RFC 3339 UTC like every other timestamp (§13.2). Comparing it with `picked_at` tells an author that
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
- **Version label.** The common header gains an optional `version_label`: a short word for the version
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
  `forked_from` conventions as other spec entities. A remake can change language, title, delivery
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
migration database are required. Fractional frame rates added in 1.2 remain optional; an entity's media is
the `media` container of 1.21 (§9.0).

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

**Keys.** Every key of a file in a project folder — the manifest, every document in `data/`, a batch
record, a commentary file, an official pointer, a model or platform document — and of the model
catalogue (§14.6) is lowercase `snake_case`: `version_label`, `picked_at`, `offset_ms`. So is every
enumerated token this specification defines, such as `api_key` and `first_frame`. A token that is a name
— a tag, a handle, an epoch — follows the filename grammar (§5), and the kinds `short-film` and
`mini-series` keep their hyphens. Four things keep the spelling of whoever owns them: the plugin
interface's names, which are JavaScript's — a hook's name, as a function and as a key of a model or
platform document whose hook's code is inline, and what code receives and answers (§14.3, §14.4); the
names a model gives its parameters, in a model document's `inputs` and `defaults`, which its code reads
in `ctx.params`; what `params`, `x`, `metadata` and `plugins.<tag>` hold, which a provider, an application, a
plugin or a person writes and a reader keeps as it came; and XML attribute names in the ordered source trees
under `source.fdx`, including `source.fdx.document`, which retain their original spelling (§16.6).

**Times.** Every timestamp in the format — `created`, `updated` (§7), `set_at` (§13.2), `picked_at`,
`visited` and an entry's `at` (§13.4), a batch's `created` (§12.2) — is RFC 3339 in **UTC**, with the `Z` designator
and to the second: `2026-09-06T14:20:00Z`. Writers **MUST NOT** write a local offset. Readers accept
any RFC 3339 offset and compare instants, never strings. Clocks on different machines differ; a
timestamp is a note about when something happened, never a rule about precedence (§7).

---

## 2. Design principles

1. **Plain JSON, complete documents.** Every file fully describes one thing. There are no deltas,
   overlays, inheritance — but a film's visual treatment, which a project and a folder pass to what
   they hold (§8.7) — reserved key prefixes, canonical serialisation rules, or content-hash
   addressing of JSON. Any JSON tool works.
2. **One writer per file.** The author's handle is in the filename, and by convention nobody else edits
   that file. This reduces shared-folder conflicts and makes comparison meaningful. A
   delegated edit to someone else's file is still a valid file; a reader warns, and the maintainer
   decides.
3. **Self-describing filenames.** A filename states what a file is, whose it is, and which version.
   Documents live flat in `data/`, media flat in `media/`, and derived pictures in `thumbnails/` (§4).
   Story structure lives in the documents, never in directories.
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
| **project** | A folder holding a film, series or franchise and its alternatives. An authored `pj_` file in `data/` describes one complete project version. |
| **author** | A handle naming the writer of a file. A person (`maria`) or a workspace or plugin run within a person's identity (`maria.locale-th`). |
| **owner** | The person behind an author handle: its first segment. |
| **entity** | Anything described by one JSON file: character, location, scene, shot, model, … |
| **library entity** | A reusable thing with an **epoch** axis: character, outfit, location, prop, style, misc, document. |
| **epoch** | How a library entity appears at a point in the story: `30yo`, `pre-war`, `1990s`, `wrecked`. Declared in the project file, at least one; the first is the default epoch. Each epoch of an entity is a separate, complete file that shares the entity's tag. |
| **folder** | What groups the script, as a folder groups files: a spec entity with a name, an optional kind — season, episode, act, sequence, … — a synopsis, and the ordered list of the folders and scenes it holds (§10.1). Folders nest to any depth, and a scene is the leaf. A folder is a file, not a directory on disk. |
| **block** | One unit of script inside a scene: a line of dialogue, an action, a title. |
| **shot** | A visual generation spec covering one or more blocks. |
| **cue** | An audio generation spec: dialogue, narration, music, sound effect, ambience. |
| **take** | One rendered or imported output of a shot, cue or library entity. A media file. |
| **render batch** | The record of how a set of takes was produced, imported, or generated by a plugin. |
| **media reference** | A take stem, a file name in `media/`, or a URL (§6.3). |
| **media** | Inside an entity, the media its version keeps: named groups of entries, each entry a media reference with what the version decides about it (§9.0). |
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

A project folder contains a manifest at its root and three flat subfolders:

```
<project>/
  filmopen-project.json    the manifest: this folder is a film
  data/                    every JSON document, by its file name
  media/                   every media file, by its take name or its own name
  thumbnails/              tn_*.jpg, derived and made again when needed
```

The project has one project tag and one or more `pj_<tag>_<author>_v<n>.json` files in `data/`.
They are complete alternatives of that project, with an optional `pj_<tag>_official.json` pointer.
Every document is directly in `data/`, none deeper. External media may be referenced by URL.

Opening an explicit project file selects that version. When opening only a folder, a reader uses the
viewer's own pick for the project entity when they have recorded one (`pick` in their `cm_pj_` file,
§13.4); otherwise the project official pointer if present; otherwise the highest version if there is
exactly one project author handle. If several handles have project files and nothing decides, the
reader asks which one to open (or a command-line caller supplies the filename), rather than guessing.
An invalid official pointer is reported, and one naming a discarded version (§7) counts as none (§6.1).
The selected project supplies contributors, defaults,
language, tracks and story roots for that view or export. Remembering a selection otherwise is an
application preference, not a required film file.

A separate film with another project tag belongs in its own folder. A full entity stem is unique within the project;
readers report duplicates rather than choosing the first file found.

Creative content and decisions live in JSON. Images, audio, video, fonts and LUTs are external files
beside it. Plugin code is JavaScript. None of these is embedded into JSON to make the project "text".

### 4.2 The three folders

| Folder | Purpose |
|---|---|
| `data/` | Every JSON document: the project file, entities, official pointers, commentary and batch records. Flat and synced. |
| `media/` | Every take by its name, and any media file a person adds under its own name. Flat and synced. |
| `thumbnails/` | Display derivatives of the project's media: one JPEG for each media file whose basename without its extension is unique, `tn_<basename without extension>.jpg`, fitting within 300 × 300 (§6.3). May be deleted and made again; small enough to travel with the JSON. |

Apart from the manifest, a reader reports a file anywhere else, or nested in `data/` or `media/`, as a
file it does not understand. It **MUST NOT** move, rename or delete such a file. A file in
`thumbnails/` is derived and is not reported as an unknown file. Application caches and indexes may
live wherever the application chooses; neither they nor thumbnails are ever the only copy of creative content.

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

### 4.4 The project manifest

The file that says "this folder is a FilmOpen project" has a fixed name at the root. It records the
settings that belong to the folder itself, so a reader can recognise a project without scanning and
identify it by its content rather than the folder's name:

```
filmopen-project.json
```

```json
{
  "filmopen": 1,
  "tag": "cartographer"
}
```

| Field | Required | Meaning |
|---|---|---|
| `filmopen` | yes | The format version, as in every header (§7). |
| `tag` | yes | The project tag. The `data/pj_<tag>_…` files carry the same tag; a reader reports a disagreement. |
| `library` | no | Reserved: the shared library the project was seeded from (§14.5). Readers ignore it in this version. |
| `note` | no | Free text. |
| `sync` | no | Where the film is kept in step for sharing (§4.3): `target` is `drive`, `folder` or `filmopen`; for Drive, the shared folder's `id` and `name`; for FilmOpen Cloud, `id` is `<username>/<tag>`; never a path of one machine and never a credential; a reader that does not sync ignores it. |

The manifest is **not** an entity: it has no author, no version and no official pointer. It is
shared-write in the way `_official.json` files are (§4.3) and changes rarely. It **MUST NOT** hold
credentials, API keys or anything specific to one machine (§4.3).

**A project without a manifest** is still a project (readers **SHOULD** warn and continue using the
same three folders), so a folder hand-assembled from files opens. A writer that creates a project
**MUST** write the manifest. An older manifest's `data` key is an unknown field: kept and given no
meaning (§18.2).

**Why three folders.** The JSON of a whole feature is a few megabytes and diffs cleanly; its renders
are gigabytes and do not. A sync can treat `data/` and `media/` differently. Thumbnails are derived,
small enough to travel with the JSON, and let a collaborator browse before fetching the media.

---

## 5. Naming

### 5.1 Case and character set

Filenames are **lowercase ASCII**. macOS and Windows filesystems are case-insensitive by default; `r8Af0`
and `r8af0` are one file there and two files on Linux. Lowercase everywhere removes that class of bug.

### 5.2 Tokens

| Token | Rule | Examples |
|---|---|---|
| `type` | two lowercase letters (§5.3) | `ch` `lo` `sc` |
| `segment` | `[a-z0-9][a-z0-9-]{0,31}` — at most 32 characters, an allocated id excepted (below); naming advice below | `main-hero` `cafe` `seedance25` |
| `tag` | one or more segments joined by `.`; a dot expresses containment | `main-hero` `main-hero.suit` `5.1` `e2.1` |
| `epoch` | one segment or an allocated id; no reserved token | `john123-1` `maria-3` |
| `author` | `<owner>[.<workspace>]`; the owner is a username (§5.6), `[a-z0-9][a-z0-9-]{2,31}`; a person's workspace part is at most 20 characters; a derived handle (§5.6) takes its workspace part from the plug-in's tag, whose own bound binds it; reserved owner `official` | `john123` `maria.locale-th` `paul.wild` |
| `v<n>` | version, integer ≥ 1 | `v1` `v2` |
| `r<id>` | render batch: `r` + a segment, unique **per author**. Generated ids are lowercase hex digits — four for a render batch, eight where the id carries the time of an import (§12.3); people may name batches | `r8af0` `r68c8a1f0` `rstage0` |
| `<n>` | take number for one source and deliverable within a batch, integer ≥ 1 | `1` `2` |

A **tag segment** may also be an opaque UUID written in canonical lowercase hexadecimal,
`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Such a UUID is a single identity, in a filename and in a reference,
carries no containment meaning, and receives neither a length nor a grammar warning. This exception applies
only to entity tags, including tags embedded in official pointers, commentary and take names. Authors,
epochs, render batch IDs and project folder names retain the ordinary segment rule. Dots still express containment.

The 32-character limit applies to every ordinary segment; an allocated id may exceed it. Readers **SHOULD** report filesystem path-length limits
before writing rather than shorten names. Tags are unique **within a type**; the authors, epochs and
versions of one entity deliberately share its tag.

An **allocated id** is a segment `<owner>-<n>`: the owner part of the allocating author's handle,
a hyphen, and the decimal form of a positive integer without leading zeros, with at most ten digits.
The owner is everything before the last hyphen, so `john-1-2` is number 2 of owner `john-1`. The owner is a
username of up to 32 characters, so an allocated id has up to 43 (`<username>-<1..9999999999>`), and it is
accepted wherever an epoch, a tag segment or a reference's segment is.
An application gives out allocated ids and **SHOULD NOT** ask a person for one; it need not show them,
since people see labels and names. A segment within the grammar draws no warning on its length. No token is
reserved: `default` is an ordinary segment; the reserved author owner `official` remains as above.

### 5.3 Entity types

| Prefix | Entity | Grammar | Epoch |
|---|---|---|---|
| `pj` | project | spec; versions in `data/` | — |
| `ch` | character | library | yes |
| `of` | outfit | library; tag `<character>.<owner>-<n>`, an allocated id per character and author (§9.2), or an imported outfit's own tag | yes |
| `lo` | location | library; sub-areas as `<location>.<area>` | yes |
| `pr` | prop | library | yes |
| `st` | style | library | yes |
| `mi` | misc — fonts, logos, title cards, licensed audio, reference files | library | yes |
| `dc` | document — treatment, series bible, pitch, research | library | yes |
| `mo` | model — a generative or analysis model | spec | — |
| `pl` | platform — where models run | spec | — |
| `pg` | plugin manifest | spec | — |
| `fo` | folder — groups scenes and other folders (§10.1) | spec | — |
| `sc` | scene — contains the blocks | spec | — |
| `sh` | shot; tag `<scene>.<n>` | spec | — |
| `cu` | cue; tag `<scene>.<n>`, or `<folder>.<n>` when it spans scenes | spec | — |
| `cm` | commentary | `cm_<type>_<tag>_<author>.json` | — |
| `rd` | render batch | `rd_<id>_<author>.json` | — |
| `cp` | comp — media gathered to be posted (§12.7) | `cp_<id>_<author>.json` | — |
| `as` | assistant session — what one assistant chat wrote (§12.7) | `as_<id>_<author>.json` | — |

### 5.4 Grammars

```
library entity     <type>_<tag>_<epoch>_<author>_v<n>.json
spec entity        <type>_<tag>_<author>_v<n>.json
official pointer   <type>_<tag>[_<epoch>]_official.json
commentary         cm_<type>_<tag>_<author>.json
render batch       rd_<id>_<author>.json
comp               cp_<id>_<author>.json
assistant session  as_<id>_<author>.json
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

A person's **username** is `[a-z0-9][a-z0-9-]{2,31}`: 3 to 32 lowercase letters, digits and dashes, never
starting with a dash, and never `official`. It is the same grammar on a filmopen.ai account, so a username
chosen for a local project can be used online unchanged; `default` is valid. A handle's owner part is a
username.

An author handle may carry a second segment after a dot: `john123.locale-th`. The owner is the first
segment. Derived handles are used for:

- **Plugin runs.** A plugin invoked by `john123` writes under `john123.<plugin>[-<qualifier>]`, e.g.
  `john123.locale-th`. Everything one run produces starts at `v1`; a second run is `v2`. A run is
  therefore one glob: `*_john123.locale-th_v1.*`. The batch record lists the files (§12.4).
- **Personal workspaces.** `john123.wild` keeps an experiment from inflating the owner's main version
  numbers.

A reader treats a derived handle as a distinct author for versioning and as the owner's for warnings; a
take made under it is the owner's to delete (§9.0).
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
fo_s1_john123_v1.json                      a folder: season 1
fo_e2_john123_v1.json                      a folder: episode 2, which season 1 lists
fo_f1_john123_v1.json                      the first folder an application numbered (§17): a sequence in episode 2
sc_5_john123_v1.json                       scene 5 and its blocks
sc_5_john123.locale-th_v1.json             scene 5 as produced by a localisation plugin John ran
sh_5.1_john123_v1.json                     shot 1 of scene 5
cu_5.1_john123_v1.json                     cue 1 of scene 5
cu_e2.1_maria_v1.json                      a cue spanning the folder e2 — score
cm_ch_main-hero_maria.json                 Maria's commentary on main-hero
rd_8af0_maria.json                         Maria's render batch 8af0

cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1.png   concept sheet, take 1, Maria's render of John's v2
ff_sh_5.1_john123_v1_r8af0_maria_2.png              first frame, take 2, of shot 5.1
cl_sh_5.1_john123_v1_r8af0_maria_1.mp4              clip, take 1
vo_cu_5.1_john123_v1_r8af0_maria_1.wav              voice, take 1
ff_sh_5.1_john123_v1_r0001_john123_1.png            a frame John extracted from an existing film
front.png                                           an imported reference in media/, kept under its own name
```

---

## 6. References and resolution

Entities point at one another constantly. Three forms exist: short references and full references name
entities; media references name files.

### 6.1 Short reference

A tag: `"location": "cafe"`. The field determines the type. Resolved by the reader in three steps.

**Step 1 — Epoch.** Use the explicit epoch on the referencing entry if present; else the scene's epoch;
else the project's default epoch (§8.2). Nothing above a scene supplies one: a folder names no epoch
(§10.1). An outfit takes its character's resolved epoch unless one is given. If the epoch was chosen
**implicitly** and the entity has no file for it, fall back to the default epoch and show that fallback.
If the epoch was requested **explicitly** and does not exist, the reference is unresolved: report it;
never substitute a different age or state silently.

**A version carrying `discarded` (§7) is absent from every step** — never picked, never official, never an author's
highest, never the sole owner's: a `pick` that names one is reported and ignored (§18.2), as is an `_official.json`
that names one, and the steps go on as if it were not there. A full reference (§6.2) still reaches its file.

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
owner's highest version under their plain handle, else, where the owner has none under it, the highest under
their derived handles (§5.6): an abandoned `aaron.ai_v3` does not show over `aaron_v2`. Otherwise the reader
**MUST** report an unresolved reference rather than guess.

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
- a **media path** including extension — `front.png` — a file name in `media/` (§4.2), never a
  folder path and never relative to the referencing document;
- an **external URL** — `https://…` — naming bytes outside the folder. Expiring signed URLs and
  credentials are not media references.

Generated takes carry their source, batch and renderer in the name. Media a person puts in the folder by
hand keeps its own name and is referenced by path; a batch item (§12) may describe it. A plain reference
to a PNG or WAV is sufficient; no registry entry is required. In an entity's `media` a reference is an
entry's `reference` (§9.0). Media an *application* imports on a person's
behalf is named as a take of an import batch instead (§12.3), so that no upload overwrites another.

**Thumbnails.** A reader that shows many references at once needs a small picture it can load without
loading the full media file. One lives in the **project**
folder for each media file whose basename, without its extension, is unique:

```
thumbnails/tn_<basename without extension>.jpg
cs_ch_main-hero_30yo_john123_v2_r68c8a1f0_john123_1.png
  → thumbnails/tn_cs_ch_main-hero_30yo_john123_v2_r68c8a1f0_john123_1.jpg
```

a JPEG fitting within 300 × 300 (§4.2). A `thumbnails/` path is never a media reference in
`media`, `preview` or `picks`. It appears only as a batch item's `thumbnail` (§12.2), relative to
the **project** folder, which lets a clone without the media show the film. The flat
name rests on a media file's basename, extension aside, being unique — which the take grammar (§5.4) gives
every generated and every uploaded file, since the batch id and the take number are in the name. A
reference by path or URL whose basename is not unique that way (`front.png` beside
`front.wav`) has no thumbnail of its own. A thumbnail is a display derivative and never a model input by itself (§12.2), and
a reader that finds none shows a placeholder — a missing thumbnail is never an error.

### 6.4 Where each is used

- `children`, on the project file and on a folder, lists folders and scenes together, so no field
  determines the type and every entry carries its own: a **short stem** `<type>_<tag>` (`sc_1`, `fo_f4`)
  — the form a commentary file's `target` has (§13.4) — resolved as a short reference of that type, or a
  **full reference** (§8.5).
- Scenes, shots and cues use **short references** to library entities; a folder names none (§10.1). A
  scene's `props` may be tags or `{ "prop": "car", "epoch": "wrecked" }`; a scene may set `location_epoch`.
- A shot or cue **MAY** carry a full reference to the scene version its block ids belong to. Absent, it
  means the resolved scene of that tag. A cue that spans scenes names its folder in `folder` instead
  (§11.2).
- `forked_from`, `pick` and `on` use **full references** or, for `on`, media references.
- `picks`, a media entry's `reference` (§9.0), `preview`, `lut`, `file` and deliverable inputs use **media
  references**.

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
  "forked_from": "ch_main-hero_30yo_john123_v1",
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
| `version_label` | no | a short word for this version in version lists — `goth`, `classic` — at most 32 characters; never part of the filename or of any reference |
| `created` `updated` | no | RFC 3339 UTC (§1.4). `updated` is when the content last changed: a write sets it only where the document differs from the file it replaces outside `media`, `picks`, `preview`, `notes`, `creator_notes`, `render_stage`, `updated` and each prompt's `created` (§9) — and, inside every block, `media`, `output_duration_sec` and `updated` (§10.3). A fork keeps its source's; a fork written with changes, a new entity and a plug-in's rewrite are stamped now. A save that stamps a prompt carries its holder's current neighbours where its other content is the same (§9). A prompt whose words or writer changed, or whose `created` was removed, is stamped `created` with the same time as its holder's `updated` (§9). Informational; never used for precedence |
| `forked_from` | no | stem this file was copied from. A note; nothing resolves through it |
| `by` | no | plugin stem, when a plugin produced this version |
| `source` | no | origin of imported material: `{ "batch": "rd_0001_john123" }`, or the provenance of a screenplay import under its format's key — `fdx`, `fountain`, `pdf`, `docx`, `rtf`, `fadein` (§16.6); both may be present |
| `license` | no | SPDX identifier or CC URL for this entity's content, if it differs from the project's |
| `notes` | no | free text for people; excluded from prompts unless a user explicitly includes it |
| `x` | no | an object for application-specific data. Readers preserve it; the format ignores it |
| `metadata` | no | an object of **free-form attributes**: whatever the type's records (§7–§14, Appendix A) do not define — `{ "cameraBrand": "iPhone" }` — at any depth beneath it, any JSON. It may stand at the top of every document and in every block (§10.3); on the manifest, an official pointer and the separate headers of commentary, render batches, comps and sessions it is opaque and changes nothing of theirs. Readers preserve it; the format gives its keys no meaning. It is not a render record's `metadata`, which keeps its provider-data meaning (§12.2), and `x` and `plugins` keep theirs |
| `deleted` | no | present only as `true`: the entity is absent — at this version's epoch, or everywhere for a type whose filename carries none — for whoever has this version in use — a recycle bin, not a removal. The file stays; the entity comes back when the key is removed or another version is picked. See `discarded` for a version set aside |
| `discarded` | no | RFC 3339 UTC (§1.4) when written: the version is **set aside**. Present with any value it counts, and a value that is not a string is reported. It resolves for nobody (§6.1), is hidden from version lists by default, and keeps its number (§13.1). Discarding is for good: an application writes the key once and never removes it. Not a fork's content: a fork of a discarded version is not discarded; copy-left never moves it. Unlike `deleted`, which makes the entity absent for whoever has this version in use, it takes the version itself out of use |
| `plugins` | no | the values plug-ins keep in this version, keyed by plug-in tag: in a project file, a plug-in's project settings; in an entity's file, its `entitySettings` (§14.4). Part of the version — forked, compared and copied like any attribute — and written by an application on a person's behalf, never by a plug-in's code. The format does not interpret what a tag's object holds |

**`type` and `kind`.** The format keeps two words apart. ***`type` says what file this is*** — the two
letters of its name (§5.3), repeated in its header — ***and `kind` says what sort of thing it
describes***: a character's `principal`, a location's `interior`, a folder's `episode`, a cue's `music`, a
track's `av`, a batch's `import`, a project's `series`, a model's `video`, a
platform's `remote`, a transition's `dissolve` (§11.3). A `type` never
names a sort of thing, in a file or in an object inside one. The one other `type` the format writes is a
plug-in setting's (§14.4), which names the data type of a value — a string, a number — and not a sort of
thing.

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
  "runtime_min": 45,
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
  "children": ["fo_s1"],
  "license": "CC-BY-SA-4.0",
  "hooks": { "validate": "(ctx) => ctx.entity.type !== 'sc' || ctx.entity.blocks.length > 0 || 'empty scene'" }
}
```

### 8.1 Kind

`kind` ∈ `short-film` · `film` · `mini-series` · `series` (Short film, Feature film, Mini-series,
Series (ongoing)). It is **optional**: a word for people, for the OMC mapping (Appendix C) and for a
website, which says what the film is and decides nothing. It names no levels and chooses no structure —
a short film may keep its scenes in folders and a series may have none (§10.1) — so a film that starts
as one scene can become a mini-series without its files changing. Nothing depends on it. Readers treat
1.4's `franchise` as `series` and preserve an unknown kind.

### 8.2 Epochs

Every project declares its epochs here, **at least one**, each with a `label`, an `order` and a
`year` (an application asks for the year; a reader tolerates its absence, proposing no ages then). Readers order them by `order` (an entry without one comes first, in the file's order); a writer
that reorders them renumbers `order` from 1. The **first** epoch is the project's **default epoch**:
the one an implicit reference resolves to (§6.1) and the one a new library entity is created at. The
token `default` may be used as an epoch name. A new project starts with its creator's first allocated
id, `<owner>-1`, as its one epoch, and `next_epoch` 2.
When import describes a new era, its first unknown trimmed label, unless the list names the era's own label,
relabels that sole era if no filename or explicit content epoch uses its token (an implicit scene follows it),
keeping the token and clearing an omitted year; later labels append, and eras are never merged by year.

An epoch's token is an allocated id (§5.2). The author declaring a new epoch gives it their own
owner handle and one more than the highest number under that owner anywhere in the folder and
the library: every version of the project file, every filename and content field, every official
pointer and take, and every epoch key in commentary picks, pick times and visits. Another owner's
ids do not advance this author's number. The version's `next_epoch` also supplies a floor: it is
a whole number, the number that version's author gives the next new epoch, and is raised past
every identity given out in that version. It is never lowered by its author's writes, and copying
between versions never moves it. A fork does not carry the original author's `next_epoch`.
Identities are unique as far as the folder has been read: two writers of one owner acting at once from bases that do not see each other may declare one id, which the loader reports as a warning.
Owners' identity sets are disjoint; the workspace part does not participate in allocation.

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
and `color` are strings; a project **MAY** add `width` and `height` (whole numbers of pixels), `pixel_aspect` (a number), and audio `sample_rate` and `channels` (whole numbers). Colour primaries and transfer have no key of their own yet: new content says them under the document's `metadata` (§7).

`format.subtitles` is the look of every subtitle of the project (§10.3): `{ "font": "Noto Sans", "size": 48 }` —
`font` a font family's name, `size` an integer number of pixels at the output's height. Each value it does not
give is the application's default; a font the reader cannot find is replaced by its default, never refused.

The project lists its script — its **story roots** — in order in `children`: the folders and scenes at
the top of the script, in any mix. A short film can be `"children": ["sc_1", "sc_2"]` and needs no folder
at all; a series can list one folder for each season. A folder lists what it holds in a `children` of
its own, in the same grammar (§10.1).

**An entry carries its type**, because folders and scenes mix and no list key says which one it is:

| Entry | Example | Means |
|---|---|---|
| short stem, `<type>_<tag>` | `sc_1`, `fo_f4` | the folder or scene of that tag, resolved as a short reference of that type (§6.1) |
| full reference | `sc_5_maria_v1` | that version and no other: the entry **pins** it (§6.2) |

The types an entry may name are `fo` and `sc`, and no other: a shot or a cue is never listed, since it
hangs by its dotted tag (§5.3). A reader reports, and never guesses at:

- an entry that is a **bare tag** (`"5"`), which does not say whether it is a folder or a scene;
- an entry that names **another type** (`ch_kira`);
- a folder or scene the script, as the reader resolves it (§6.1), lists a **second time**, in the same
  list or in another: every listing is shown, and the second and later ones are reported;
- a folder that lists itself through any path, a **cycle**, which is not followed.

An entry that names a folder or scene the project does not have, or one whose every version is discarded (§7), is
**dropped silently**: a reader leaves it out with no warning; the file keeps it until its list is next changed. Any other entry that resolves to nothing is an unresolved reference like any other (§6.1).

Order comes from the list and from nothing else, never from sorting filenames. An absent or empty
`children` is valid: the script, or the folder, is empty. A folder or scene that no `children` reaches is
still a file of the project — it is not in the script, and a reader says so rather than hiding it.
Nothing else lists the script: 1.11's keys `seasons`, `episodes`, `sequences` and `scenes` have no
meaning, on a project file or anywhere.

### 8.6 Project alternatives and remakes

A project file is an ordinary spec entity: copy it into your author handle, set `forked_from`, and edit
its complete content. For example, `pj_cartographer_suda_v1.json` can name
`pj_cartographer_john123_v1` in `forked_from`, change `lang` to `th-TH`, and change its display name,
credits and story roots. The tag remains `cartographer` so these are alternatives of the same project.
No settings are inherited from `forked_from`.

Copying a project file neither copies nor translates all its descendants. Existing media references can
be reused. Full references in the copied root list can keep existing story units selected while the
remake is developed; switching those references or using author-first tags selects new story versions
when desired. A project language is a default, not an instruction to translate existing script text.
Users may copy other entities selectively, run a localisation plugin, or fork the Git repository.

### 8.7 Visual treatment

A film's look — its mood, its palette, its grain, its lens — is said once and inherited, where the
script's other attributes are said on each scene (§10.1). **`visual_style`** is a profile of that look,
on the project file and on any folder:

```json
"visual_style": {
  "camera": "16mm film camera",
  "camera_mount": "Handheld",
  "lens": "35mm",
  "depth_of_field_prompt": "f/4.5 medium",
  "color_grading": "Muted/desaturated",
  "description": "Cold coastal light; everything a little overexposed and far away.",
  "mood": "uneasy calm",
  "medium": "16mm colour negative",
  "look": { "grain": "medium", "halation": "slight", "contrast": "normal", "saturation": "low" },
  "palette": ["#2b2f33", "#6b7076", "#b9bcb8", "#d9c9a3"],
  "color_temp_bias": "cool",
  "lens_character": "soft edges, gentle flare",
  "depth_of_field": "moderate",
  "camera_character": "patient, observing",
  "lighting": "overcast daylight, practicals at night",
  "grading": { "shadows": "lifted, green-grey", "highlights": "clipped softly" },
  "prompts": { "treatment": { "positive": "overcast coastal light, 16mm grain, muted palette", "negative": "glossy, saturated" } }
}
```

Its leaves are Appendix A.11's; none is required, and a key a reader does not know is kept (§18.2). The first
five are the **primary leaves** — the camera, its mount, the lens, the depth of field and the grade, each a
person's words — which a render's prompt names; the rest describe the look in more detail.

`preset` is a reference, `<tag>:<entry id>`, to an entry of the catalogue a `prompt-builder` plugin
(§14.4) declares for `visual_style`: the style a person chose, stored. It is inherited like any leaf and
is not among a Style's shared leaves. A writer of prompts may use it; a render does not add its words. A
reference no reader can resolve — its plugin not on, its entry gone — is kept as written.

**What applies** to a scene, and to a render made for it, is composed in this order, each later profile
overriding the one before, **leaf by leaf**: the project's `visual_style`; each folder's, from the
outermost folder that holds the scene to the innermost (§8.5); the Style the scene names in `style`
(§10.2, §9.5), through the leaves it shares with the profile — `description`, `look`, `palette`,
`color_temp_bias`, `lens_character`, `prompts`; and what a person sets for one render, which is the
render's and not a file's. A render made for an entity outside the script — a character's picture —
takes the project's treatment and what the person sets.

- A leaf a profile leaves out is inherited. A list — `palette` — **replaces** the list it would inherit,
  whole. An object merges by its leaves.
- **A profile clears a leaf by leaving it out**: a leaf removed from a folder's profile is the parent's
  again. A leaf whose value is `null`, an empty string or an empty list is absent (§13.3), and so
  inherited.
- A scene whose place in the script is ambiguous — listed more than once (§8.5), or beneath a folder
  listed more than once or under itself — has **no place to inherit from**: a reader reports it, and the
  scene takes the project's treatment, its Style and what the person sets, as though no folder held it.
- An application that renders with a treatment composes the prompt with **the entity's own prompt first**,
  then each primary leaf that applies, in A.11's order and named in
  English whatever the application's language — `Camera: …`, `Camera mount: …`, `Lens: …`, `Depth of field: …`, `Color grading: …` — then the
  treatment's `prompts.treatment.positive`, each part trimmed and an empty one left out, joined by `; `; the negatives
  are the entity's then the treatment's. It never replaces the entity's prompt with the treatment's, nor writes
  the composition back into it, so that rendering again names nothing twice. It freezes what applied when the
  render is asked for,
  so that a treatment changed while the render runs changes the next render, not that one, and the batch
  item records what it froze as its `treatment` (§12.2).
- `visual_style` describes an intent. Its primary leaves are words a render's prompt is given, no claim of the
  camera, mount or lens a picture was made with nor of its grade, and an f-stop's words are no calculation of a
  depth of field; it holds no calibrated LUT and no CDL: those are a Style's `lut` and `cdl` (§9.5).

---

## 9. Library entities

A library entity is reusable across the story and has an epoch axis. Every one has the common header
and may carry `media`, `preview`, `picks` and a `prompts` object. The required content is small; Appendix A
lists the recommended optional vocabulary. An entity with no media yet is valid.

**Prompts.** Every holder of prompts carries one **`prompts`** object keyed by kind: a character's `reference`,
`sheet` and `voice`; a location's, an outfit's and a prop's `reference` and `sheet`; a Style's
`treatment` at its top, beside its other shared leaves (§9.5); a treatment's `treatment` under `visual_style`
(§8.7, A.11); and a block's `first_frame` and `last_frame` (§10.3). A prompt is an object:

```json
"prompts": {
  "reference": { "positive": "30yo woman, olive skin, …", "negative": "glossy", "created": "2026-10-18T09:12:03Z", "plugin": "fo-prompts", "writer": "basic" },
  "sheet":     { "positive": "front, left, right, back, …" },
  "voice":     { "positive": "A low, unhurried woman's voice with a slight rasp" }
}
```

- **`positive`** — the words a render is asked with; **`negative`**, optional, what it is asked to avoid.
- **`created`** — RFC 3339 UTC (§1.4), written by a writer, never by hand: where a prompt's words or `plugin`
  differ from the file it replaces, where it is new, or where its `created` was removed, it is stamped with the
  time written to its holder's `updated` — the file's for a prompt at the top or of the treatment, the block's for
  a block's. A prompt that differs only in its `created` is not content. Where a save stamps a prompt and its holder's
  content apart from its prompts is the same, each other prompt of that holder that was current is stamped the same
  time (`carried`), so that writing one prompt outdates none beside it; a change of the holder's content outdates them
  all, and a block's new words carry nothing beyond the block.
- **`plugin`** — the tag of the plug-in that wrote the words; absent when a person wrote them. A person's change
  of the words takes it away; words a plug-in rewrote — a description of a picture — are that plug-in's.
- **`writer`** — the id of the plug-in's writer that wrote the words, beside `plugin`: the pair names one of the
  writers the plug-in declares. Absent when a person wrote them, where a plug-in that is no writer rewrote them,
  and in a prompt written before writers had ids. It goes wherever `plugin` goes or changes.
- A prompt is **empty** where `positive` is blank or absent, **current** where `created` carries a zone and is not
  earlier than its holder's `updated` to the second, and **outdated** otherwise. A tool may offer to write an empty or
  outdated prompt before a render; what it writes is stamped as any other change.

**Media tokens.** A prompt's `positive` may name the pictures a render is to be shown, each as a token:

- a **reference prompt** (`prompts.reference`) its holder's `@inspiration-<n>`;
- a **sheet prompt** (`prompts.sheet`) its holder's `@inspiration-<n>` and `@reference-<n>`;
- a block's **frame prompts** (`first_frame`, `last_frame`) a character's `@<stem>:reference-<n>` and
  `@<stem>:character_sheet-<n>`, a location's `@<stem>:reference-<n>` and `@<stem>:location_sheet-<n>`, and a
  prop's `@<stem>:reference-<n>`, for the characters, locations and props of the film, each in its version in use (§6.1);
- the treatment and the voice none.

`<stem>` is an entity reference without its `@` (`ch_<tag>`, `lo_<tag>`, `pr_<tag>`, a tag being dotted
segments); `<n>` is a positive decimal without a leading zero. The token's word names its group: `inspiration` →
`inspirations`, `reference` → `reference_images`, `character_sheet` → `character_sheets`, `location_sheet` →
`location_sheets`. `n` is the entry's position among the group's entries that are neither deleted nor archived,
kept or still unreviewed, in file order, so a token's number can change when an entry is archived. A token repeated in the
words is one input. The file keeps the token; at render the application resolves each to its picture, sends the
pictures as the model's inputs in the order of first appearance, and writes each token in the model's own words
for that input (§14.7's `placeholders`). A token naming nothing is refused at render, with its reason.

A reader reads no `prompt` object, `voice.prompt` or `visual_style.prompt`: the spellings before 1.32 are not
read.

### 9.0 Media, picks and previews

`media` holds the media of this version: what a model is shown when generating the entity, and what a
person keeps beside it. It is one object whose keys are **groups** and whose values are arrays of
**entries**:

```json
{
  "media": {
    "character_sheets": [
      { "reference": "cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1", "batch": "rd_8af0_maria", "item": 9,
        "favorite": true }
    ],
    "turnarounds":   [ { "reference": "turnaround.png" } ],
    "voice_samples": [ { "reference": "voice-calm.wav" },
                       { "reference": "voice-raised.wav", "archived": true, "note": "too theatrical" } ]
  },
  "voice": { "description": "low, unhurried, slight rasp" },
  "preview": "front.png"
}
```

**Groups.** Each type has its places, in this order: a character `reference_images`, `character_sheets`,
`voice_samples`, `inspirations`, `motion_clips`; an outfit `reference_images`, `outfit_sheets`,
`inspirations`; a location `reference_images`, `location_sheets`, `inspirations`; a prop
`reference_images`, `prop_sheets`, `inspirations`; the project and a folder `reference_images`, their cover
image. A script block's are §10.3's. A group's name is a word in lowercase `snake_case` (§1.4); **`preview`
and `media` are reserved** and never name a group. Every group is an array, and each epoch file has its own
groups. A group holds what its name says: sounds in `voice_samples`, clips in `motion_clips`, pictures and
other files in every other place the list names, and any kind in a group it does not name. A file may hold a
group its type does not list: a reader keeps it; the app does not show it. An outfit has no voice.

**Entries.** Every entry is an object. Its **`reference`** is a media reference (§6.3): a take's stem, a
file name in `media/`, or an address. **`batch`** and **`item`** name the batch record, `rd_<id>_<author>`,
and the `n` of its item that made the media (§12.2), where a record exists; a file a person put in `media/`
under its own name, which no record describes, has neither. Four keys say what this version decides about
it: **`favorite`** and **`archived`**, present only as `true`; **`deleted`**, present only as `true`; and
**`note`**, the person's words about it. Eight describe the media: **`duration_ms`**, `0` for a still,
measured, else as reported, and absent where unknown; **`width`** and **`height`**; **`audio`**, on a clip,
`true` or `false` as measured once when it was inserted, and absent where the application could not measure it
(no engine, or a file put in `media/` by hand) — a clip without it plays its sound where the file has one;
**`stage`**, the stage
of the render's request (§12.2), absent on an upload — a render asked at a stage below its holder's `render_stage` is outdated by the stage, a holder's stage moved down outdating nothing, and choosing a stage is no change of content (§7); **`spans`**, on a block's entry, the blocks or extent
it covers, an object — `{ "blocks": ["bl_8", "bl_9"] }` or `{ "until": "end_of_scene" }` — whose shapes and the groups' rules are §10.3's; **`unreviewed`**, present only as `true`, on a render not yet kept or rejected — usable like a kept entry until deleted or archived; and
**`kept_at`**, when it was kept, an RFC 3339 instant, for display only. A fork copies the entries as content, `kept_at`
included. An entry of `voice_samples` may carry `voice_binding`, from a platform's voice or an upload kept
as a voice, and `audition_text`, the known words of that sample (§9.1). Any other key is kept by every writer: an application that
inserts or shows an entry may add what it likes, and a reader may ignore it — **a named exception** to the closed records of new content (§18.3): an entry, and a group beyond its type's list, stay open to an application's own keys and groups. What a take cost, or which
model made it, and every other fact of a render, is read from the record its entry names (§12.2), never
from the entry.

**Once per document.** A media reference appears at most once in a document, in one array — the blocks'
arrays included (§10.3). A reader that meets it again reports the repeat and reads its first place, in file
order, the entity's `media` before the blocks'; a writer adds a reference only
where no group of the document holds it — a take's stem and its file name being one reference (§6.3). Several documents may name one take — a fork copies the entries,
copy-left moves them between versions (§13.3), another author's version names the same takes — and a take
belongs to the version whose stem its name carries (§5.4), for which it was made. An entry that is not an
object with a non-empty string `reference`, a group that is not an array, and a key of `media` that cannot
name a group are reported and skipped by readers and left where they are by writers: nothing a reader
accepted is refused when the file is written again. A group whose value is `null` is absent, as an empty
value is (§13.3), and is not reported.

**Archived and deleted.** An archived entry is kept by the version but, by default, neither shown where a
person looks at the group nor given to a model with the entity's media; an application offers to show it.
A deleted entry is never shown and never given to a model: the entry stays, flagged, as the record that
the version dropped it, and `preview`, every `picks` value and a character's `voice.active_reference`
(§9.1) that named the reference are cleared with it. An application **MAY** then delete the take's file,
where it is the person's own take — its renderer is the person, or a workspace of theirs (§5.6), as a
plug-in's render under `<person>.<tag>` is — and no document of the project names it in an object of
`media` that is not deleted — an entry, a repeat a reader passes over and an object under a key that
cannot name a group alike, since a reader's skipping is no leave to lose the bytes; a shot's deliverable
inputs and a batch's `inputs` and `inputs_by_name` name what a render was made from and keep no file, and
the batch record stays as the receipt.

**Adding.** A writer that adds media on a person's behalf puts it in the group the person chose — **never in
one chosen by the file's kind** — adds only, and repeats no reference. It **MAY** insert a selection before
the existing entries, keeping the selection's order. Copy-left (§13.3) adds, group by group, the live
entries the reader's version lacks, and gives an entry both versions hold in one group the other's set
flags and note; it removes and clears nothing, and never copies a deleted entry, nor a `preview` that would
name an entry the reader's version holds deleted or one the copy does not bring.

**The stage its renders are asked at.** A version may say the stage its renders are asked at, `render_stage`:
`prototype`, `draft` or `final`, `prototype` where it is absent or of another shape. A writer writes it only
when a person sets it. A fork keeps it, as any content; a comparison does not show it. Every render records
the stage it was asked at in its record's `request` (§12.2), whatever the version says later.

`preview` names the media shown for this entity in a library view. Absent, a reader may use the first
sheet or image, then an image pick, then a placeholder. A preview is not automatically a model input. A
writer **MAY** set `preview` to the first picture it adds when the file has none, and **MUST NOT** change a
`preview` the author has set.

`picks` selects generated takes by deliverable; a value is one media reference or an array when several
frames are chosen. A reference used in several files reuses the bytes and nothing else.

### 9.1 Character `ch`

An automatically created version at another era clears the look, outfit choice, summary and picture media with their prompts, keeps voice, inspirations and other character data, and fills age from its own birth date or keeps the copied age when that gives none.

```json
{
  "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo", "author": "john123", "v": 2,
  "name": "Kira Voss",
  "kind": "principal",
  "birth_date": "1999-04-12",
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
  "voice": { "description": "low, unhurried, slight rasp", "pitch": "low", "pace": "slow", "accent": "Lisbon", "lang": "pt-BR" },
  "relationships": [{ "character": "spouse", "relation": "married to, separating" }],
  "prompts": { "reference": {
    "positive": "30yo woman, olive skin, black shoulder-length hair, lean athletic build, burn scar left forearm, upright posture",
    "negative": "cartoon, plastic skin, over-smoothed"
  } },
  "creator_notes": "Never smiles with teeth. Keep the scar visible in any shot showing the left arm.",
  "picks": { "sheet": "cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1" },
  "media": {
    "character_sheets": [ { "reference": "cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1", "batch": "rd_8af0_maria", "item": 9 } ],
    "voice_samples": [ { "reference": "voice-calm.wav" } ]
  },
  "preview": "cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1"
}
```

- `kind` ∈ `principal` · `supporting` · `extra` · `group` · `narrator` · `creature` · `animal`. A `group`
  is a crowd described once.
- `birth_date` — optional, a string `YYYY` (`"1988"`), `YYYY-MM` (`"1988-04"`) or `YYYY-MM-DD` (`"1988-04-12"`),
  the month 01–12 and the day 01–31, carried in each
  epoch file. When it is set or changed, an application fills `appearance.age` with the epoch's calendar year
  minus the birth year; a month or a full date uses its year. A malformed date, no epoch year, a birth year after the
  epoch, or an `appearance` that is not an object leaves the stored age as it is. No other ordinary write
  recomputes age, and there is no load-time rewrite.
- `appearance.age` — optional, the apparent age at the file's epoch, stored in each epoch file: a whole
  number (`31`), a phrase (`"late thirties"`), or exactly `"N (YYYY)"` (`"31 (1999)"`: the age, one space and
  the year of birth in parentheses), which reads as the age N; anything else, `"31 (1999) "` included, is a
  phrase. The legacy `"N (YYYY)"` remains a source of a birth year when `birth_date` is absent. When a
  character's file is made at another epoch, an application fills a numeric age from the copy's birth data,
  using the version in use at the project's default epoch as a second source when absent: birth year 1999
  gives `41` at 2040. Otherwise it keeps the age the copy carried. Where the copied `appearance` is not an object — a sentence,
  a list — there is no age to fill: the content is kept as written. The age is stored, not derived: an
  epoch's year edited later recomputes no stored age. The older `birthdate` spelling stays an unknown key.
- `aliases` — every name a script or transcript might use. Essential for import and for Fountain export.
- `appearance`, `personality`, `voice` — **defined records** (A.1): new content holds to their keys, each value of
  its shape, and says an attribute they lack under the document's `metadata` (§7, §18.3). None of their keys is
  required. A file on disk carrying other keys is read as it is, its keys kept and warned about (§18.2).
- `voice` holds how the character sounds — `description`, `timbre`, `pitch`, `pace`, `accent`, `lang` —
  and the voice a platform speaks it with:
  - **`provider_bindings`** — platform tag → the platform's voice id: the **active binding**, the voice
    speech uses on that platform. It changes only when a person chooses a voice — keeps a designed voice,
    or picks the voice of a sample; deleting or archiving media never changes it, and nothing deletes a
    platform's voice because a file or an entry went.
  - An entry of `media.voice_samples` (§9.0) may carry **`voice_binding`**: `{ "provider", "voice_id"?,
    "generated_voice_id"? }` — the platform tag the sample came from, the persistent voice id it was
    saved as, and the id of the temporary preview it was. It records **that sample's provenance**; a
    preview's `generated_voice_id` is never a voice for speech. An uploaded sample has no binding until it is
    kept as a voice; then it carries the chosen `provider` and `voice_id`, with no `generated_voice_id`.
  - An entry may carry **`audition_text`**, the known words of that sample. Keeping a voice with known words
    writes them on that entry and on `voice.audition_text` for older readers. Without known words, the entry
    retains only its own text: another sample's words are never copied from the character field. The entry and
    its text travel whole when copy-left brings a sample; an entry already held keeps its own text (§13.3).
  - **`active_reference`** — the `reference` of the live `voice_samples` entry whose voice is in use. It
    is cleared when that entry is deleted and kept when it is archived; copy-left copies it only where the
    reader's version holds that entry, not deleted, once the copy is done (§13.3); a reader ignores it
    where it names no live entry, and never takes another sample in its place. Where the sample it names
    was kept as another voice than `provider_bindings` holds — a copy-left moved one and not the other —
    `provider_bindings` is the voice speech uses, and an application says so rather than choose.
  - **`audition_text`** — what a designed voice's previews say. The description a voice is designed from is
    the character's `prompts.voice` (§9), not a key of `voice`; keeping a voice writes no prompt.

  ```json
  "voice": {
    "description": "low, unhurried, slight rasp", "pitch": "low", "pace": "slow",
    "provider_bindings": { "elevenlabs": "v0a1b2c3" },
    "active_reference": "vo_ch_main-hero_30yo_john123_v2_r9c10_john123.fo-elevenlabs_2"
  },
  "media": {
    "voice_samples": [
      { "reference": "voice-calm.wav" },
      { "reference": "vo_ch_main-hero_30yo_john123_v2_r9c10_john123.fo-elevenlabs_2", "batch": "rd_9c10_john123.fo-elevenlabs",
        "item": 2, "voice_binding": { "provider": "elevenlabs", "voice_id": "v0a1b2c3", "generated_voice_id": "g7d8e9" } }
    ]
  }
  ```
- `creator_notes` — for people; excluded from prompts unless a user explicitly includes it.

### 9.2 Outfit `of`

An outfit's tag is `<character>.<owner>-<n>`: the character's complete tag, a dot, and an allocated
id (§5.2) given out per character by the author who creates the outfit. Its number is one more
than the highest under that owner for that character across every epoch and version, including
library files, surviving takes, official pointers and other authors' commentary targets. A deleted
outfit whose references survive still counts. The same tag in another epoch is the same outfit
in that epoch; labels and names, rather than the hidden id, identify it to people.

```json
{
  "filmopen": 1, "type": "of", "tag": "main-hero.john123-1", "epoch": "30yo", "author": "john123", "v": 1,
  "name": "Charcoal business suit",
  "garments": [
    { "item": "suit jacket", "color": "charcoal", "material": "wool", "fit": "tailored", "condition": "worn at the cuffs" },
    { "item": "shirt", "color": "white", "notes": "open collar, no tie" },
    { "item": "boots", "color": "brown", "material": "leather", "condition": "scuffed" }
  ],
  "accessories": ["steel wristwatch, left wrist"],
  "prompts": { "reference": { "positive": "charcoal two-button suit, white open-collar shirt, worn brown leather boots, steel wristwatch" } },
  "picks": { "sheet": "cs_of_main-hero.john123-1_30yo_john123_v1_r7c21_john123_1" }
}
```

An imported outfit whose source identifies no character may use its own tag without a character
prefix. It is an unassigned outfit, not an invented character's clothing. A reader shows it with the
warnings of any outfit without a character, its missing parent and its legacy id, until it is given one. `description` may hold the source's description; `source.fdx` retains its
production category and original definition (§16.6). Scene-level `outfits` records its explicit uses
without claiming which character wears it.

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
  "sound": { "room_tone": "tiled, lively reverb", "ambience": "espresso machine, harbour gulls, distant traffic" },
  "areas": ["cafe.bar", "cafe.kitchen"],
  "prompts": { "reference": { "positive": "1990s Lisbon café interior, tiled floor, zinc bar, ceiling fans, steamed windows, harbour beyond" } },
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
  "prompts": { "reference": { "positive": "hand-drawn nautical chart, yellowed linen paper, sepia ink, fold creases, water stain" } },
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
  "prompts": { "treatment": { "positive": "desaturated, cold grey palette, high contrast, 16mm grain, handheld",
              "negative": "saturated, clean, glossy" } },
  "cdl": { "slope": [0.95, 0.98, 1.05], "offset": [-0.02, -0.02, 0.0], "power": [1.1, 1.1, 1.05], "saturation": 0.6 },
  "lut": "style/war-grade/war-grade.cube",
  "media": { "reference_images": [ { "reference": "cs_st_war-grade_default_maria_v1_r8af0_maria_1", "batch": "rd_8af0_maria", "item": 10 } ] }
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

### 10.1 Folders `fo`

The script is **folders and scenes**. A scene (§10.2) is the file that holds the blocks; a folder groups
scenes and other folders, as a folder groups files. Folders nest freely and to any depth, and nothing
requires one: a short film of four scenes lists its four scenes in the project file (§8.5), and a
mini-series may want nothing but episodes. A folder is a **file, not a directory on disk** — all its
files sit directly in `data/`, and the script's structure lives in their `children` lists (§2, principle 3).

```json
{
  "filmopen": 1, "type": "fo", "tag": "f3", "author": "john123", "v": 1,
  "name": "Act I — The harbour",
  "kind": "act",
  "synopsis": "Kira arrives and finds the first altered chart.",
  "notes": "Cold open, no score until the reveal.",
  "children": ["sc_1", "fo_f4", "sc_5_maria_v1"],
  "created": "2026-09-18T09:00:00Z", "updated": "2026-09-18T09:00:00Z"
}
```

A folder is a spec entity like any other: versioned, forked, named official by `fo_<tag>_official.json`,
picked and compared (§13). `name` is required, as for every entity (§7); everything else is optional.

**`children`** is the ordered list of what the folder holds, in the grammar of §8.5: short stems or full
references, of type `fo` or `sc`. Order comes from the list and from nothing else, and a folder without
`children` is empty. What a reader reports — a bare tag, another type, a second listing, a cycle — is
§8.5's. A reproducible timeline export follows these lists (§15.2).

**`kind`** says what the folder means to people, to plug-ins and to an export. Recommended tokens:
`season` · `installment` · `episode` · `act` · `arc` · `sequence` · `part` · `chapter`. A file may name
another token, which a reader keeps and shows as written, and a folder may have none. **The kind is a
word, not a rule**: nothing is enforced by it — a season may hold seasons, a chapter may sit beside a
scene — and it is never part of a filename, since it is a person's to change (§17).

**A folder says nothing about what its scenes hold.** It carries no `epoch`, `cast`, `locations` or
`styles`, and no scene inherits anything from the folders above it but their **visual treatment**,
`visual_style` (§8.7): everything else about a scene is said on the scene (§10.2). A reader that meets
such a key on a folder keeps it, as it keeps any key it does not know (§18.2), and gives it no meaning. A
folder holds no blocks. What the scenes beneath a folder use — their characters, locations and epochs — a
reader can derive; it is never stored.

A cue that spans scenes hangs under a folder (§11.2).

### 10.2 Scene `sc`

A scene is one time and one place. Its file holds the **blocks** — the script — in order. Everything
about what a scene holds is said **on the scene**: it names **one** `location` and **one** `epoch`, and
lists its `cast`. Nothing is inherited from the folders above it but their visual treatment (§8.7,
§10.1), so a scene moved to another folder means what it meant before, in the look of its new place.

```json
{
  "filmopen": 1, "type": "sc", "tag": "5", "author": "john123", "v": 1,
  "name": "The archive",
  "location": "archive", "epoch": "mid-war",
  "story_day": 3, "time": "night", "weather": "rain against the skylight",
  "cast": [{ "character": "main-hero", "epoch": "30yo", "outfit": "main-hero.suit" }],
  "props": [{ "prop": "chart", "epoch": "default" }],
  "style": "war-grade",
  "synopsis": "Kira compares the two charts and realises the coastline moved.",
  "purpose": "First proof. Turns the mystery from doubt to certainty.",
  "target_duration_sec": 165,
  "shots": ["5.1", "5.2"],
  "cues": ["5.1", "5.2", "5.3"],
  "blocks": [
    { "id": "bl_1", "action": "Kira spreads both charts across the reading table." },
    { "id": "bl_2", "character": "main-hero", "dialogue": "The bay was here last spring.",
      "direction": "flat disbelief, does not look up", "duration_sec": 4.5, "output_duration_sec": 4.2,
      "beats": [ { "position": "before_dialogue", "description": "looks down at the two coastlines", "duration_sec": 1.5 },
                 { "position": "during_dialogue", "description": "traces the old bay with one finger" } ] },
    { "id": "bl_3", "action": "Behind her, the window flashes white. A second later, the glass goes." },
    { "id": "bl_4", "character": "main-hero", "dialogue": "Not now.", "direction": "(O.S.)",
      "action": "She does not turn." },
    { "id": "bl_5", "action": "CUT TO:" }
  ],
  "next_block": 7,
  "notes": "Consider cutting the bay line if pacing drags."
}
```

`story_day` is the script supervisor's continuity day. `purpose` states what the scene does for the
story, which is the single most useful field for an AI reading the project. `shots` and `cues` fix the
order of the scene's shots and cues; absent, natural tag order applies. A scene's `epoch` is the time it
is set in, and the epoch its references resolve at (§6.1); what may differ from it is said beside it, on
the scene: a cast entry's own `epoch` — the character's age in a scene set at another time — and its
`outfit`, a prop's epoch (§6.4), and `location_epoch`, which overrides the scene epoch for the location
alone.

A scene imported from a screenplay may additionally carry `scene_heading`, the original heading,
and `scene_number`, the source's printed number as a string, including letters such as `2A`. These are
informational and never determine identity or ordering. `outfits` is an ordered list of unassigned or
assigned outfit tags explicitly used in the scene. `resources` lists other production resources as typed
short stems, such as `mi_smoke`; `props`, `cast` and `location` retain their existing meanings. No item is
inferred merely because a noun occurs in prose.

### 10.3 Blocks

A scene's script is its `blocks`: an ordered list of blocks, each one unit of the screenplay — what a
character says, how they say it, and what happens. **A block may hold dialogue and action at once, and has
one speaker at most.**

| Field | Meaning |
|---|---|
| `id` | `bl_<n>`; the block's address in this file, by which cues, shots and copy-left name it (§11, §13.3). **Never renumbered, never given out twice in one file, and never shown to a person.** |
| `character` | the one speaker: a character's short reference; absent where nobody speaks |
| `dialogue` | what the speaker says |
| `direction` | the note for the actor — the screenplay parenthetical. Fountain's `(O.S.)`, `(V.O.)` and `(dual)` are written at its head (§10.4) |
| `action` | what happens |
| `duration_sec` | the seconds the writer asks the block to last, a number greater than zero; absent means *auto* |
| `beats` | its beats in their order: instructions that guide the block's video, each `{position?, description?, duration_sec?}` — `position` `before_dialogue`, `during_dialogue` or `after_dialogue`, meaningful only where the block has dialogue — a new beat there starts `during_dialogue`, one elsewhere has none — and kept as written otherwise, another word included; `description` what happens, @-mentions as in `action`; `duration_sec` its seconds, greater than zero, as the block's own. Free order; a *before* after a *during*, or seconds adding up to more than the block's `duration_sec`, is a writer's warning, never refused. Addressed by place, no id; part of the block's text, so it travels with the block (copy-left, exchange); an empty list is not written |
| `subtitles` | its subtitles in their order: the lines shown over the picture while the block plays, each `{position?, text?, duration_sec?}` — `position` as a beat's, a label only, a new subtitle starting `during_dialogue` where the block has dialogue and with none elsewhere; `text` the words shown, exactly as written, a newline a line break; `duration_sec` its seconds, greater than zero. Timed as the beats are: in order from the block's start, each for its `duration_sec`, those without one sharing what is left, cut at the block's end, any past it not shown. Free order; addressed by place, no id; part of the block's text, so it travels with the block (copy-left, exchange); an empty list is not written |
| `output_duration_sec` | the seconds the scene's output gives the block, a number greater than zero, set by a person or an assistant; **absent means the application's rule decides**, and nothing writes a derived value here. A value that is not a number greater than zero reads as absent and is kept as it is. Not the block's text: not cleared when the dialogue changes |
| `lang` | BCP 47 override for this block |
| `prompts` | the block's prompts, `first_frame`, `last_frame` and `clip` (its clip prompt), each a prompt of §9; part of its text |
| `updated` | when the block's text — `character`, `dialogue`, `direction`, `action`, `lang`, `duration_sec`, `beats`, `subtitles`, `prompts` apart from each prompt's `created` — last changed: RFC 3339 UTC (§1.4), stamped by a writer when that text differs from the block of the same `id` in the file it replaces, and on a new block; never for its `media` or `output_duration_sec`. A block without one has not changed since it was written |
| `media` | the block's media: an object of the six groups below, each an array of §9.0's entries; `updated` never moves for it |
| `start_ms` `end_ms` | observed timing, typically from import |
| `screenplay_element` | optional source paragraph category in snake_case: `action`, `character`, `dialogue`, `parenthetical`, `transition`, `shot`, `general`, `lyrics`, `note`, or another source element's normalized name; informational, never the retired `kind` field |
| `dual_dialogue` | optional identifier grouping parallel speech from the source screenplay; shared by its member blocks, not a timing measurement |
| `metadata` | the block's free-form attributes, as a document's (§7): any JSON the block's other keys do not define |
| `source` | optional provenance of a screenplay import, under its format's key: `source.fdx` identifies the source paragraph and its original element spelling; `source.fountain`, `source.pdf`, `source.docx`, `source.rtf` and `source.fadein` its first source place (§16.6) |

A block may hold any of `dialogue`, `direction` and `action`, or none of them: an empty block is still a
block. A `dialogue` with no `character` is kept and shown. Every key a reader does not know is kept as it
is in the file (§18.2); new content holds to this table and says anything else under the block's `metadata` (§18.3).

**A block's media and `spans`.** An entry of a block's `media` may say what it covers or how long it plays,
in `spans`, one of two shapes; absent means the owning block alone.

| Shape | Meaning |
|---|---|
| `{ "blocks": ["bl_7", "bl_8"] }` | the consecutive blocks, from the owning block, that the media renders: a non-empty list of ids. A change to a covered block marks the render out of date, and so does a scene whose blocks from the first to the last are no longer exactly these |
| `{ "until": "end_of_scene" }` · `{ "until": { "block": "bl_14" } }` · `{ "until": { "seconds": 300 } }` | the extent it plays over: to the end of the scene, to a block, or for a number of seconds greater than zero. No block's change affects it |

| Group | `spans` allowed | A new entry's |
|---|---|---|
| `clips` | `blocks` | none |
| `first_frames` `last_frames` `voice_lines` | none: the owning block alone | none |
| `music` `sound_effects` | `until` or `blocks` | `{ "until": "end_of_scene" }` |

Exactly one of `blocks` and `until`. Anything else — both, neither, an empty list, a shape the group does not
allow — reads as absent, the owning block alone, and is kept in the file as it is.

**A clip that spans blocks plays across them**: a clip whose `blocks` name a later block of the script plays from
its own block's start to the end of the last block it covers, never past the scene's end, and does not set its own
block's output duration. A covered block's own clip is drawn over it for as long as that clip lasts, the spanning
clip showing again after it, and both sounds play where they overlap; where two spanning clips cover one block, the
one whose block is nearer shows. A spanning clip shorter than its blocks holds its last frame.

**The number a new block takes.** A scene's `next_block` is the number the next new block takes. A new
block takes the larger of `next_block` and one more than the highest `bl_<n>` the scene holds — 1 in a
scene with neither — and `next_block` is raised past it; deleting a block leaves the number the next one
takes where it was. So **a number is never given out twice in a file**: a cue that still names a deleted
block (§11.2) never finds a stranger under its id — the example of §10.2 deleted its sixth block and keeps
`next_block` at 7. Absent, `next_block` is one more than the highest number present, which is what a
reader falls back to for a file written by hand or changed by a copy (§13.3).

Rules:

- **Order is array order.**
- **Moving a block to another scene copies it there under that scene's next number**, every other key kept
  — `output_duration_sec` among them — and then removes it from the first. An application writes the target
  first and removes the block only once that write has landed, so that a failure between the two writes
  leaves the block in **both** scenes, never in neither.
- **Two authors' versions of a scene align by id** with no diff algorithm (§13.3). Two forks that
  independently invent the same id are not the same line; a reader shows the content, and the Git base
  when available, rather than assuming.
- **An id that names two blocks in one file** addresses neither for a cue, a copy or an agent, none of which can
  tell which is meant. A reader shows both; an editor may leave the first editable by hand, and keeps every later
  one locked — removable, not changed — until the file is mended.
- **A block with no id** is read and shown, and an editor gives it the next number the first time it
  changes it.

**A block written before 1.23**, with `kind` and `text`, reads by one rule: its `text` is the `dialogue`
where its `kind` was `dialogue`, `narration` or `lyric`, and the `action` otherwise; `offscreen`,
`voiceover` and `dual` are `(O.S.)`, `(V.O.)` and `(dual)`, in that order, at the head of its
`direction`; a title's `duration_ms` is its `duration_sec`; and `kind` means nothing. An action's
`characters` and a title's `font` and `position` are kept as keys a reader does not know. A reader reports
nothing about such a block, and an editor writes it in 1.23's shape the first time it changes it and never
before: a scene nobody touched keeps its blocks as they were, and a copy (§13.3) moves such a block as it
is. A block that holds a `text` beside a `dialogue` or an `action` is not read as a block, since either
reading would be a guess.

### 10.4 Fountain correspondence

| Fountain | FilmOpen |
|---|---|
| Scene Heading `INT. CAFE – NIGHT` | scene `location` (+ `kind`), `time` |
| Action | block `action` |
| Character + Dialogue | block `character`, via `aliases`, and `dialogue` |
| Parenthetical | `direction` |
| `(O.S.)` `(V.O.)` | `(O.S.)` and `(V.O.)` at the head of `direction` |
| Dual dialogue `^` | `(dual)` at the head of `direction` |
| Transition | block `action` |
| Centered text | block `action` |
| Lyrics `~` | block `dialogue` |
| Note `[[ ]]` | block `action` |
| Section `#` | folders, nested as the sections are |
| Synopsis `=` | `synopsis` |

The screenplay's *words* round-trip. What sort of line a transition, a centred title, a lyric or a note
was does not unless `screenplay_element` records it: the content still arrives as actions and dialogue. A numbered
heading's number is the scene's `scene_number`, and an import keeps the title page in `source.fountain.title_page`
(§16.6). Emphasis, forced elements, page breaks and boneyards are not represented; an importer
or exporter reports them, and a `dc` may keep the original text. Shot and sound information, which Fountain
cannot express, lives in shots and cues.

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
  "lens": { "focal_mm": 50, "aperture": 2.0, "dof": "shallow" },
  "lighting": { "key": { "direction": "side", "quality": "hard" }, "style": "low-key", "color_temp_k": 3200,
                "practicals": ["desk lamp"], "notes": "window flash as a single hard white hit from behind" },
  "composition": { "headroom": "tight", "eyeline": "down-left", "screen_direction": "facing right" },
  "duration_sec": 5,
  "continuity": ["chart still unfolded on the table", "scar visible, left forearm"],
  "vfx": "glass shatter, practical-looking, no debris toward lens",
  "deliverables": {
    "first_frame": { "model": "nanobanana", "prompt": "…", "refs": ["cs_ch_main-hero_30yo_john123_v2_r8af0_maria_1"] },
    "clip":       { "model": "seedance25", "prompt": "…", "from": "first_frame",
                    "inputs": ["vo_cu_5.3_john123_v1_r8af6_maria_1"] }
  },
  "place": { "track": "pic", "after": "sh_5.1", "offset_ms": 0, "in_ms": 0, "out_ms": 5000 },
  "picks": { "first_frame": "ff_sh_5.2_john123_v1_r8af3_maria_1",
             "clip":       "cl_sh_5.2_john123_v1_r8af4_maria_1" }
}
```

`size`, `angle`, `movement`, `lens`, `lighting`, `composition` and `camera_character` use the vocabulary
in Appendix A.4; all are optional. `camera_character` — how the camera feels in this shot, restless or
patient, intimate or observing: a character, where `movement` is a move — and `lens.dof`, its depth of
field, are the shot's own: a render of the shot prefers them to the treatment's `camera_character` and
`depth_of_field` (§8.7). `scene` is a full reference to the scene version the block ids belong to (§6.4).
In a deliverable, `from` names a preceding deliverable of the same shot and `inputs` names other media it
depends on — a chosen dialogue take for lip sync, for instance; the batch records what was actually used.
A still image placed as a shot takes its hold duration from `duration_sec`.

### 11.2 Cue `cu`

An audio generation spec. A cue attaches to a scene, or to a folder when it spans scenes.

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
  "place": { "track": "dx", "with": "sh_5.1", "offset_ms": 400, "gain_db": -3 },
  "picks": { "voice": "vo_cu_5.1_john123_v1_r8af5_maria_1" }
}
```

```json
{
  "filmopen": 1, "type": "cu", "tag": "e2.1", "author": "maria", "v": 1,
  "name": "Low Tide — main theme",
  "kind": "music",
  "folder": "fo_e2_john123_v1",
  "music": { "tempo_bpm": 72, "key": "D minor", "instrumentation": ["cello", "prepared piano", "tape hiss"],
             "mood": "unease held under restraint", "structure": "sparse intro, swell at the reveal, cut on the flash" },
  "sync": [{ "with": "sh_5.2", "offset_ms": 0, "event": "cut on the flash" }],
  "anchors": [{ "scene": "sc_5_john123_v1", "blocks": ["bl_3"] }],
  "model": "suno",
  "place": { "track": "mx", "with": "scene:3", "offset_ms": 0, "fade_in_ms": 2000, "fade_out_ms": 4000, "gain_db": -12 },
  "picks": { "music": "mu_cu_e2.1_maria_v1_r91c0_maria_2" }
}
```

- `kind` ∈ `dialogue` · `narration` · `music` · `sfx` · `ambience`.
- **Text comes from the `dialogue` of the referenced blocks**, concatenated in order; a block with no
  `dialogue` adds nothing, and a block's `direction` and `action` are never spoken. **`spoken`, if
  present, replaces it** — for pauses, pronunciation, numbers spelled out, a translated line. Readers
  surface "spoken differs from script" as an intentional state, and warn when the block has changed
  since.
- `ssml` (W3C SSML) is an alternative to `spoken` for models that accept it; use one or the other.
- **What a cue belongs to** is what its `scene` or its `folder` key names. A cue that spans scenes hangs
  under a folder: its tag is `<folder's tag>.<n>` (§5.3) and `folder` names the folder's version, where
  1.11 wrote `unit`. Where a cue carries both, `folder` says where it hangs and `scene` whose block ids
  its `blocks` are (§6.4). A cue that carries neither key belongs to the scene of its own short name —
  `cu_5.1` to scene `5`.
- A cue attached to a folder that needs specific blocks from specific scenes uses `anchors`, since block
  ids are local to a scene.

### 11.3 Placement

`place` states where a shot or cue sits on the timeline. Every field is optional; a scene with no
placement at all is a straight sequential cut on the first `av` track, in the scene's `shots` order.

| Field | Meaning | Default |
|---|---|---|
| `track` | track `id` from the project (§8.4) | first `av` track for shots; `dx` for dialogue, `vo` narration, `sfx`, `amb`, `mx` music |
| `after` | anchor: start at this item's **end** plus `offset_ms`. A shot tag, or `prev` | `prev` for shots |
| `with` | anchor: start at this item's **start** plus `offset_ms`. A shot tag, `scene`, or `scene:<tag>` | for cues, the first shot covering the cue's first block |
| `offset_ms` | signed milliseconds from the anchor | `0` |
| `in_ms` `out_ms` | trim within the source take, from its first frame; `out_ms` exclusive | whole take |
| `audio` | `false` to place picture only from an `av` clip | `true` |
| `gain_db` `pan` | mix | `0`, `0` |
| `fade_in_ms` `fade_out_ms` | audio fades | `0` |
| `transition_in` | `{ "kind": "cut" \| "dissolve" \| "fade", "ms": n }` — `kind`, as everywhere (§7); 1.11's `type` is not read | cut |

Rules:

- `after` and `with` are the only anchors, and a placement uses **one** of them. `prev` is the previous
  shot in the scene's order, not the previous file on disk. Anchor cycles, missing anchors and negative
  starts are reported.
- **Two items on one track cannot overlap.** A negative `offset_ms` after a picture cut on the same
  track is a collision and is reported. Overlaps go on another track: a second picture track for an
  overlay, or — the common case — the dialogue track for a **J-cut**, where the next line begins before
  the picture cuts: `"with": "sh_5.2", "offset_ms": -1500` on the cue.
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
A folder's cues do not lengthen individual scenes. Cross-scene anchor cycles are reported.

---

## 12. Takes and render batches

### 12.1 Takes are discovered, never recorded in the entity

A take is a media file whose name embeds its source stem (§5.4), or an imported file named in a batch.
**No entity file lists its takes.** A reader finds them by scanning `media/` (§4.2) and by reading batches; the
batch says how they were made. An entity's author writes no list of takes: only `picks`, and the
media of §9.0 — `media` and `preview` — which say what a model is shown, what the version keeps and what a
library view shows, not what exists. This is what lets one person render another's shot without touching their file, and lets
a character page show every sheet anyone has rendered for it.

### 12.2 Render batch `rd`

```json
{
  "filmopen": 1, "type": "rd", "id": "8af4", "author": "maria",
  "kind": "render",
  "created": "2026-09-06T15:30:00Z", "status": "done",
  "request": {
    "render_id": "job-8af4", "plugin": "pg_fo-fal_filmopen_v1", "model": "seedance25", "platform": "fal",
    "stage": "final",
    "prompt": "…the fully resolved prompt as sent…",
    "params": { "seed": 41222, "durationSec": 5, "fps": 24 }, "seed_random": false,
    "inputs": ["ff_sh_5.2_john123_v1_r8af3_maria_1", "vo_cu_5.3_john123_v1_r8af6_maria_1"],
    "inputs_by_name": {
      "first_frame": { "media": "ff_sh_5.2_john123_v1_r8af3_maria_1", "mime": "image/png",
                       "bytes": 1048576, "width": 1920, "height": 1080 },
      "audio": { "media": "vo_cu_5.3_john123_v1_r8af6_maria_1", "mime": "audio/wav",
                 "bytes": 441000, "durationMs": 1000 } },
    "sources": [],
    "asked_at": "2026-09-06T15:30:00Z"
  },
  "elapsed_ms": 41800, "cost_usd": 0.35,
  "items": [
    { "n": 1, "source": "sh_5.2_john123_v1", "deliverable": "clip",
      "output": "cl_sh_5.2_john123_v1_r8af4_maria_1.mp4",
      "sha256": "e310…", "bytes": 2841733, "mime_type": "video/mp4", "duration_ms": 5000,
      "reported": { "duration_ms": 5000 },
      "human": { "selected_from": 4, "prompt_edited_by": "maria" } }
  ]
}
```

**A render's record is one render job**, `kind: "render"`, and holds what was asked once, in `request`, and
what each file is in its items. A record of `kind: "render"` without `request` is reported as a warning
and stays listed; nothing is drawn from it. `import` (§12.3) and `manual` records have no `request` and no
`stage`; a `plugin` record is §12.4's.

| Field | Meaning |
|---|---|
| `created` | when the batch was made: RFC 3339 UTC (§1.4) |
| `kind` | `render` · `import` · `plugin` · `manual` · `queue` (the batch's pending queue, §12.7). A plug-in's render is recorded under the running person's derived handle for that plug-in (§5.6), as its takes are |
| `status` | `done` · `failed` · `cancelled`. A failed or cancelled render keeps the items that were written. A queue's are its own (§12.7) |
| `request` | required on a `render` record: what was asked. Its members are listed below |
| `stack` `seed_applied` | from the plug-in's answer (§14.4), once per render: how it ran the model — a workflow, its weights, its precision — and `seed_applied: false` where the service took no seed, the request's `params` then holding none. `seed_applied` is written only as `false` |
| `metadata` `metadata_refused` | the plug-in's shared container from its answer, kept whole as it was given, safe durable addresses included, never read as a place to fetch from; `metadata_refused` is no longer written — a record from an older version may carry its list of paths, and it is kept as read. Absent where the plug-in gave none |
| `cost_usd` | the record's one cost, absent when unknown, never zero |
| `elapsed_ms` | the time the job took |
| `items` | one per file, holding the file's own facts only and nothing of the request |
| `n` | the item's ordinal in the record: `1`, `2`, … in the order the outputs were given, unique within the record; for a render, the output's place in the plug-in's list, so an output listed that is no item — a preview, one not written — leaves a gap and nothing is renumbered. A take's file number (§5.4) is its own, numbered per purpose, and may differ; an entry names its item by `n` (§9.0) |
| `source` `deliverable` | the entity version the file was made for and its purpose (§5.5) |
| `group` | the group of the entity's `media` the output was put in (§9.0), so that a later scan of the batch knows where each output belongs without reading its name; absent where no group took it, as for a take found by its name alone |
| `output` | media reference — usually a file name in `media/` |
| `take` | take number in a generated filename when it is not `1` |
| `sha256` | recorded on ingest. Names carry meaning; hashes carry identity; together they survive renames, moves and duplicates |
| `mime_type` `bytes` `width` `height` `duration_ms` `fps` `frame_count` `sample_rate` `channels` `audio` | measured media properties; measured on ingest if absent, never invented — `audio`, on a clip, whether it has sound, as its entry's (§9.0) |
| `reported` | what the plug-in said of the file — its `width`, `height`, `duration_ms`, … — as it said them, beside what was measured |
| `metadata` | the plug-in's own container for this output, kept whole as it was given |
| `fetched` `error` | `fetched: false` on the item of an output the render made and did not fetch, with `error: { code }` saying why; such an item has no `output`, `sha256`, `reported` or `metadata`. A fetched item does not say `fetched` |
| `human` | the human contribution: candidates reviewed, who edited the prompt, manual edits. The authorship evidence (§16.5) |
| `job_id` `attempts` `error` | job notes for a failed or cancelled render; a batch may be updated in place |
| `thumbnail` `poster` `proxy` `waveform` | display derivatives; never model inputs by themselves. A thumbnail is the one §6.3 names, in the project folder's `thumbnails/`, and its path is relative to that folder, not to `media/`; the field records it and does not choose a second place for it |

The members of `request`:

| Member | Meaning |
|---|---|
| `render_id` | the render job's id |
| `plugin` | the plug-in's version stem |
| `model` `platform` | the catalogue entry's id and the platform it ran on (§14.6) |
| `stage` | `prototype` · `draft` · `final`: the stage the person asked at |
| `prompt` | the fully resolved prompt as sent |
| `params` | the options by the catalogue's names, the seed among them where one was sent |
| `seed_random` | `true` where no seed was given |
| `inputs` `inputs_by_name` | what the render was given. `inputs` is the flat list of media references, written whatever the render was given and empty where it was given none. `inputs_by_name`, optional, is the same media under the input names of §14.8 (`first_frame`, `reference_images`, `audio`, …), **each a descriptor — `media`, `mime`, and the `bytes`, `width`, `height` and `durationMs` measured on ingest where they were measured (§12.3) — except `reference_images`, which is an array of them**, as §14.4 gives them to a plugin. It is written only where at least one name holds media: a name given an empty array is no input. A reader that would make the take again reads `inputs_by_name`, since a flat list cannot say which reference was which input |
| `sources` | the version stems read beside the primary; may be empty |
| `asked_at` | when the person asked: RFC 3339 UTC (§1.4) |
| `treatment` | optional: the visual treatment the render was made with (§8.7), frozen when it was asked for: **`visual_style`**, the leaves that applied as §8.7 composes them, in A.11's shape (`prompts.treatment.positive` among them) — less any a shot's own `camera_character` or `lens.dof` replaced (§11.1), which the shot records itself — and **`sources`**, the stem of the document each leaf came from — the project file, a folder, a Style — by the leaf's dotted path (`look.grain`); a leaf set for that render alone names none. Absent where no treatment applied. It is the film's provenance, as `prompt` is: what the render was made from |
| `purpose` | optional: what the render is for, in the target's word |
| `from` | optional: the take the render continued, as its record holds it — **`record`**, the record's stem; **`item`**, the take's item whole; **`request`**, the record's `request` whole (a `from` of its own included where that take continued another); and **`metadata`**, **`seed_applied`** and **`stack`** from the record's top, each where the record has it. A description of the take, never an address to fetch from |
| `destination` | optional: the server the render was sent to, as the application named it — **`id`**, its own name for the place; **`kind`**, `server` (a server a server-provider plug-in made) or `lent` (another computer's offer); and, where known, **`label`**, the words the place was offered under, **`provider`**, the server-provider plug-in's tag, and **`server`**, that provider's own reference to its server, or a lent offer's terms. A take continued returns to it where it is still offered. Absent for a render on the person's own computer or at a server address the person set, and on records written before 1.41 |

### 12.3 Import batches — describing a film that exists

`kind: "import"` records material taken from an existing work. Its takes are named like any other; the
renderer is the **importing author**, so the take always finds its batch.

```json
{
  "filmopen": 1, "type": "rd", "id": "0001", "author": "john123",
  "kind": "import",
  "source": { "file": "the-cartographer-2019.mp4", "sha256": "e1a4…", "fps": 24, "duration_ms": 5412000 },
  "created": "2026-09-06T09:00:00Z", "status": "done",
  "items": [
    { "n": 1, "source": "sh_5.2_john123_v1", "deliverable": "first_frame",
      "at": { "ms": 724625 }, "output": "ff_sh_5.2_john123_v1_r0001_john123_1.png", "sha256": "77b0…" },
    { "n": 2, "source": "cu_5.1_john123_v1", "deliverable": "voice",
      "at": { "start_ms": 724625, "end_ms": 727200 }, "output": "vo_cu_5.1_john123_v1_r0001_john123_1.wav", "sha256": "31cd…" },
    { "n": 3, "source": "ch_main-hero_30yo_john123_v1", "deliverable": "keyframe",
      "output": "front.png", "width": 2048, "height": 2048 }
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
into one media folder in the same second, a clock set back — takes the next id and writes again. The
original name is kept in the item's `original_name` — the batch's `source.file` names the one work a whole
import came from, which an upload of a single reference has none of — and is never used as the file name,
so no upload displaces another, and a reference an author later drops from `media` stays on disk as a take of
that entity. `sha256`, `bytes`, `mime_type` and an image's `width` and `height` are measured on ingest (§12.2). **An import whose batch record
cannot be written is refused**: the application removes the files it wrote, their thumbnails with them,
and says so, so that no take arrives without the record that says what it is. Each item records its `n`,
its ordinal, and the `group` its output was put in (§12.2).

### 12.4 Plugin batches

`kind: "plugin"` records a plugin run: the plugin stem, the settings used, and the files produced under
the run's derived handle (§14.3).

### 12.5 Offline rendering

A batch may be **emitted instead of submitted**: the application exports one workflow file per item
wherever the person chooses, outside the project — for ComfyUI, a workflow JSON, labelled as UI graph
or API payload — each already named for the output it should produce. The workflows run anywhere;
the outputs are dropped into `media/`; a reader matches them by name and records hashes.

### 12.6 Ingest

On every scan a reader **SHOULD**: parse every filename; attach takes to sources; record `sha256` and
measured properties for new outputs in their batch; flag outputs whose hash no longer matches their
record; and report unknown files without moving them. On a network timeout a reader checks an existing
provider job before submitting another paid request, and keeps completed items when one fails. A reader
**MUST NOT** assume it is the only writer.

### 12.7 Pending sets

A **comp** (`cp`), an **assistant session** (`as`) and a render batch's **queue** (`rd`, `kind: "queue"`) share one
shape: a record of numbered items an author gathers while it is pending, which stays as its own history once it is
committed. Each lives in `data/` (§4.1) under its own grammar (§5.4), its `id` allocated as a render batch's is.

```json
{
  "filmopen": 1, "type": "cp", "id": "68f9a1c2", "author": "maria",
  "kind": "comp", "created": "2026-10-22T20:11:04Z", "status": "pending",
  "items": [ { "n": 1, "reference": "cs_ch_kira_30yo_maria_v2_r68f90a00_maria_1.png",
               "source": "ch_kira_30yo_maria_v2", "deliverable": "sheet", "added": "2026-10-22T20:11:04Z" } ],
  "next_item": 2,
  "title": "Kira, three looks", "visibility": "public"
}
```

| Type | `kind` | `status` | An item | Members of its own |
|---|---|---|---|---|
| `cp` comp | `comp` | `pending` → `posting` → `posted`; a failed post goes back to `pending` and keeps `error: {code, at, detail}` | `{n, reference, batch?, item?, source, deliverable, added}` — the media reference (§6.3), the record and item that made it where one exists, the version it was made for, its purpose, when it was added | `title`, `description`, `visibility` (`public` · `private`), `posted: {at, url, revision}` once posted |
| `as` assistant session | `session` | `open` → `closed` | `{n, stem, kind, base?, before?, result: {updated}, command, operation, label?, summary?, at, outcome}` — the version written; `fork`, `create` or `patch`, or `epoch` for a period the session declared, one item a token, `{n, stem, kind: epoch, epoch, before?, after, command, operation, summary?, at, outcome}`: the project version it was written to, the token, the entry it relabelled (only where it gave the untouched default a label and year) and the entry as written, discarding it removing an appended period, or restoring a relabelled one, where no retained version is at it; the stem a fork came from; the whole version before an in-place write; the version as the session left it, by its `updated` alone (no hash); what wrote it, and the command's own summary of what it did; when; what the person decided (`open` · `accepted` · `discarded`) | `started`, `ended`, `summary` (the session's, at its close), `run`, `assistant_session`, `assistant`, `action` (the catalog action's id the chat opened with), `entity` (the exchange id, such as `ch_julius_now`, of the entity a field's or form section's action opened at; absent for any other action), `picks: [{entity, from, to, at, operation?, item?}]` — each pick the session wrote, a pick being no item: the entity, the version picked before and after (`null` for none, on either side), when, under which operation, and the item a later write of that entity under the same operation made; `messages: [...]` — the conversation as the model was told it, in order: `{role: user, content, at}` for the person's words, `{role: assistant, tool_calls: [{id, name, arguments, argumentsError?}], content?}` for the tool calls an answer asked for, `{role: tool, tool_call_id, content}` for each tool's answer, whole, and `{role: assistant, content, at}` for the assistant's words; no system text, no context and no words shown only on screen; absent on a record from before it or of a chat not opened in a chat window |
| `rd` queue | `queue` | `pending` → `submitting` → `submitted`; a pass that leaves an item with neither a job nor an error ends `pending` again | `{n, target, request, added, submitting?, job?, error?, take?, record?}` — where the take will go and the render request exactly as it will be made, then the submission's trail: `take`, the reference of the take the job made (§6.3), and `record`, the stem of the `rd` record that holds it | — |

- **`n`** numbers an item, from `next_item`; it is never renumbered and never reused. **`next_item`** is the next `n`,
  raised on every add and **never lowered** by a removal; a reader that finds it absent, or at or below an `n` already
  taken, numbers the next item after the highest `n`.
- A record is **pending** while its `status` is `pending` (`open` for a session). One pending record per author per
  type is an application's rule, not the format's: an application adds to the author's pending record and makes one
  only where there is none. Sessions are the exception: a session is one per chat, so an author with two chats
  that write — on two devices, say — has two open `as` records, each closed with its chat. A folder holding two
  shows the newest by `created` as the pending one — a record without `created` last, equal instants by stem — and
  the other in the history.
- A reader draws nothing from a queue's items but the request each will make: a queue is not among the batches that
  produced takes (§12.1).
- An unknown `kind` or `status` is read as written.
- An older reader lists a `cp` or `as` file among the files the grammar does not describe, and reads a queue as a
  render batch of a `kind` it does not know (§18.2): nothing breaks.

---

## 13. Versions, official, compare and commentary

### 13.1 Versions

A version is a whole file. All are readable; the author's working copy is their highest version not discarded
(§7), and a discarded version keeps its number, so the next fork is numbered after it. Files are edited
in place and nothing is frozen; a filmmaker may edit `sc_5_john123_v1.json` for months. **Fork** on your
own version creates `v(n+1)` as a copy; fork on someone else's creates *your* `v1` (or next) with
`forked_from` set. The copy is identical apart from `author`, `v`, `forked_from` and fresh `created` /
`updated`, and without a version label: creative content, unknown fields and media references remain,
while `version_label` (or the 1.5 `label`) is left out, since a label names the version it was written on; a fork of a
discarded version is not discarded. A
forked project file additionally lists its new author among `contributors`, with no role (§8.3). An
application that forks also records the new version as the author's pick (`pick` and `picked_at`,
§13.4) — a fork is made to be used — writing the entity first and the commentary second, so a failed
second write still leaves a usable fork. Prior states of a file are Git's business.

### 13.2 Official

```json
{ "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo",
  "official": "ch_main-hero_30yo_maria_v1",
  "set_by": "john123", "set_at": "2026-09-06T14:20:00Z", "note": "Maria's. Using hers." }
```

Written by a director. Applies to every versioned type. Everything downstream reads through official
unless the viewer has a pick of their own (§6.1). Editing a version that official names changes
what the whole project sees; readers **SHOULD** say so and offer to fork instead, and then allow it.
A project with no chosen version for an entity simply has no pointer file: to withdraw a choice, a
director deletes the pointer; an application that offers official as a toggle removes the file when
the toggle is cleared and writes it, with `set_by` and `set_at`, when it is set. `set_at` is required of
an application writing a pointer and is RFC 3339 UTC (§1.4); a pointer written by hand may omit it,
and a reader then simply does not know when the choice was made. A director who makes a version
official normally means to use it, and no pick is needed to say so (§6.1): an application **removes**
any pick of the director's own at that epoch, so the star alone marks what they use. Where removing
would not land on official — a derived handle whose owner has a pick of their own there — it writes
the tracking value `<versions key>_official` instead. Other authors' picks are theirs and do not move.

An author whose `picked_at` is earlier than the pointer's `set_at` picked before the project chose. A
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
other attribute) — together with `created`, `updated`, `forked_from`, and the version label under
either spelling (`version_label` and the 1.5 `label`), and a prompt's `created`, `plugin` and `writer` (§9): words
a copy moves are a person's, so a prompt whose words it changes loses its `plugin` and `writer` and is stamped by the
writer, and a
block copied whole carries its prompts' words alone. A reader that draws the file's own metadata — `notes`, `by`, `source`, `license`,
`x` — apart from the entity's attributes should not offer those either: a remark an author wrote about
their own version is not true of somebody else's.

A character's `voice.active_reference` is copied only where the reader's version holds the entry it
names, not deleted, once the copy is done (§9.1); otherwise it is left as it was.

**Scenes compare by block id.** A block's `beats` and `subtitles` are part of it: they are compared, copied and
replaced with the whole block, never one beat or subtitle at a time.

| Case | Shown as | Copy-left does |
|---|---|---|
| same id, same content | collapsed: *6 unchanged* | — |
| same id, different content | side by side, changed words marked | replace mine |
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
  "picked_at": { "30yo": "2026-09-06T12:41:00Z" },
  "visited": { "30yo": "2026-09-06T12:45:00Z" },
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
absent. An entry may name a `block`, a `field` or a `git_commit` for context.

`pick` is the author's **pick**: the version of the entity in use for them, ahead of official (§6.1
step 2). It is a full stem, or — because one commentary file covers every epoch of an entity and a
pick is made per epoch — an object of stems keyed by epoch:

```json
"pick": { "30yo": "ch_main-hero_30yo_susan_v1", "50yo": "ch_main-hero_50yo_official" }
```

A single stem applies at the epoch it names and nowhere else, so older files read unchanged; a writer
folds it into the object the first time it writes a pick for an entity with epochs. An entity without
epochs (a project file, a folder, a scene, a shot, a cue, a model) uses the plain stem. In the object, each
key is the epoch of the stem under it; an entry filed under another epoch is reported and ignored. The value
`<versions key>_official` — the stem of the pointer file — means "the official version, whichever it
is", so a pick can follow the star rather than pin a version; an application need not write it, since
an author with no pick is already on official.

`prefer` is the 1.5 spelling of `pick`. A reader accepts it and treats it as `pick`; where a file
carries both, `pick` wins; a writer that rewrites the file writes `pick` and drops `prefer`.

`picked_at` says when the pick was made, in the same shape as `pick` — a timestamp, or an object under
the same epoch keys — in RFC 3339 UTC (§1.4). A writer stamps it whenever it writes a pick and removes
it with the pick it belongs to. A pick without a time is valid: a reader then cannot tell whether it
predates an official choice.

`visited` says when the author last had the entity's media on screen (§9.0), in `picked_at`'s shapes — a
timestamp for an entity without epochs, an object keyed by epoch otherwise — in RFC 3339 UTC (§1.4). An
application counts a take as *new* for this author where its batch's `created` is after it — an entry that names
no batch is never new, and where there is no `visited` yet nothing is — and writes `visited` into the author's
own file when it shows the entity's media with something new in it, or with no `visited` yet. It is bookkeeping: a reader that ignores
it loses nothing of the film.

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
with `pick` and `picked_at` set. A `pick` that names no file, or a discarded version (§7), is reported
and ignored (§18.2): resolution falls through as if the author had none, and the author's next pick
replaces it. Readers consolidate every `cm_` file for an entity into one feed. Review
can equally happen in pull requests or conversation; commentary is not required.

---

## 14. Extensibility

### 14.1 Language

Hooks and plugins are **JavaScript, ECMAScript 2020, with no `import`/`require`**: a hook is one
expression in a file of the format, and a plugin's code is one file or several, which an application
loads in the order the manifest gives them, as plain scripts of one scope — what an earlier file
declares at its top is there for a later one — the plugin being the value of the last file's last
expression. Functions may be `async`. Code receives one argument, `ctx`, and returns a value; it
never mutates project state.
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
model or a platform; an application may instead call the **`render` and `text` interfaces** of plug-ins (§14.4), which
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
    "buildPrompt": "(ctx) => [ctx.shot.prompt, ctx.style && ctx.style.prompts.treatment.positive, ctx.cast.map(c => c.prompts.reference.positive).join(', ')].filter(Boolean).join('. ')",
    "validate":    "(ctx) => !ctx.params || ctx.params.durationSec == null || ctx.params.durationSec <= 15 || 'Seedance 2.5 clips are 15 s max'"
  }
}
```

```json
{
  "filmopen": 1, "type": "pl", "tag": "fal", "author": "paul", "v": 1,
  "name": "fal.ai", "kind": "remote", "base_url": "https://fal.run",
  "auth": { "kind": "api_key", "keychain": "filmopen/fal" },
  "models": { "seedance25": "fal-ai/bytedance/seedance/v2.5" },
  "hooks": {
    "buildRequest":  "(ctx) => ({ url: ctx.platform.base_url + '/' + ctx.platform.models[ctx.model.tag], body: { prompt: ctx.prompt, image_url: ctx.inputs.image, duration: ctx.params.durationSec, seed: ctx.params.seed } })",
    "parseResponse": "(res) => ({ output: res.video.url })",
    "estimateCost":  "(ctx) => 0.07 * ctx.params.durationSec"
  }
}
```

`mo.kind` ∈ `text` · `image` · `video` · `audio` · `music` · `tts` · `voice` · `analysis`. Analysis capabilities include
`shot-detect`, `transcribe`, `diarize`, `face-cluster`, `describe-frame`, `describe-video`. Response parsers set `durationMs` only from the output media duration. Inference or request runtime
belongs in `elapsedMs`, converted from the provider's documented units; otherwise omit it.
Secrets never
appear in a project; `auth.keychain` names the credentials the application holds (§14.9).

### 14.4 Plugins

A plugin is a folder, `plugins/<tag>/`, in the shared library (§14.5) or in a developer's folder. It holds
the manifest, a code file named after it, and its strings:

| File | Required | What |
|---|---|---|
| `pg_<tag>_<author>_v<n>.json` | yes | the manifest: a versioned spec entity, forked like any other; one version of an installed package runs (below) |
| `pg_<tag>_<author>_v<n>.js` | yes | the code (§14.1): the file, or the files in order, named in `entry` |
| `l10n/<locale>.arb` | `en` at least | the plugin's strings, below |
| `README.md` | for a shared plugin | what it does, what it needs, how to change it |
| `platforms/<id>.json` | when it brings a platform | a platform file (§14.9) for an id the catalogue does not define |
| `assets/` | | text the code reads, such as prompt templates |

A fork of a manifest and its code sits in the same folder (`pg_locale_maria_v1.*`). One version runs
per installed package, whatever the film: the stock author's highest, else the folder's highest. A pick
or an `_official.json` on a plugin stays a legal file, read as a document and choosing nothing; to run
another version, remove the package and install the one wanted.

```json
{
  "filmopen": 1, "type": "pg", "tag": "locale", "author": "paul", "v": 2,
  "name": "Localiser", "api": 1,
  "description": "Translates dialogue and relocates settings to a target culture.",
  "entry": "pg_locale_paul_v2.js",
  "applies": ["sc", "cu", "lo"],
  "implements": { "transform": {} },
  "capabilities": { "ai": true },
  "settings": { "target": { "type": "string", "default": "th-TH" }, "relocate": { "type": "boolean", "default": true } }
}
```

| Field | Required | Meaning |
|---|---|---|
| `api` | yes | the version of the interface the plugin was written against (the interface definition's `api`); a host refuses one it does not support, naming both |
| `minRevision` | no | the least `revision` of that interface the plugin needs, 1 where absent; a host that has less says so, and does not run it |
| `implements` | no | the interfaces the plugin implements, below: `{ "<interface>": { … } }`, the value holding what that interface has a manifest add — `platform`, a platform's id (§14.9), for `render`, `text` and `key-check`, and optionally `models`, the catalogue entries (§14.7) the plugin speaks for; what each other interface's row says it adds. One platform to an interface |
| `entry` | no | a file name, or a list of them in the order they are loaded, each a `.js` file of the plugin's own folder named by a relative path; `<stem>.js` when absent |
| `description` | no | one sentence; a string key when the plugin's strings have it |
| `docs` | no | an absolute site path under `/docs/`, such as `/docs/platforms/comfyui/`; Settings shows a Docs link resolved against the app's development or release documentation origin. Only plain letter, digit, hyphen and underscore path segments are accepted; authorities, queries, fragments, encoded segments and traversal are refused |
| `l10n` | no | the folder of locale files; `l10n` when absent |
| `applies` | no | the entity types the plugin works on: those its `transform`, `analyze` and `export` are offered on, and those its `entitySettings` name |
| `capabilities` | no | `ai`: the plugin uses `ctx.ai.complete`; `network`: host names it may reach **without** credentials; `upload`: it sends media of the film to its platform or its server through `ctx.upload`, which the user is told before the code first runs |
| `keys` | no | the keys the plugin **owns**, `{ "<slot>": { "platform": "<id>", "label"?, "help"? } }`. A key's id is `<tag>:<slot>`; `platform` names the platform file that says how the key is entered, checked and sent (§14.9) |
| `uses` | no | ids of keys the plugin asks to use: another plugin's (`locale:openrouter`) or the application's own, whose owner an application names (FilmOpen: `app`) |
| `offers` | no | functions of its own that other plugins may call, beyond any interface: `{ "<name>": { "label", "help?", "args?", "returns?", "example?", "description?", "expose?", "effectful?", "readOnly?", "destructive?" } }`, the label being what the caller's consent shows, `args` and `returns` schemas as the interface definition's are, and `example` a value of the arguments it takes; `expose` the public kebab-case name (at most 48 characters, unique among the plug-in's offers) an application's assistant may call it under — only an offer with `args` is exposed —, `description` a key of the plug-in's strings describing it to a model, `label` serving without one, `effectful` whether a call takes an operation key, `true` where absent, and `readOnly` and `destructive`, booleans that annotate and decide nothing — the interface definition stays the authority for a function's schemas; an action may carry an `example` likewise. A function of an interface is never listed here, and an action's function may not be offered |
| `calls` | no | the functions of other plugins this one calls, `"<tag>:<name>"`: an offer, or a function of an interface that plugins may call |
| `kind` | no | `platform`, `model` or `tool`: a word for lists, which decides nothing — what a plugin can do is what it implements; another token is kept |
| `settings` | no | the plugin's options, `{ "<key>": { "type", "default"?, "label"?, "help"?, "scope"? } }`; `type` is `string`, `text`, `number` (`min`, `max`), `boolean`, `enum` (`values`), `model` (a catalogue entry of `category`, optionally on one `platform`, §14.6) or `server` (the address of a server the user runs or chooses: `http` or `https`, a host, and a port and a base path where it has them). A setting whose `scope` is `project` (the default) is kept in the project file under `plugins.<tag>` (§7); `machine` keeps it on one computer, outside the project. A `server` setting is always kept on one computer, whatever `scope` says, and is not allowed under `entitySettings`; its `default` may only name the computer itself |
| `entitySettings` | no | per entity type named in `applies`, fields of the same vocabulary kept in that entity's own file under `plugins.<tag>` — a character's version can carry other notes for a plugin than its sibling |
| `actions` | no | `{ "<id>": { "label", "call" } }`: commands an application offers on the plugin's own page; `call` names a function of the code |
| `x` | no | an object an application reads nothing of: another tool's data, a proposal. Kept as written, never reported as unknown, and never a promise to the user — but `x.dependencies`, a list of plug-in tags the application reads as presentation alone — the Plugins page's grouping — granting nothing |
| `sharing` | no | the operations the plugin offers to others, `{ "operations": [ { "function": "render" \| "speak", "model": "<catalogue id>", "unit": "image" \| "second" \| "character", "scale": 1000 } ] }`, `scale` only with `character`, an empty `operations` valid. Read and checked — a wrong shape reported at its path; a `render` operation by `image` is what lending publishes and renders on, the others read and not yet acted on (7 November 2026) |

`label` and `help` values, and `name` and `description` where the strings define them, are keys of the
plugin's locale files, which an application renders in its reader's language: `l10n/<locale>.arb`, JSON
objects of strings in the ARB shape, `@@locale` naming the file's locale, `{name}` placeholders. A key
does not contain `:`, which marks a namespace — an application's own strings are reached as
`<namespace>:<key>` (FilmOpen: `app:`), and a lookup falls back to `en`, then to the key itself.

**A plugin implements interfaces.** An interface is a named set of functions, each receiving `ctx` and
one object of named arguments and answering JSON. A manifest declares the interfaces it implements, and
may declare several — a renderer and a writer at once; an application calls a function of an interface
because the manifest declared it, and for no other reason. **What each function receives and answers,
and everything `ctx` carries, is defined as data in the interface definition that accompanies this
specification** — `filmopen-plugin-api.json`, JSON Schema, one file per `api`, its `revision` growing
by one whenever something is added. It is normative for those shapes, and an application's reference
and types are generated from it; this section names the interfaces and states their rules.

| Interface | Functions (**required**) | The manifest adds | Called by |
|---|---|---|---|
| *every plugin* | **`status`** — can the plugin do its work now: `{ state, message?, details? }`, `state` being `ready`, `unconfigured`, `unavailable` or `degraded` | — | the application, and a plugin that declares the call |
| `transform` | **`transform`** — rewrite the entities the user selected: polish, translate, restyle, relocate | — | the user |
| `analyze` | **`analyze`** — comment without changing: continuity, pacing, consistency | — | the user |
| `import` | **`import`** — turn a foreign file into entities, and optionally a batch | — | the user |
| `export` | **`export`** — turn entities into a foreign format: `{ filename, content }` | — | the user |
| `text` | **`complete`** — an answer to a list of messages; `estimateCost` | `platform`, `models?` | the application's text features, and `ctx.ai.complete` |
| `render` | **`render`** — pictures, video or sound from a model; `estimateCost`; and, for work that outlives a call, `collect` and `cancel` | `platform`, `models?` | the application's features that make media |
| `key-check` | **`verifyKey`** — for a platform whose key check its file cannot declare in `verify` (§14.9) | `platform` | the application, with a candidate key's id usable for that one call |
| `platform` | **`run`** — run this model, or this workflow, with this input, the service's own protocol being the plugin's business; **`request`** — one request to the service | — | other plugins |
| `reference-analysis` | **`describeReference`** — what a picture or a recording of a character shows, in the character's own leaves | `kinds`, `platform?` | the application |
| `style-analysis` | **`describeStyle`** — a visual treatment's leaves from a picture (§8.7) | `platform?` | the application |
| `prompt-builder` | *(no function: declared, never called)* — a catalogue of entries a person picks from, each with a prompt; the application stores the entry chosen and does not add its prompt to a render's; it reads the catalogue, the plugin's strings and its pictures without running it | `catalog`, `target` | nobody: the application reads it |
| `voice` | **`speak`** — speech in a kept voice; `designVoice`, preview voices from a description; `saveVoice`, a preview kept on the account | `platform` | the application |
| `server-provider` | **`serverCapabilities`**, **`serverOffers`**, **`deployServer`**, **`listServers`**, **`resolveServer`**, **`wakeServer`**, **`stopServer`** — servers on demand for an engine, each with one replica and a lease its provider enforces | `engines`, `platform` | the application |
| `lifecycle` | **`onEnable`** — told it was turned on, and may look quickly whether it can work, reading only the routes it declares; `onDisable` — told it was turned off, to tidy its own state | `discovery?` | the application, on the person's switch |

`analyze`, `import` and `export` are defined, their shapes settled, and not yet run by any feature of an
application; two more are named in the definition and not yet built by any application: `rewrite` (a
text rewritten on an instruction) and `prompt` (`buildPrompt`: an entity of the film turned into the
instructions for one render with one model).

**What a render receives and answers.** `{ model, entry, prompt, inputs, params, seed, source? }` —
`model` a catalogue entry's `id` (§14.7) and `entry` that entry's file; `inputs` an object keyed by the
input names the entry's `capabilities.inputs` lists (§14.8), each a descriptor of a piece of the film's
media — `{ media, mime, bytes?, width?, height?, durationMs? }`, `media` a media reference (§6.3), what
was not measured absent, **`reference_images` an array of such descriptors** and every other name one —
and **never the media itself**; `seed` an integer of the application's, from 0 to 4 294 967 295, which
is the one its caller gave, to make a render again — a value that is no such integer is refused, never
replaced — else a new one for every render, and never the plugin's to choose; `source` the entity the render is for. It answers by **`state`**: `succeeded` with
`outputs`, each an `https` address or `{ server, path, mime }` on a server a `server` setting names, and
optionally its `role` (`image`, `video`, `audio`, `preview`, `other`) — the application downloads them as takes
(§12.4), a preview never and one whose bytes are not of the type its `mime` names not at all — and
with `seedApplied: false` where the service took no seed, which the
batch then records; `pending` with a `job` of the plugin's own, which an application is to hand back
to `collect` on its own timer, each a call of its own, and to `cancel` — planned: an application that
cannot wait for a job yet says so, and keeps nothing; or `failed` with the problem as data: a `code`, a
`message`, whether it is `retryable`. A `platform` plugin's `run` answers the same way.

The definition, at revision 1, holds what a render that outlives a call, a paid service and a server on
demand need, each settled in its shape and built by an application as it can:

- **`options`**: a route's ways of running a model, each with its own readiness — so that a way that is
  ready is offered though the default is not — the choices they take and a **quote** of the choices
  asked about, with its basis. A render is handed back the route, the way and the quote it was priced
  at, and refuses rather than spend more.
- **The job**: a render whose work outlives the call answers `pending` with a `job` of the plugin's
  own, which the application keeps with the job's id, its destination and its key (`ctx.job`) and hands
  back to `collect` and `cancel`, each bound as the render was; a restart asks again and never renders
  again. A plugin keeps its receipt of the work under the job's id.
- **Media in and out**: a descriptor carries a `grant`, by which the plugin sends that media — through
  `ctx.upload`, which also takes the descriptor's media reference, or placed into a
  request's body by the application (`embed`) — and never a path; a
  service's inline answer is kept by the application behind a handle (`ctx.stage`), which an output
  names; an application never fetches a `data:` address.
- **Destination**: a call bound to a server keeps it through every nested call, check, upload and
  download; the plugin never names the address.
- **Usage**: what a call used, in its units, and `billing` with its basis — `provider`, `price`,
  `estimate` or `unknown`, a cost nobody knows being unknown and never free; a paid call that then fails
  answers its usage with its failure.
- **Readiness**: each key `ctx.keys()` lists says `usable`, `mode` (`own` or `funded`) and, where it is not usable, a `reason`; a plugin asks `usable` and never refuses on `hasKey`. An application answers from the person's own key — `usable` where one is stored and allowed, `mode: own`, `reason` `needsKey` where none is stored, else `grantDenied` — and funded answers come later.
- **`ctx.now`**, the application's clock when the call started, in milliseconds.
- **The typed capabilities** of the table above: an answer is held to the leaves the definition names
  and applied leaf by leaf through the person's draft, a null or an empty list leaving the file as it was, and
  no plugin navigates. A function of the definition is never taken as an offer of the same name.

An interface, a function, a setting type or a field a host does not know is ignored and reported, and
the plugin's others still run; within one `api`, interfaces, functions and optional arguments are only
added, each with the `revision` it arrived in, and `api` changes when something changes incompatibly.

Rules:
- A plugin has read access to the whole project and operates on the entities the user selected.
- **`status` is required, and its absence refuses nothing.** Answering it starts no render, spends
  nothing and installs nothing, and says nothing of work under way. A plugin with nothing to check
  answers `ready`. A plugin whose code has none is told so where the user sees it, and its other
  functions run: no application can know a function is missing before it has run the code.
- **An application chooses the plugin by the model asked for**: among the enabled plugins that
  implement the interface on a platform the entry's access rows name (§14.7), one that names the model
  in `models` before one that names none; where the request names no platform, one on the user's own
  computer (a platform of `kind` `local`) before any that bills — before the user's preference too, which
  is one per kind of work and not per model; and among several still, the user's preference, without
  which the user is asked, never one taken for them; the same choice
  serves `estimateCost` — which is told the `operation` it prices, since a plugin that implements both
  `render` and `text` has one function of that name — and the call itself. A request may name its
  platform, and then no other is looked at. Where nothing serves the model, that is said, and no other
  plugin is asked instead; **a render that failed is never sent again elsewhere**, and never from the
  user's own computer to a service that bills them, unasked.
- **A render's request is prepared once and recorded.** The inputs are held to the entry's own
  `capabilities.inputs`: a name the model does not take, and a required one that is missing, are
  refused before the plugin runs. What was sent — the model, the platform, the prompt, the parameters
  with the seed, the inputs — is what the batch records (§12.2), so that a take can be made again: it
  is the application's own record, which nothing a plugin answers can change. From the answer it records
  only `stack`, the plugin's word for how it ran the model, and `seed_applied: false`, and then no seed.
- A plugin **never writes files.** It returns entities; the application writes them as **new versions
  under the running user's derived handle** — `john123.locale-th` — all starting at `v1`, and records a
  `kind: "plugin"` batch. A second run is `v2`. If the source files changed while the run was in
  progress, the application shows that rather than overwriting.
- Plugin output is **never merged into the owner's own versions.** Accepting it is pointing official at
  it, entity by entity or as a whole run; taking parts is copy-left; hand-fixing it is forking it.
- **A plugin names a credential; the application adds it.** Its code names a key by id; the application sends the request
  to that key's platform — over `https`, to the platform file's `hosts`, following no redirect elsewhere —
  and adds the credential where the platform file says (§14.9). A plugin uses the keys it owns; another's,
  only when the user has granted it. Hosts in `capabilities.network` are reached without any credential.
  The application does not search an answer, so a platform that echoes a credential hands it back to the
  plugin as sent. **What a plugin
  allowed to use a key holds is the key's authority, the application adding the key**: so a request with a key goes
  only to the `paths` its platform file allows (§14.9), and an application tells the user, in its own
  words and before the code first runs, that such a plugin — or one that calls a plugin which may use a key:
  its own, one granted to it, or one of a plugin it calls in turn — can spend on that account.
- **A plugin may call a function of another plugin** — `ctx.call("<tag>:<name>", args)` — where its
  manifest declares the call, both are enabled, and the function is one the other offers or one of an
  interface that plugins may call, which the other implements. No other function is ever reached this
  way: not `verifyKey`, not `transform`, not `render` or `complete`, which go through the application so
  that they are chosen, recorded and paid for as the user's. The function
  runs as its owner, with its owner's settings, servers, keys and storage; JSON crosses in each
  direction and nothing else; an application bounds how deep calls go and refuses a function that is
  already on the chain.
- **A plugin may write a line of its own** — `ctx.log(message, data?)` — which an application shows to
  whoever is running it and may keep in a file of its own; it is the plugin author's own words, so an
  application's own log, which records events, is not where it belongs; never a key, and never a
  user's text.
- **A server the user names.** A request may name one of the plugin's own `server` settings in place
  of a key — `ctx.http({ server: "<setting>", path })` — and the application sends it to the address
  the user gave for that setting on that computer, over `http` or `https`, with no credential,
  following no redirect off that address. The plugin's code never supplies the address, and should
  not read anything into the setting's value: an application may reach the same server by another
  route.
- **What a user consents to is every file of the plugin's folder**, the manifest, the code and what
  the code reads — a workflow in `assets/` runs on the user's own computer as surely as the code does —
  so that a change to any of them asks again.
- **A plugin may bring a platform file** for an id the catalogue does not define; one for an id the
  catalogue defines is ignored, since a platform's definition is shared by every entry that names it.
- `capabilities.ai` grants `await ctx.ai.complete(messages, options?)` → `{ text, usage?, cost? }`,
  through the `text` plugin chosen for the model `options.model` names, as a render's plugin is chosen;
  where it names none, by the same rules among every enabled `text` plugin, the model then being the
  one that plugin is set to use. A choice that finds none is refused with its cause, and inside
  `status` the call is refused, since answering `status` spends nothing. The application owns
  paid-call consent, cancellation and retries within the user's configured limits.
- Trust remains the application's (§14.2): a manifest declares what the plugin asks for, so that an
  application can show it before the code first runs and again when the code changes.

A **localisation** plugin is the canonical example: fork the repository for a new territory, run the
plugin, point every `_official.json` at the run. The original is untouched in the same tree. An
**import** plugin with `ai: true` is the reverse-engineering tool of §12.3.

### 14.5 The shared library

Models, platforms, plugins and optionally styles live in a public repository the format maintainer
controls, using exactly the conventions above: versions, authors, `_official.json`, commentary. *Share*
on a forked entry is a pull request; the maintainer merges and, once tested, moves `_official.json`. For a
plugin that pointer records the version the maintainer tested, which a person installs; it does not choose
what runs in a film (§14.4). No central service is needed to use a locally installed entry.

The library is installed **beside** projects, not inside them: one copy per machine (or per user), in a
folder the application manages and can update on its own schedule — a `git pull`, a download — without
touching any project and without a new build of the application. A project therefore need not contain
`mo_`, `pl_` or `pg_` files at all; a reader resolves references to models, platforms and plugins
against the project first and then against the library. A project's `data/` **MAY** hold its own
`mo_` and `pl_` entries — a fork of a library entry made inside the project as one would fork a character,
or a private model — and those take part in resolution exactly like any other entity of the project.
A `pg_` document in `data/` is an entity and runs no code: plug-in code is not a document and never
lives in a project. The same full stem present in both
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

`<model>` is the model's **short name**. It **MUST** follow its own 20-character bound
(`[a-z0-9][a-z0-9-]{0,19}`), so that it can become a library `tag` unchanged, and it is the same in every
category the model appears in. A version is written after a hyphen and without its dot: `kling-30` for
Kling 3.0, `veo-31`, `gpt-image-25`.

**Categories.** Thirteen tags, in the order a film is made:

| Tag | Category | Input → output | `kind` |
|---|---|---|---|
| `stt` | Transcription | speech → text | `analysis` |
| `write` | Writing | instructions and context → prose, a script | `text` |
| `llm` | LLM logic | instructions and text → JSON that validates against a schema | `text` |
| `t2i` | Text to image | prompt → image | `image` |
| `i2i` | Image to image | reference images and a prompt → image | `image` |
| `tts` | Voice | text → speech | `tts` |
| `ttv` | Voice design | a description of a voice → preview voices, one of which is kept for speech | `voice` |
| `ttm` | Music | a description and lyrics → music | `music` |
| `t2v` | Text to video | prompt → video | `video` |
| `i2v` | First frame | first frame and prompt → video that opens on it | `video` |
| `ia2v` | First frame + audio | first frame, a supplied audio clip and prompt → video synchronised to the clip | `video` |
| `flf2v` | First + last frame | first frame, last frame and prompt → video between them | `video` |
| `flfa2v` | First + last frame + audio | first frame, last frame, a supplied audio clip and prompt → video | `video` |

The tags follow the field's shorthand: STT and TTS for speech, TTV for a voice made from text, TTM for
text-to-music (T2M usually means text-to-motion), T2I, I2I, T2V and I2V for pictures, and FLF2V for
first-and-last-frame video. The `a` marks an **audio input**: the audio categories hold models that take
a sound file the application supplies, such as the dialogue take a shot's deliverable names in `inputs`
for lip sync (§11.1). A model that only generates its own soundtrack is not one of them; that is
`audio_output` in its `t2v`, `i2v` and `flf2v` entries (§14.8). An entry's `kind` **MUST** be its tag's.

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
| `tag` | string | yes | One of the thirteen tags (§14.6). |
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

**Variants.** Tiers or sizes of one model, or its modes where a platform reaches them by separate routes, are variants
of one entry, not files of their own:

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

A list's values are spelled as the platform takes them (`480P` for MiniMax H3 Max, `480p` for Seedance). A price's
`when` names them in the same spelling, since a reader matches them exactly.

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
| `model_id` | What the platform calls the model; for `huggingface`, the repository. A `comfyui` row names none: the render plug-in that runs it holds the files its stacks load. |
| `endpoint` | The URL a request goes to, where the platform has one per model. |
| `params` | The platform's field for each input and setting (below). |
| `pricing` | What a run costs on that platform (below). |
| `render` | `true` where the row has been reviewed and checked for a render plug-in that names no models: such a plug-in on the row's platform may render the entry through it (§14.4). Absent, or `false`, it may not; a plug-in that names the model does not need it. |
| `strings` | The settings, by the catalogue's name, that the platform takes as text where the catalogue lists numbers. On fal's Seedance rows this is `["duration"]`, whose field takes `"4"` to `"30"`. A render plug-in checks the value against the list, then sends its decimal text. |
| `placeholders` | The words the model's prompt uses for its `n`th input picture on that platform, holding `{n}` once, `n` counting from 1: `"@Image{n}"` on fal's Seedance, `"[Image{n}]"` on Replicate's. **Required on every row whose `params` maps `reference_images`**, absent on every other. At render the application writes a prompt's media tokens (§9) in these words, numbered in their order of first appearance, which is the order the pictures are sent in. Where neither the platform's nor the model's documentation shows a form, the row says `"image {n}"` and `unverified` names it. |

A reader offering a run takes the first row whose platform the user holds a key for, or needs none.

**Parameter names.** `params` maps the catalogue's name for an input or a setting to the platform's field:
a field name; a dotted path in the request body (`generationConfig.imageConfig.aspectRatio`); a path with
a selector where the body is a list of parts (`content[role=first_frame].image_url.url`); or, for ComfyUI,
`Node.input`. The catalogue's names are the same in every entry:

| Used by | Names |
|---|---|
| Every category | `model` (the field naming the model), `variant` (the field choosing a variant), `prompt`, `seed`, `language`, `output_format` |
| Pictures and video | `negative_prompt`, `first_frame`, `last_frame`, `reference_images`, `mask`, `audio`, `duration`, `resolution`, `width`, `height`, `aspect_ratio`, `fps`, `generate_audio`, `camera_control`, `multi_shot`, `num_images`, `quality`, `background`, `steps`, `guidance`, `prompt_expansion` |
| Voice and music | `text`, `voice`, `reference`, `stability`, `timestamps`, `lyrics`, `instrumental`, `composition_plan`, `duration`, `bpm`, `key`, `time_signature`, `task`, `reference_audio`, `source_audio` |
| Transcription | `session_type`, `audio_format`, `sample_rate`, `partial_results`, `punctuation`, `smart_format`, `filler_words`, `custom_vocabulary`, `turn_detection`, `utterance_end`, `vad_events`, `delay`, `noise_reduction`, `training_opt_out` |
| Language models | `instructions`, `input`, `max_output_tokens`, `reasoning`, `structured_output`, `tools`, `stream` |

A setting with no name here keeps the platform's own, in snake_case: `person_generation`,
`resize_mode`, `storage_uri`, `input_fidelity`, `moderation`.

**Prices.** A row is `{ "usd", "per", "when", "match" }`: the price the platform publishes, in US dollars, for one
unit; `when` says when the row applies — a resolution, audio on or off, a quality, a date. A discount is
said in `when` or `notes`, and a run on the user's own machine has no row, or a row of zero. `match`, where a
row has it, names the settings the price applies to, each a catalogue name (above) and its value as text —
`{ "quality": "high", "resolution": "1024x1024" }`. A reader prices a call by the least of the rows whose `match`
the call's settings all equal; else by the least of the rows without one whose `when` names its resolution; where
none of the prices applies and some row has a `match`, the call has no price — unknown, never the least of them;
and only where no row has a `match` does it fall back to the least of all.

| `per` | One unit is |
|---|---|
| `second` | a second of generated output |
| `minute` | a minute of audio |
| `image`, `video`, `request` | one image, one video, one request |
| `clone` | one recording kept as a voice |
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

**Inputs.** Image, video and voice design entries describe each input the mode accepts as
`{ "required": true }` or `{ "required": false }`, with its limits:

| Input | Limits |
|---|---|
| `prompt`, `negative_prompt` | `max_characters`, `max_tokens`, `languages` |
| `first_frame`, `last_frame`, `reference_images`, `mask` | `min` and `max` (how many images), `formats`, `max_mb`, `min_px`, `max_px`, `resolutions`, `aspect_ratios`, `aspect_ratio_range` (`[min, max]` of width ÷ height), `sets_aspect_ratio` (the output takes this image's shape), `fit` (`pad`, `crop`), `reference_types` |
| `audio` | `formats`, `max_mb`, `min_s`, `max_s`, `max_clips`, `max_total_s`, `kept_as_soundtrack`, `lip_sync`, `languages`, `use` |
| `text` | `min_characters`, `max_characters`: what a voice design's previews say |
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

**Voice design** (`ttv`)

| Key | Type | Meaning |
|---|---|---|
| `inputs` | object | `prompt` (the description of the voice: `max_characters`, `languages`); `text` (what the previews say: `min_characters`, `max_characters`); `seed` |
| `previews_per_request` | number | How many preview voices one design answers |
| `reference_audio` | boolean | A sample may steer the design |
| `saves_voice` | boolean | A preview can be kept as a voice of the account, which speech with the platform's `tts` model then uses |
| `keeps_recording` | boolean | The plug-in can keep a reference recording as a voice through `saveVoice`; a charged keep declares a `clone` price in its access row |
| `output_formats` | array | The previews' audio, as the vendor names them |
| `supported_languages` | array | |

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
`openai`, `xai`, `anthropic`, `google` (the Gemini API), `vertex`, `elevenlabs`, `deepgram`, `kling`,
`byteplus`, `minimax`, `ltx`, `openrouter`, `fal`, `replicate`, `comfyui` and `huggingface`. FilmOpen's
first version supports `openrouter`, `fal`, `openai` and `xai`, and the index marks the others pending
(§14.6).

```json
{
  "id": "fal",
  "name": "fal.ai",
  "kind": "remote",
  "base_url": "https://queue.fal.run",
  "hosts": ["api.fal.ai", "fal.run", "queue.fal.run"],
  "auth": {
    "kind": "api_key",
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
| `hosts` | array | unless `auth.kind` is `none` | Every host a request carrying the platform's credentials may go to: at least the hosts of `base_url`, of `verify.url`, and of each `endpoint` in the access rows that name the platform. An entry may instead be `*.` and a domain of two labels or more — `*.salad.cloud` — which stands for each host of exactly one label before that domain, and only as the endpoint a server provider resolved for the server a call is bound to (§14.4, `server-provider`): the hosts a provider makes per deployment. A `*` anywhere else makes the file unusable. |
| `paths` | object | | Where, on a host, a request carrying the platform's credentials may go: `{ "<host>": ["<prefix>", …] }`. A request to a host named here must match one of its prefixes by whole segments — `/v1/key` is not `/v1/keys` — after its path is made plain, and a path that cannot be made plain is refused before anything is matched: a `.` or `..` segment, however it is escaped and whatever `;` parameter follows it; a slash or a backslash that is escaped, and a backslash of any kind; an empty segment, a trailing `/` included; a control character; and a `%` that is not two hexadecimal digits standing for a printable ASCII character other than `%` itself, which a server that decodes twice would read as an escape again. The path judged is the one the request was written with, before any reader resolved it. A host of `hosts` that is not named here takes any path, which is right for a host that serves nothing but models. Each host named here is one of `hosts`, named once whatever its case, and each prefix is itself a plain path; a file that breaks any of these, or whose `paths` names no host at all, is not used — an empty `paths` is not an absent one. It exists because a platform's hosts can serve more than models — an endpoint that creates keys, or reads an account — and **a plugin allowed to use a key has that key's whole authority on every path it may reach**: `verify.url` and each `endpoint` of the access rows must pass it. |
| `auth` | object | yes | `kind`, one of `api_key`, `oauth`, `token` or `none`; `header`, the header with a placeholder that names a `credentials` id, such as `Authorization: Key <key>`; `env`, the environment variable the vendor's own SDKs read, where one is documented; `keychain`, the name an application keeps the platform's credentials under, as a `pl` file's `auth.keychain` (§14.3). `auth.kind: oauth` alone does not offer application sign-in: that route is defined by the sibling `oauth` object, on a platform of any kind. |
| `headers` | object | | Other headers every request needs, such as `anthropic-version`. |
| `credentials` | array | when `auth.kind` is `api_key` or `token` | What a user copies from the platform, one object per field: `id`, the field's name in the stored value and in `auth.header`'s placeholder; `label`, the platform's word for it; `secret`, whether it is hidden while it is typed; `prefix`, how the platform's values start, where it says. |
| `verify` | object | | A documented authenticated request at a fixed URL that runs no model, to check a key: `method` and `url`. It carries `auth.header` and `headers` like any other request. A `2xx` answer means the key is good. `rejected`, where the file has it, is the whole list of the HTTP statuses, each from `400` to `599`, with which the platform refuses a key; left out, it is `401` and `403`. xAI lists `[400, 401, 403]`: it answers a wrong key with `400`, and keeps `401` for a request with no credentials. Any other answer says nothing about the key: the check could not be made. A reader decides by the status alone, and need not read a refusal's body, which may repeat what it was sent. |
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
to the hosts in `hosts` — to a host a `*.` entry stands for only where it is the endpoint a server provider's
`resolveServer` answered for the server the call is bound to, and then to that one origin, never to an address
a plugin names itself, since another customer's server may answer under the same domain; it **MUST NOT**
follow a redirect to a host outside them; and it never writes
them into the catalogue, a project or a plugin's output (§14.2).

**Signed-in access (9 November 2026).** A platform may add an `oauth` object beside `auth`,
keeping its existing key route. `auth.kind: oauth` alone does not offer application sign-in;
the sibling block defines sign-in on a platform of any authentication kind. The signed-in
requests use the same `base_url`, `hosts` and credential path restrictions as its key route.
Every field of the block except optional `token_params` is required:

| Field | Type | Meaning |
|---|---|---|
| `authorization_endpoint` | string | The secure browser authorization URL. |
| `token_endpoint` | string | The secure code-exchange and refresh URL. |
| `revocation_endpoint` | string | The secure refresh-token revocation URL. |
| `issuer` | string | The secure issuer URL expected in the ID token. |
| `scopes` | array of strings | The nonempty list of scopes requested. |
| `required_scope` | string | The scope that must be granted before the credential is stored. |
| `client_id` | string | The public client identifier. |
| `params` | object of strings | Extra authorization parameters, with `{host_id}` replaced by the installation’s bare UUIDv4, made once and kept in host preferences. An empty object is valid. |
| `token_params` | object of strings | Optional extra form fields for code exchange and refresh, with the same `{host_id}` substitution; absent means none. |
| `sends_output_cap` | boolean | Whether a signed-in completion sends the output cap. |
| `label` | string | The plan's name for displaying its route. |

A manifest key slot may name `auth: oauth`; an omitted `auth` means `key`. Both slots name
the same platform. The credential name remains `filmopen/<owner>/<slot>`, with no separate
slot field in the block. The signed-in record holds `access`, `refresh`, `expires_at`,
`client_id`, `host_id`, `account` and `scopes` in the device credential store.

**Checking a catalogue.** Before a catalogue is published, a writer **SHOULD** check that every entry's
and every platform file's `id` is its filename; that `tag` and `kind` agree; that every
`access[].platform` is a key of `platforms`, that every `platforms` entry's `file` exists with the same
`name` and `kind`, that a `status` is `pending` and comes with at least one obstacle, and that every
`access[].variant` is an `id` in `variants`; that a platform whose
`auth.kind` is `api_key` or `token` lists its `credentials`, and that `hosts` holds the hosts of its
`base_url`, its `verify.url` and every `endpoint` of the access rows naming it; that a `verify.rejected`
is a list of statuses from `400` to `599` with at least one in it; that every `per` is a
unit of §14.7; that `max_length_s` is the largest of `supported_durations_s`; that a video entry marks
its tag's inputs as required; that `placeholders` is on exactly the access rows whose `params` maps
`reference_images`, a string holding `{n}` once and other words; that `max_images_per_request`, where
present, is an integer of at least 1; and that every listed file exists.

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

One flat timeline per export: the film, or one folder of it, such as an episode. Tracks span the whole
timeline; scenes appear in **script order** — the project's `children` walked depth-first, each folder's
`children` in its own order (§8.5, §10.1) — with a marker at each scene start carrying the scene stem,
and a marker on each clip carrying its shot or cue stem. A folder adds nothing to the timeline but the
order of its scenes and its own cues. **No nested compositions** — importers handle them badly.

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

**Re-rendered takes → relink.** Export media into conform slots beside the editing application's own
files, outside the FilmOpen project, under **stable slot names** that do not
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

### 15.5 A scene's export

A scene can be exported alone, as it plays: **one scene, assembled from its blocks** in script order, with
**direct file references** to the media it uses. It is not the film's conform of §15.2–§15.4: there are no
conform slots, no relinking and no import back, and a film or a folder is not exported this way.

The timeline is the scene's as an application derives it — each block's picture, speech, music and sound
effects (§10.3), and each block's output duration — and **every block boundary is a whole frame**: the seconds
from the scene's start rounded to the nearest frame at the project's rate, ties toward the later (§11.3),
once, so that the export and playback cut on the same frame.

The OpenTimelineIO file holds one `Timeline.1` whose `Stack.1` holds:

- **one video track**, *Picture*: each block's clip, or its first frame for the whole block, or its first frame
  for the first half and its last frame for the second; a clip that spans blocks (§10.3) on every covered block's
  frames, split where a covered block's own clip plays; `Gap.1` where a block shows black or its file is
  missing;
- **one audio track per audio lane**, in this order: *Clip sound* (the clips' own sound, on the clips' frames,
  but for a clip whose `audio` is `false`), *Clip sound 2*, *Clip sound 3* … (each spanning clip's sound from its
  block's start to the end of its span, a second lane wherever two overlap, none for one whose `audio` is `false`),
  *Speech*, then each music lane (*Music*, *Music 2*, …) and each effects lane (*Effects*, *Effects 2*, …) — a
  second lane of a kind wherever two of its entries overlap; `Gap.1` for silence;
- a `Marker.2` per block, named by its id, over the block's frames.

Each clip is a `Clip.1` whose `media_reference` is an `ExternalReference.1` with a `file://` `target_url`, and
whose `source_range` starts at the frames of the file before the piece — 0 but where a spanning clip resumes
after a covered block's own clip —, in `RationalTime.1` at the project's rate (`num`/`den` as its ratio). Its
`available_range` is the media's measured length to the nearest frame where it is known. **A clip shorter than
its block**, by a frame or more, is exported at its real length followed by a `Gap.1` for the rest, on the
picture and on its own sound — never a source range past the media — and reported `held_last_frame` (playback
holds its last frame). A reference that is a URL is reported without its userinfo, its query and its fragment. **A still** is a clip of its image from 0 for its
length on the timeline, with no `available_range`.

Beside the file, the export writes a **manifest** — for each item its file, block, lane, timeline in and out
frames and source in and out frames, in exclusive — and a **report**, one entry per occurrence, with its code:
`missing_source` (a gap where a file was), `held_last_frame` (the block and the frames held), `default_format`
(a `format` field the project does not give, for which the application used its default),
`still` (a first or last frame on the picture), and
`unknown_block` (a `spans` naming no later block, read as the owning block alone).

---

## 16. Interchange with existing standards

### 16.1 Summary

| Domain | Standard | Status |
|---|---|---|
| Screenplay | **Fountain** | adopted, import and export of screenplay content (§10.4, §16.6) |
| Screenplay | **FDX** | direct import, retaining source element types, outline groups, production entities and metadata (§16.6) |
| Screenplay | **PDF** | import of a text PDF by its layout (§16.6) |
| Screenplay | **Word DOCX** | import by screenplay paragraph styles, otherwise indentation (§16.6) |
| Screenplay | **RTF** | import by paragraph indentation (§16.6) |
| Screenplay | **Fade In** | import of typed Open Screenplay Format paragraphs from a `.fadein` ZIP (§16.6) |
| Subtitles and timing | **SRT**, **WebVTT** | adopted; import produces timed blocks, export from dialogue cues |
| Production entities | **MovieLabs OMC v2.8** / OMC-JSON | concepts aligned; export mapping (Appendix C) |
| Colour | **ASC CDL**, **`.cube`** | adopted in styles; exported as sidecars |
| Edit | **OpenTimelineIO**; optional **EDL CMX3600**, **FCP7 XML**, **FCPXML** | export as conform; OTIO import proposes timing |
| Speech | **SSML** | optional on cues |
| Provenance | **C2PA**, **XMP** | embedded on export (§16.5) |
| Workflows | **ComfyUI workflow JSON** | native local workflow and offline batches |
| AI character definition | Character Card V2 | precedent; `creator_notes` and PNG-embedded JSON borrowed |
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

Each batch item, with its record's `request`, is the provenance of its take. On export a reader **SHOULD** write it into the output's
XMP and, where tooling allows, emit a C2PA manifest: `trainedAlgorithmicMedia` for rendered takes, and
for imported takes whatever the batch's `source` states — imported media may itself be generated or
composite and is never labelled camera capture by default. The `human` block records the human
contribution to each output; it is evidence, not a legal determination. A reader **MAY** produce an
authorship report walking batches, picks and commentary.

---

### 16.6 Screenplay import

A screenplay is imported from **Final Draft** XML (`.fdx`), **Fountain** (§10.4), a **text PDF**,
**Word** (`.docx`), **RTF** or **Fade In** (`.fadein`). The file's content decides its format, never its
extension: a file whose first 1024 bytes hold `%PDF-` is a PDF; a ZIP with `word/document.xml` is Word;
otherwise a ZIP whose `document.xml` root is `document type="Open Screenplay Format document"` is Fade In,
and any other ZIP is refused. A leading `{\rtf` selects RTF. Files and each ZIP member's declared uncompressed
size are bounded at 16 MiB, before inflation. Other input is decoded — as UTF-8, as UTF-16 where it starts with a byte-order mark, else as Windows-1252 — and
text that begins with an XML declaration or a `FinalDraft` element is Final Draft, an XML document with another
root being refused as no Final Draft file; every other text is Fountain, a `.txt` included: a typewriter-style
indented script then reads largely as one, since leading spaces are not significant, and what it misreads
stays readable as action. A recognised format is read by its own reader only; no other reader is tried after
it fails. Where the screenplay has no title, the file's name without its extension names the project; the
extension only filters a file picker.

Every reader produces the same ordered element list — scene heading, action, character cue, parenthetical,
dialogue, lyric, transition, section and the rest, each with its words, its scene number, its dual-dialogue
group and its place in the source — and one conversion maps that list onto documents for every format: the
scenes, blocks, characters, locations and folders below, described for Final Draft, with its production
tags and outline levels where only Final Draft has them. A PDF is classified by its own
layout: its action margin and its cue and dialogue indents are measured on the script itself, and a line it
cannot classify stays readable as `action`. Page numbers, `CONTINUED` and `(MORE)` are dropped by what they
are. Read by its layout — a PDF, or a Word or RTF file read by its indents — a scene heading is written in
capitals, and opens with `INT`, `EXT`, `EST` or `I/E` or carries a scene number
in the margin; a line of prose beside a margin number stays action. A row that is only `OMITTED`, with the scene
number and revision asterisk a shooting script keeps on it (`OMITTED 32*`), is a cut scene: it is dropped, never
read as a scene. Nothing is inferred beyond the screenplay's own elements: no arcs, props or outfits from a sentence.

Word reads direct body paragraphs and text runs, including runs in hyperlinks and insertions, with tabs as
spaces. The seven screenplay styles — Scene Heading, Action, Character, Parenthetical, Dialogue, Transition,
Shot — match paragraph style IDs or display names without case or spaces. If any paragraph carries one,
other paragraphs are action. Otherwise its own left/start indent, then its style's indent, supplies a row
relative to the smallest paragraph indent. RTF supplies the same rows from group-scoped left indents;
first-line offsets do not change them. Action paragraphs stay separate; consecutive dialogue can join.
Explicit Word page breaks and RTF page controls advance the source page. Word tables, textboxes, headers and
footers are not read. Unrecognised layout remains readable as action, with no extra rule for tab-indented
Word templates or scene numbers embedded in paragraph text.

RTF reads groups, paragraph controls, escaped braces/backslashes, tabs and line controls as spaces,
Windows-1252 bytes and hex escapes, and signed Unicode escapes with their scoped fallback skip count.
Other declared codepages deliberately decode as 1252 and log that choice. Font, colour, stylesheet, info,
picture and ignorable destinations are skipped; unknown controls keep their text. Fade In's script
paragraphs use their typed styles, unknown styles becoming general. Its title page stays separate and a
bare parenthetical gains parentheses. No additional RTF dialect, uncompressed OSF, Fade In scene-number
or dual-dialogue handling is implied.

A Fountain, PDF, Word, RTF or Fade In file with no text, or without a scene heading or a character cue followed by dialogue, is
refused with one code, `not_screenplay` — a scanned PDF, prose, a table or any other document that is not
Final Draft; unknown/corrupt ZIPs, invalid Word XML and unbalanced RTF use the same code. So is a PDF with no scene
heading and at least 20 cues followed by dialogue whose speakers are more than half as many as those speeches — a
scan whose text recognition produced cue-shaped noise, since a screenplay reuses its speakers; a speaker is the cue
without its trailing bracketed groups, regardless of case and spacing, so `MARY (ON PHONE)` and `MARY` are one.
Only a PDF's text can come from recognising a scanned page, so no other format is read for it. The cause is reported by the importer, not stored. Final Draft keeps its own refusals (below). Operational failures — a file that cannot be read, one too large, an unsupported
encoding, a destination that cannot be written — stay distinct.

A scene heading's interior/exterior prefix supplies the location's kind. Its **time of day** is the tail after
a spaced dash or a period followed by a space that contains a recognised time word as a whole word — `DAY`, `NIGHT`, `MORNING`,
`AFTERNOON`, `EVENING`, `DAWN`, `DUSK`, `SUNRISE`, `SUNSET`, `PRE-DAWN`, `NOON`, `MIDNIGHT`, `MAGIC HOUR`,
`LATER`, `CONTINUOUS`, `SAME` — read from the right while each tail holds one, its annotations riding along
(`NIGHT (1947)`); the first tail without one, and everything before it, is the location's name. A heading with
no such tail has no time. This holds for every format, Final Draft included.

**Provenance per format.** A screenplay import records where each document came from under its format's key in
`source`. A Fountain, PDF, Word, RTF or Fade In import keeps no second copy of the screenplay, the words being in the blocks;
a Final Draft import keeps the complete XML root, as ordered JSON, in `source.fdx.document` (below).

| Format | On the project | On a scene, block, resource or folder |
|---|---|---|
| Final Draft | `source.fdx`: `document` and `warnings` (below) | `source.fdx` (below) |
| Fountain | `source.fountain`: `{ name, title_page, warnings }` — the file's name, the title page's lines trimmed, unique diagnostic codes | `{ line }`: the one-based line of its first source element |
| Text PDF | `source.pdf`: `{ name, pages, margin, repairs, warnings }` — the page count, the action margin the layout was read from, the count of characters repaired | `{ page, line }` of its first source element |
| Word | `source.docx`: `{ name, warnings, styled }` — whether screenplay styles selected typed reading | `{ paragraph }` when styled, otherwise `{ page, line }` of its first source element |
| RTF | `source.rtf`: `{ name, warnings }` | `{ page, line }` of its first source element |
| Fade In | `source.fadein`: `{ name, warnings }` | `{ paragraph }` of its first script element |

A Fountain screenplay in a `.txt` file is recorded as `source.fountain`. A resource's and a folder's place is
that of the element that first named or opened it. These records describe an import, not a live mirror of
later edits.

#### Final Draft

An FDX import reads the screenplay's root `Content` in document order. Title pages, headers, footers,
script notes and other nested content are not a second screenplay. Each `Scene Heading` begins a scene,
so a changed time or location always has a new scene. The heading's location and time are read as above.
Missing facts remain absent. A
source scene title is used where present, else its heading; a scene without either is numbered. Material
before the first heading stays before that scene's first block. A screenplay without headings is one
numbered scene.

Character cues create characters, and tagged production resources, non-speaking characters included,
are kept. A cast or a list of places declared by an editor's autocomplete, such as Final Draft's
SmartType, resolves identity but creates nothing by itself, with or without an ID: such a list
accumulates transitions, typing mistakes and case variants as readily as people, so a declaration
becomes a character or a location only where the screenplay refers to it — a cue, a name met in prose
or in a resource's description, or a heading. A transition refers to nobody. A declaration takes its
tag when it is promoted, so one the screenplay never refers to creates no entity, takes no tag and is
reported. Every bracketed group ending a cue is a delivery note, not a new person: `(V.O.)`, `(O.S.)`
and `(CONT'D)`, and equally `(ON PHONE)` or a mistyped `(V.0.)`, kept as the source spells it. A cue
that is nothing but a bracketed group, such as `(MORE)`, names nobody and is dropped, leaving the
speaker in force. Tagged locations, props, wardrobe and other resources become their corresponding library
entities. Unknown production categories become `mi` entries with `kind: "other"`; their category and
full definition remain in provenance. A production occurrence's tag number is resolved through its
definition ID; it is not itself the resource's identity. An importer does not infer hair, voice, costume
ownership or props from an untagged sentence.

A filename-safe source entity ID becomes its tag, including a canonical UUID (§5.2); case is folded to
lowercase, and braces around a UUID are removed. The exact original ID remains in `source.fdx.id`. A
scene heading's `SceneProperties` attributes that have no field of their own — Final Draft's `Length`,
the page eighths a schedule counts, and `Page`, where the scene falls, among them — are kept under the
scene's `source.fdx` by their own names.
Missing, unsafe or conflicting IDs receive deterministic unused sequential tags; the mapping is recorded
by the entity's tag and provenance, and a diagnostic records a remapped or duplicate source ID. Block
IDs remain `bl_<n>` (§10.3), with source paragraph IDs in provenance. The imported author is the current
viewer, its files are version 1, and that author's owner is the first director. Its one epoch is the
owner's first allocated id, `<owner>-1`, with `next_epoch` 2, as for any new project (§8.2), labelled as
the import asks and without inventing a story year.

Dialogue and lyrics retain the concatenated `Text` runs exactly, including their whitespace and spoken
names. Descriptive action, parentheticals, summaries and resource descriptions replace unambiguous whole
character names with `@ch_<tag>`, longest names first, without replacing part of a word or an existing
mention. Matching is case-insensitive and treats runs of whitespace within a name as equivalent. Combining marks and supplementary letters remain part of words. Ambiguous names stay literal with a diagnostic. Display names,
source identities and archived source text are not prose substitutions. The source paragraphs' order
remains the blocks' order. A character cue, the parentheticals after it and the speech they introduce
are one speech and become one block, carrying `character`, `dialogue` and the directions in the order
written, the cue's delivery before the parentheticals; the production tags the cue line carried are
kept on the scene, as they are when the cue has a block of its own. A cue no speech follows keeps a
block of its own in the speech's shape — its `character` and its delivery as `direction`, or its name
where it has no delivery — so that it survives in reading order, and so does each parenthetical no
speech follows, as a direction block of its own.
A paragraph with no words is the editor's blank line: it becomes no block and consumes nothing held
for the speech that follows. Transitions, shots, general text and unknown paragraphs remain readable
as `action`, distinguished by `screenplay_element`; parallel speech retains `dual_dialogue`.

`Outline 1`, `Outline 2` and subsequent outline levels become nested folders. A following level closes
folders at its depth or deeper. `New Act` starts an act folder, `Sequence` a sequence folder, and `End of
Act` closes the act after preserving its text. An outline's depth is not evidence that it is an episode;
its folder has `kind: "outline"`. Without explicit grouping, scenes are project children in source order.

`source.fdx` is structured provenance, preserved through normal saves and forks. On the project it holds
`document`, an ordered JSON representation of the complete XML root, and `warnings`, unique diagnostic
codes. Each XML element is `{ "element": "OriginalName", "attributes": { ... }, "children": [ ... ] }`;
non-element nodes have `kind` and `value`, and a processing instruction also keeps its `target`. Child order, text and source attribute spelling are retained,
including information with no FilmOpen equivalent. XML escaping and quote style are not semantic data.
On a resource it may hold `id`, `category` and `definition`; on a scene, folder or block, `id`, the
one-based screenplay `paragraph` position and the original `element` spelling. These records describe
an import, not a live mirror of later edits. An exporter must not substitute them for current content.

Import is local and executes no code, fetches no URL and resolves no external entity. Malformed XML,
DTDs, non-script documents and empty scripts are refused before writing, as is any file that is not a
recognised screenplay. Limits on input bytes, nesting and node count are application safeguards. The import
creates a new project folder and never modifies the source screenplay or an existing film.

---

## 17. Editing by hand or by machine

The format is meant to be edited without any FilmOpen application. For a person or an agent:

1. **Never rename an entity file.** Create a new version.
2. **Edit only files whose author is you.** To change someone else's, fork it: copy, rename to your
   handle and `v1`, set `forked_from`. A delegated edit to another's file is still valid data; the
   maintainer decides whether to accept it.
3. **Prefer not to edit a version named by `_official.json`.** Fork instead. If you must, you are changing
   what everyone sees.
4. **Keep the header in step with the filename.**
5. **Never renumber block ids.** Add with the next unused number; reorder by moving array elements.
6. **Short references** in story files; **full references** in `forked_from`, `pick`, `on`; **media
   references** in `picks`, a media entry's `reference`, `preview`, `file`.
7. **Do not write takes into entities.** Drop conforming media into `media/`, or name it in a batch;
   a reader will find it. Hand-supplied media may keep its own file name in `media/` (§6.3).
8. **No secrets in the project.**
9. **Preserve fields you do not understand.**
10. What the format cannot say goes in `notes`, in `metadata` for a free-form attribute of the film (§7), or in `x`
    for structured application data.
11. **Your fork is used by you without further ado** — because forking records it as your pick
    (§13.1, §6.1). Without a pick you are on official. To use someone else's version in your work, set
    `pick` in your `cm_` file for the entity; to go back to official, remove it (§13.4). An application
    does this for you when you fork, pick or abandon.
12. **Choose a tag that says nothing a person may change.** A filename is permanent (rule 1), so a tag
    holds no name, no kind and no position: a scene that is renamed, or moved to another folder, keeps
    its tag. An application numbers what it creates — scenes `1`, `2`, …, folders `f1`, `f2`, …, the next
    number after the highest in use — and asks a person for the name alone. The `f` keeps a folder's cues
    apart from a scene's: `cu_f1.1` and `cu_1.1` are two files, where two plain numbers would make them
    one. A tag chosen by hand (`cold-open`) is as valid. A project's own tag stays a person's choice,
    since it names the folder on disk.

A machine generating a project from a film should produce: `pj_`, listing the script in order in
`children`; one `ch_` per identified speaker with `aliases`; `lo_` per setting; `sc_` files with timed
blocks, numbered; `fo_` folders only where the source has parts worth keeping — acts, episodes — each
listing its scenes; `sh_` per detected cut with `place`; `cu_` per dialogue line; an import batch;
extracted takes — and nothing else.

---

## 18. Conformance

### 18.1 Files

A conforming file is UTF-8 JSON with no duplicate keys, named by the grammar for its category, with the
required header for that category. Writers **SHOULD** pretty-print with two-space indentation for
readable diffs; whitespace is not semantic.

### 18.2 Readers

A conforming reader:

- **MUST** parse every filename by the grammars in §5.4 and dispatch on type;
- **MUST** read `filmopen-project.json` when present (§4.4) and read documents and media from the
  folders of §4.2; **MUST NOT** refuse a folder that lacks the manifest;
- **MUST** resolve references by §6;
- **MUST** discover takes by scanning and by batches, and **MUST NOT** require entities to list them;
- **MUST** preserve unknown fields, the `x` object and the `metadata` object when rewriting a file it authors;
- **MUST** read a file on disk losslessly: a key outside its type's records (Appendix A), or a value of another
  shape, is kept as written — never refused, never moved into `metadata`, never migrated — and **SHOULD** be
  warned about. An unrelated change does not repair it; an explicit removal of the key is allowed;
- **MUST NOT** assume it is the only writer, and **MUST NOT** move, rename or delete files it does not
  understand;
- **SHOULD** warn, and continue, on: a header that disagrees with its filename; a file whose author is
  not the current user being modified; an `_official.json` written by a non-director; a version named by
  `_official.json` being edited; a reference that resolves
  ambiguously; an explicit epoch that does not exist; a project file that declares no epochs; a
  `pick` (or its 1.5 spelling `prefer`) that names no file or a discarded version (§7); an `_official.json` that names a
  discarded version.

Authorship warnings are not validity tests. A file edited by someone other than its named author is
still a conforming file; whether it is accepted is the maintainer's decision.

### 18.3 Writers

A conforming writer:

- **MUST** write lowercase filenames matching §5;
- **MUST** write `filmopen-project.json` when creating a project folder (§4.4), and **SHOULD** write the
  creator's first project version with the creator as director and at least one epoch (§8.2, §8.3);
- **MUST** write the required header for the file's category;
- **MUST** check the new content a model submits — a whole document or a change to one — against the type's
  records, recursively: each object holds only the keys its record defines (§7–§14, Appendix A), each value of
  its shape; an attribute a record lacks goes under the document's or the block's `metadata` (§7, §10.3), and a
  dynamic map (Appendix A) holds its declared keys and values. `metadata`, `x`, a plug-in's settings under
  `plugins` and a media entry's own keys (§9.0) are open. A change may remove a key with `null` where the merge
  removes one — an object's key, an old unknown one included — and never introduces an unknown key. Content that
  fails is refused whole, with each path and what it expects;
- **MUST NOT** replace a **take** that exists: a take is written only where no file of that name is
  there, so nothing generated or uploaded is ever overwritten (§12.1, §12.3). A generated derivative is
  not a take and is re-made as often as it is needed: a `thumbnails/` picture (§6.3);
- **SHOULD** write only under the current user's owner handle or a workspace of it;
- **MUST NOT** delete another author's files. A take made under a workspace of the person's own, as a plugin's
  render is, is theirs (§9.0, §5.6).

### 18.4 Schemas and tests

JSON Schemas for every file type are intended to be published at `https://filmopen.ai/schema/1/<type>.json`, CC0, and
usable offline. Until released and tested, the URLs are publication targets. Schemas mark the header
and category-specific required fields as required — `children` is not one of them, an absent list being
an empty script (§8.5) — hold each entry of a `children` to §8.5's grammar, close every record Appendix A defines, leave `metadata`, `x`,
a plug-in's settings and a media entry's own keys open, and declare each dynamic map's keys and values. Appendix A's
vocabularies are suggestions a schema may describe, never enums it enforces. Cross-file resolution and
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

- **Overlays or inheritance**, but a visual treatment's (§8.7). Every file is complete.
- **Reserved key prefixes, canonical serialisation, hash-addressed JSON, UUIDs.** Any editor works.
- **Per-field attribution, immutable revisions, history files.** Credit lives in `forked_from`, `by`,
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
has a checklist of what to look for. **Each descriptive object** (`appearance`, `personality`, `lighting`, …) **is a
defined record**: new content holds to the keys listed here, and an attribute it lacks goes under the document's
`metadata` (§7, §18.3). A few objects are **dynamic maps**, each with its key and value contract: a project's
`epochs` (epoch token → `{label?, order?, year?}`) and `contributors` (owner handle → `{name?, role?}`), a
character's `voice.provider_bindings` (platform tag → voice id), `media` (group → entries, §9.0), `picks`
(what is picked — a sheet, a deliverable — → a media reference or a list of them, §9.0), `plugins` (plug-in tag → its settings, §7), `hooks` (hook
name → its code, §14.3), each of a shot's deliverables' `params` (parameter →
any value, §14.8), a cue's `music.stems` (stem name → media ref), a model's `inputs` (parameter → its declared
shape, a string) and `defaults` (parameter → any value), a platform's `models` (catalogue tag → the provider's
name), and a plug-in manifest's `implements`, `keys`, `offers`, `settings`, `entitySettings` and `actions`
(§14.4). Files on disk are read losslessly (§18.2).

Enumerated values are lowercase strings. Where a field accepts free text, the enumeration is a suggested
vocabulary, not a constraint. "media ref" means a media reference as defined in §6.3.

### A.1 Character `ch`

| Key | Type | Values / notes |
|---|---|---|
| `kind` | enum | `principal` `supporting` `extra` `group` `narrator` `creature` `animal` |
| `aliases` | string[] | script cue names, nicknames, transcript labels |
| `summary` | string | one or two sentences |
| `birth_date` | string | `YYYY`, `YYYY-MM` or `YYYY-MM-DD`; its year fills age only on a birth-date change or creation at another epoch (§9.1) |
| `appearance.age` | number or string | `30`, `"late thirties"`, or `"31 (1999)"` — the age with the year of birth; stored per epoch file (§9.1) |
| `appearance.gender` | string | free |
| `appearance.ethnicity` | string | free; optional; for continuity only |
| `appearance.species` | string | `human` default |
| `appearance.height_cm` `appearance.weight_kg` | number | |
| `appearance.build` | string | `slight` `lean` `athletic` `average` `stocky` `heavy` … |
| `appearance.skin` | string | tone, texture, notable features |
| `appearance.hair.color` `.length` `.style` `.texture` | string | length: `bald` `buzz` `short` `chin` `shoulder` `long`; texture: `straight` `wavy` `curly` `coily` |
| `appearance.facial_hair` | string | |
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
| `voice.provider_bindings` | object | platform tag → provider voice id: the active binding, the voice speech uses there (§9.1); samples and text remain the portable truth |
| `voice.active_reference` | media ref | the live `voice_samples` entry whose voice is in use (§9.1) |
| `voice.audition_text` | string | what a designed voice's previews say |
| `relationships[]` | object | `{ character, relation }` |
| `default_outfit` | tag | outfit used when a scene does not say; resolved at the character's epoch |
| `prompts.reference` `prompts.sheet` `prompts.voice` | prompt | `{ positive, negative?, created?, plugin?, writer? }` (§9); `voice` the description a voice is designed from |
| `creator_notes` | string | for people; excluded from prompts unless explicitly included |
| `picks.sheet` `picks.turnaround` `picks.expressions` | media ref or media ref[] | chosen concept sheets |
| `media` | object of groups, each an array of entries | §9.0 |
| `preview` | media ref | shown in library views |
| `render_stage` | enum | `prototype` `draft` `final`; the stage this version's renders are asked at, `prototype` where absent or of another shape (§9.0) |

### A.2 Outfit `of`

| Key | Type | Values / notes |
|---|---|---|
| `description` | string | a free description of the outfit as a whole |
| `garments[]` | object | `{ item, color, material, fit, pattern, condition, notes }` |
| `accessories` | string[] | |
| `footwear` | string | |
| `palette` | string[] | hex or names |
| `era` | string | |
| `condition` | enum | `new` `worn` `distressed` `damaged` `bloodied` `wet` `muddy` |
| `prompts.reference` `prompts.sheet` `creator_notes` `picks.sheet` `media` `preview` | | as for character; no `voice` |
| `render_stage` | enum | `prototype` `draft` `final`; the stage this version's renders are asked at, `prototype` where absent or of another shape (§9.0) |

### A.3 Location `lo` and Prop `pr`

**Location**

| Key | Type | Values / notes |
|---|---|---|
| `kind` | enum | `interior` `exterior` `both` |
| `aliases` | string[] | slugline names |
| `geography` | object | `{ city, region, country, coordinates }`, each a string — `coordinates` as text, `"38.7, -9.1"` |
| `era` | string | period of the architecture and dressing |
| `architecture` | string | style, materials, scale |
| `description` | string | |
| `dressing` | string[] | props and set dressing habitually present |
| `areas` | tag[] | sub-locations `<parent>.<area>` |
| `within` | tag | the location this one lies inside; informational (§9.3) |
| `lighting.default` | string | |
| `lighting.practicals` | string[] | visible light sources |
| `lighting.windows` | string | direction, size, coverings |
| `sound.room_tone` `sound.ambience` | string | |
| `weather` | string | default, exteriors |
| `time_of_day` | enum | default; see A.5 |
| `access` | string | entrances, exits, sightlines |
| `palette` | string[] | |
| `prompts.reference` `prompts.sheet` `creator_notes` `picks.sheet` `media` `preview` | | |
| `render_stage` | enum | `prototype` `draft` `final`; the stage this version's renders are asked at, `prototype` where absent or of another shape (§9.0) |

**Prop**

| Key | Type | Values / notes |
|---|---|---|
| `kind` | enum | `vehicle` `weapon` `document` `device` `furniture` `food` `tool` `clothing-item` `creature` `other` |
| `hero` | boolean | seen close; needs a strong reference |
| `description` `scale` `material` `condition` | string | |
| `interaction` | string | how characters handle it |
| `sound` | string | what it sounds like |
| `prompts.reference` `prompts.sheet` `creator_notes` `picks.sheet` `media` `preview` | | |
| `render_stage` | enum | `prototype` `draft` `final`; the stage this version's renders are asked at, `prototype` where absent or of another shape (§9.0) |

### A.4 Shot `sh`

| Key | Type | Values |
|---|---|---|
| `size` | enum | `ecu` extreme close-up · `cu` close-up · `mcu` medium close-up · `ms` medium · `mls` medium long / cowboy · `ls` long / wide · `els` extreme long · `ots` over-the-shoulder · `pov` · `two-shot` · `group` · `insert` · `establishing` · `master` |
| `angle` | enum | `eye` `low` `high` `dutch` `overhead` `birds-eye` `worms-eye` `profile` `three-quarter` `frontal` `reverse` |
| `movement` | enum | `static` `pan` `tilt` `push-in` `pull-out` `truck` `pedestal` `crane` `boom` `handheld` `steadicam` `tracking` `arc` `orbit` `zoom-in` `zoom-out` `rack-focus` `whip-pan` `drone` |
| `movement_notes` | string | speed, start and end framing |
| `lens.focal_mm` | number | |
| `lens.aperture` | number | f-stop |
| `lens.dof` | enum | `shallow` `moderate` `deep` |
| `lens.anamorphic` | boolean | |
| `lens.focus` | string | what is sharp; rack targets |
| `camera_character` | string | how the camera feels in the shot: `restless`, `patient`, `intimate`, `observing` …; a character, where `movement` is a move (§11.1) |
| `speed` | enum | `normal` `slow` `fast` `timelapse` `freeze` |
| `speed_factor` | number | `0.5` = half speed |
| `lighting.key.direction` | enum | `front` `side` `three-quarter` `back` `rim` `top` `under` |
| `lighting.key.quality` | enum | `hard` `soft` |
| `lighting.style` | enum | `high-key` `low-key` `natural` `practical` `silhouette` `neon` `firelight` `mixed` |
| `lighting.color_temp_k` | number | |
| `lighting.contrast` | enum | `flat` `normal` `high` `extreme` |
| `lighting.practicals` | string[] | |
| `lighting.notes` | string | |
| `composition.headroom` | enum | `tight` `normal` `loose` `none` |
| `composition.lead_room` | string | |
| `composition.eyeline` | string | |
| `composition.screen_direction` | string | `facing left` `moving right` … |
| `composition.symmetry` | enum | `centred` `thirds` `asymmetric` |
| `composition.depth` | object | `{ foreground, midground, background }` |
| `composition.blocking` | string | where characters are and move |
| `characters` | tag[] | visible in frame; appearance and outfit come from the scene cast |
| `props` | tag[] | visible in frame |
| `action` | string | what happens within the shot, in order |
| `continuity` | string[] | states that must match adjacent shots |
| `vfx` | string | |
| `aspect` | string | override of project aspect |
| `duration_sec` | number | target; the hold for a still |
| `deliverables` | object | keys `storyboard` `first_frame` `last_frame` `keyframes` `clip`; each `{ model, platform?, prompt, negative?, refs?, from?, inputs?, params? }` |
| `place` | object | §11.3 |
| `picks` | object | one media ref, or several frames, per deliverable |
| `render_stage` | enum | `prototype` `draft` `final`; the stage this version's renders are asked at, `prototype` where absent or of another shape (§9.0) |
| `coverage` | string | notes on what else was shot for this beat |

### A.5 Scene `sc` and folder `fo`

**Scene**

| Key | Type | Values |
|---|---|---|
| `location` | tag | one; `location_epoch` overrides the scene epoch for the location |
| `epoch` | epoch | one: the time the scene is set in |
| `story_day` | number | continuity day |
| `time` | enum | `dawn` `morning` `midday` `afternoon` `golden-hour` `dusk` `blue-hour` `night` `late-night` |
| `weather` | string | `clear` `overcast` `rain` `storm` `fog` `snow` `wind` `heat-haze` … free |
| `cast[]` | object | `{ character, epoch?, outfit?, notes? }` — one selection per character |
| `props` | array | tags, or `{ prop, epoch }` for an explicit state |
| `style` | tag | |
| `synopsis` | string | |
| `purpose` | string | what the scene does for the story |
| `mood` | string | |
| `pacing` | enum | `slow` `measured` `brisk` `frantic` |
| `target_duration_sec` | number | |
| `sound` | object | `{ ambience, notes }` |
| `continuity` | string[] | |
| `vfx` | string | |
| `shots` `cues` | tag[] | order of the scene's shots and cues |
| `blocks` | array | §10.3 |
| `next_block` | number | the number the next new block takes (§10.3) |
| `location_epoch` | epoch | the location's epoch where it differs from the scene's (§10.2) |
| `scene_heading` `scene_number` | string | the source's heading and printed number, from import (§10.2) |
| `outfits` | tag[] | outfits explicitly used in the scene (§10.2) |
| `resources` | stem[] | other production resources as typed short stems, `mi_smoke` (§10.2) |

**Folder**

| Key | Type | Values |
|---|---|---|
| `kind` | token | `season` `installment` `episode` `act` `arc` `sequence` `part` `chapter`; another token is kept and shown as written; a folder may have none (§10.1) |
| `synopsis` | string | |
| `children` | entry[] | what the folder holds, in order: `<type>_<tag>` or a full reference, of type `fo` or `sc` (§8.5) |
| `visual_style` | object | the folder's visual treatment, over its parents' (§8.7, A.11) |
| `media` `preview` | | its `reference_images` and the one shown as its cover (§9.0) |
| `render_stage` | enum | `prototype` `draft` `final`; the stage this version's renders are asked at, `prototype` where absent or of another shape (§9.0) |

A folder cascades nothing but its `visual_style`: it carries no `epoch`, `cast`, `locations` or `styles`
(§10.1).

### A.6 Cue `cu`

| Key | Type | Values |
|---|---|---|
| `kind` | enum | `dialogue` `narration` `music` `sfx` `ambience` |
| `scene` or `folder` | full ref | what the blocks belong to: a scene's version, or, for a cue that spans scenes, a folder's (§11.2) |
| `blocks` | id[] | span, within `scene` |
| `anchors[]` | object | `{ scene, blocks }` when a folder's cue cites specific scenes' blocks |
| `character` | tag | dialogue and narration |
| `spoken` | string | replaces block text |
| `ssml` | string | alternative to `spoken` |
| `lang` | string | BCP 47 |
| `delivery.effort` | enum | `whisper` `quiet` `normal` `raised` `shout` |
| `delivery.emotion` | string | |
| `delivery.processing` | enum | `none` `phone` `radio` `pa` `distant` `underwater` |
| `delivery.adr` | boolean | replaces on-camera sound |
| `music.tempo_bpm` `music.key` | number / string | `72`, `"D minor"` |
| `music.instrumentation` | string[] | |
| `music.mood` `music.genre` `music.structure` | string | |
| `music.reference` | string | a description, never a copyrighted recording as a target |
| `music.lyrics` | string | |
| `music.stems` | object | named stem → media ref, when a delivered piece is split |
| `sfx.description` | string | |
| `sync[]` | object | `{ with, offset_ms, event }` — hit points |
| `model` `platform` | tag | |
| `place` | object | §11.3 incl. `gain_db` `pan` `fade_in_ms` `fade_out_ms` |
| `picks` | object | `voice` `music` `sfx` `ambience` |

### A.7 Style `st`

| Key | Type | Values |
|---|---|---|
| `description` | string | the style in a sentence or two (§9.5) |
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
| `color_temp_bias` | enum | `cool` `neutral` `warm` |
| `aspect` `letterbox` | string / boolean | |
| `lens_character` | string | flare, breathing, distortion |
| `cdl` | object | `{ slope[3], offset[3], power[3], saturation }` |
| `lut` | media ref | `.cube` |
| `prompts.treatment` `media` `preview` | | `prompts.treatment` at the top, as the leaves it shares (§9.5) |

### A.8 Block

| Key | Type | Values |
|---|---|---|
| `id` | string | `bl_<n>`; never renumbered, never given out twice in one file, never shown (§10.3) |
| `character` | tag | the one speaker |
| `dialogue` | string | what the speaker says |
| `direction` | string | the note for the actor; `(O.S.)` `(V.O.)` `(dual)` at its head (§10.4) |
| `action` | string | what happens |
| `duration_sec` | number | greater than zero; absent is *auto* |
| `beats` | array of objects | each `{ position?, description?, duration_sec? }`; `position` `before_dialogue` · `during_dialogue` · `after_dialogue` (§10.3) |
| `subtitles` | array of objects | each `{ position?, text?, duration_sec? }`; `position` as a beat's (§10.3) |
| `output_duration_sec` | number | greater than zero; absent, the application's rule decides |
| `lang` | BCP 47 | |
| `prompts` | object | `first_frame`, `last_frame`, `clip`: each a prompt `{ positive, negative?, created?, plugin?, writer? }` (§9) |
| `updated` | RFC 3339 | when the block's text last changed (§10.3) |
| `media` | object of groups, each an array of entries | §10.3; the groups and their `spans` |
| `start_ms` `end_ms` | number | observed timing, from import |
| `screenplay_element` | string | the source paragraph's category, from import (§10.3) |
| `dual_dialogue` | string | groups parallel speech from the source (§10.3) |
| `source` | object | provenance of a screenplay import, under its format's key (§10.3) |
| `metadata` | object | the block's free-form attributes (§7) |

Every key is optional; an empty block is still a block. A block written before 1.23 reads by §10.3's
rule.

### A.9 Project `pj`

`author` `v` `forked_from?` `version_label?` `name` `kind?` (`short-film` `film` `mini-series` `series`) `genre[]` `year`
`logline` `synopsis` `lang` `rating` `format{aspect,fps,resolution,color,width?,height?,pixel_aspect?,sample_rate?,channels?,subtitles?{font,size}}` `runtime_min`
`credits[{role,name,handle}]` `epochs{<token>: {label?, order?, year?}}` (at least one; the first is the
default) `next_epoch` (a whole number, the allocation floor, §8.2) `contributors` `tracks` `license` `hooks` `media` `preview`
(its `reference_images` and its cover, §9.0) `visual_style` (the film's visual treatment, §8.7,
A.11), and `children[]`, the script: its folders and scenes in order, each entry `<type>_<tag>` or a full
reference (§8.5).

Recommended `genre` tokens: `action` `adventure` `animation` `biography` `comedy` `crime` `documentary`
`drama` `family` `fantasy` `historical` `horror` `musical` `mystery` `noir` `romance` `science-fiction`
`thriller` `war` `western`. A project may name others.

### A.10 Render batch item

`n` `group` `source` `deliverable` `take` `output` `sha256` `duration_ms` `at{ms|start_ms,end_ms}`
`human{selected_from,prompt_edited_by,manual_edits[]}` `job_id` `attempts` `error` `thumbnail` `poster`
`proxy` `waveform` `mime_type` `bytes` `width` `height` `fps` `frame_count` `sample_rate` `channels`
`reported{}` `metadata{}` `fetched` `error{code}`.

A render record's top (§12.2): `kind` `created` `status{done|failed|cancelled}` `stack` `seed_applied`
`metadata{}` `metadata_refused[]` (no longer written; an older record's kept as read) `cost_usd` `elapsed_ms` `request{render_id,plugin,model,platform,stage,prompt,params{},seed_random,inputs[],sources[],asked_at,inputs_by_name{},treatment{visual_style{},sources{}},purpose,from{},destination{}}`.

### A.11 Visual treatment `visual_style`

On the project file and on a folder (§8.7). Every leaf is optional; one left out is inherited. The first five
are the primary leaves, which a render's prompt names (§8.7).

| Key | Type | Values |
|---|---|---|
| `camera` | string | the camera, as a prompt names it: `High-end digital cinema camera (ARRI ALEXA 35)`, `Consumer SLR (Canon)`, `Cell phone camera (iPhone)`, `35mm film camera`, `VHS camera` … |
| `camera_mount` | string | `Tripod`, `Dolly`, `Handheld` … |
| `lens` | string | a focal length in words: `28mm`, `35mm`, `50mm`, `85mm` … |
| `depth_of_field_prompt` | string | the depth of field in an f-stop's words, guidance for a picture and no calculation: `f/1.4 very shallow`, `f/2.8 shallow`, `f/4.5 medium`, `f/8 deep`, `f/11 very deep` … |
| `color_grading` | string | the grade in a word or two: `Natural`, `Cinematic warm`, `Cool blue`, `Teal and orange`, `Muted/desaturated`, `High contrast`, `Black and white`, `Vintage film` … |
| `description` | string | the treatment in a sentence or two |
| `mood` | string | |
| `medium` | string | what the picture seems made on: `16mm colour negative`, `digital cinema`, `cel animation` … |
| `look.stock` | string | as a Style's (A.7) |
| `look.grain` | enum | `none` `fine` `medium` `heavy` |
| `look.halation` | enum | `none` `slight` `strong` |
| `look.contrast` | enum | `flat` `normal` `high` `extreme` |
| `look.saturation` | enum | `mono` `low` `normal` `high` |
| `look.sharpness` | enum | `soft` `normal` `crisp` |
| `look.vignette` | enum | `none` `slight` `strong` |
| `palette` | string[] | hex, `#rrggbb`, at most eight; replaces the list it would inherit |
| `color_temp_bias` | enum | `cool` `neutral` `warm` |
| `lens_character` | string | flare, breathing, distortion |
| `depth_of_field` | enum | `shallow` `moderate` `deep` — a scale; the words are `depth_of_field_prompt` |
| `camera_character` | string | how the camera feels: restless, patient, intimate … never a claimed body — the camera is `camera` — and never a move |
| `lighting` | string | |
| `composition` | string | |
| `texture` | string | |
| `grading.shadows` `grading.midtones` `grading.highlights` | string | the grade in words, never a calibrated value |
| `prompts.treatment.positive` `prompts.treatment.negative` | string | composed after the entity's own prompt (§8.7); the prompt's `created` and `plugin` (§9) are no leaves and are never composed |
| `preset` | string | `<tag>:<entry id>` of a prompt builder's entry, `fo-styles:family-3d`: the style chosen, stored, never composed into a render's prompt (§8.7) |

---

## Appendix B — Worked example

One scene of *The Cartographer* as a story and conform example: the path from the project file down to
scene 5, and not the whole of the sample an application bundles, which holds more — a second episode,
a sequence inside it, another scene, a cue on an episode. The story and selected media are
listed below; provider/model definitions for regeneration are intentionally omitted. Model/platform
labels in the historical batches are illustrative. The supplied media has the durations recorded in the
batches. Shortened hashes are illustrative; real files use complete hashes. B.10 follows the placements.

### B.1 Files

```
the-cartographer/
  filmopen-project.json
  data/
    pj_cartographer_john123_v1.json
    ch_main-hero_30yo_john123_v1.json
    ch_main-hero_30yo_maria_v1.json
    ch_main-hero_30yo_official.json
    cm_ch_main-hero_maria.json
    lo_archive_mid-war_john123_v1.json
    pr_chart_default_john123_v1.json
    st_war-grade_default_maria_v1.json
    st_war-grade_default_official.json
    fo_s1_john123_v1.json
    fo_e2_john123_v1.json
    sc_5_john123_v1.json
    sh_5.1_john123_v1.json
    sh_5.2_john123_v1.json
    cu_5.1_john123_v1.json
    cu_5.2_john123_v1.json
    cu_5.3_john123_v1.json
    rd_7c21_john123.json
    rd_8af0_maria.json
    rd_8af1_maria.json
    rd_8af2_maria.json
    rd_8af3_maria.json
    rd_8af4_maria.json
    rd_8af5_maria.json
    rd_8af6_maria.json
    rd_8af7_maria.json
  media/
    cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1.png
    voice-calm.wav
    cs_lo_archive_mid-war_john123_v1_r7c21_john123_1.png
    ff_sh_5.1_john123_v1_r8af1_maria_1.png
    cl_sh_5.1_john123_v1_r8af2_maria_1.mp4
    ff_sh_5.2_john123_v1_r8af3_maria_1.png
    cl_sh_5.2_john123_v1_r8af4_maria_1.mp4
    vo_cu_5.1_john123_v1_r8af5_maria_1.wav
    am_cu_5.2_john123_v1_r8af7_maria_1.wav
    vo_cu_5.3_john123_v1_r8af6_maria_1.wav
```

The manifest identifies the folder; the JSON is flat in `data/` and the media flat in `media/`:

```json
{ "filmopen": 1, "tag": "cartographer" }
```

The script's structure is in the files of B.5, never in directories on disk.

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
  "children": ["fo_s1"],
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
  "voice": { "description": "low, unhurried, slight rasp", "pitch": "low", "pace": "slow", "lang": "pt-BR" },
  "media": { "voice_samples": [ { "reference": "voice-calm.wav" } ] },
  "prompts": { "reference": { "positive": "30yo woman, olive skin, black shoulder-length hair, lean build, burn scar left forearm",
              "negative": "cartoon, plastic skin" } },
  "created": "2026-09-05T18:04:11Z", "updated": "2026-09-05T19:22:40Z"
}
```

```json
{
  "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo", "author": "maria", "v": 1,
  "name": "Kira Voss", "kind": "principal", "aliases": ["KIRA"],
  "forked_from": "ch_main-hero_30yo_john123_v1",
  "summary": "A cartographer who discovers her maps are rewriting the coastline.",
  "appearance": { "age": 30, "gender": "woman", "build": "lean", "skin": "olive",
                  "hair": { "color": "copper red", "length": "short", "style": "cropped, undercut" },
                  "eyes": { "color": "dark brown" }, "marks": ["burn scar, left forearm", "small compass-rose tattoo, right wrist"] },
  "personality": { "summary": "Guarded, precise.", "speech": "Short sentences." },
  "voice": { "description": "low, unhurried, slight rasp", "pitch": "low", "pace": "slow", "lang": "pt-BR" },
  "prompts": { "reference": { "positive": "30yo woman, olive skin, cropped copper-red hair with undercut, lean build, burn scar left forearm, small compass tattoo right wrist",
              "negative": "cartoon, plastic skin" } },
  "picks": { "sheet": "cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1" },
  "media": { "character_sheets": [ { "reference": "cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1", "batch": "rd_8af0_maria", "item": 1, "duration_ms": 0, "width": 320, "height": 180, "stage": "final" } ],
             "voice_samples": [ { "reference": "voice-calm.wav" } ] },
  "preview": "cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1",
  "created": "2026-09-06T09:12:00Z", "updated": "2026-09-06T10:31:02Z"
}
```

```json
{ "filmopen": 1, "type": "ch", "tag": "main-hero", "epoch": "30yo",
  "official": "ch_main-hero_30yo_maria_v1",
  "set_by": "john123", "set_at": "2026-09-06T14:20:00Z", "note": "The red hair reads better against the archive." }
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
  "sound": { "room_tone": "large, dead, high ceiling", "ambience": "rain on skylight, distant sirens" },
  "prompts": { "reference": { "positive": "1930s municipal archive reading room, iron shelving, skylight, green desk lamps, sandbagged windows, wartime, dust" } },
  "picks": { "sheet": "cs_lo_archive_mid-war_john123_v1_r7c21_john123_1" },
  "media": { "location_sheets": [ { "reference": "cs_lo_archive_mid-war_john123_v1_r7c21_john123_1", "batch": "rd_7c21_john123", "item": 1 } ] },
  "created": "2026-09-05T18:30:00Z", "updated": "2026-09-05T18:30:00Z"
}
```

```json
{
  "filmopen": 1, "type": "pr", "tag": "chart", "epoch": "default", "author": "john123", "v": 1,
  "name": "The 1994 harbour chart", "kind": "document", "hero": true,
  "description": "Hand-drawn nautical chart, yellowed linen-backed paper, sepia ink, folded twice.",
  "prompts": { "reference": { "positive": "hand-drawn nautical chart, yellowed linen paper, sepia ink, fold creases" } },
  "created": "2026-09-05T18:40:00Z", "updated": "2026-09-05T18:40:00Z"
}
```

```json
{
  "filmopen": 1, "type": "st", "tag": "war-grade", "epoch": "default", "author": "maria", "v": 1,
  "name": "War — gritty, desaturated",
  "look": { "stock": "16mm colour negative", "grain": "medium", "contrast": "high", "saturation": "low" },
  "palette": ["#2b2f33", "#6b7076", "#b9bcb8", "#d9c9a3"],
  "prompts": { "treatment": { "positive": "desaturated, cold grey palette, high contrast, 16mm grain, handheld", "negative": "saturated, glossy" } },
  "cdl": { "slope": [0.95, 0.98, 1.05], "offset": [-0.02, -0.02, 0.0], "power": [1.1, 1.1, 1.05], "saturation": 0.6 },
  "created": "2026-09-06T08:00:00Z", "updated": "2026-09-06T08:00:00Z"
}
```

```json
{ "filmopen": 1, "type": "st", "tag": "war-grade", "epoch": "default",
  "official": "st_war-grade_default_maria_v1", "set_by": "john123" }
```

### B.5 Folders

```json
{ "filmopen": 1, "type": "fo", "tag": "s1", "author": "john123", "v": 1,
  "name": "Season 1", "kind": "season", "children": ["fo_e2"],
  "created": "2026-09-05T18:00:00Z", "updated": "2026-09-05T18:00:00Z" }
```

```json
{
  "filmopen": 1, "type": "fo", "tag": "e2", "author": "john123", "v": 1,
  "name": "Episode 2 — Low Tide", "kind": "episode",
  "synopsis": "Kira finds the first altered chart.",
  "children": ["sc_5"],
  "created": "2026-09-05T18:00:00Z", "updated": "2026-09-06T12:00:00Z"
}
```

The folders say nothing about what their scenes hold: the epoch, the cast, the location and the style of
scene 5 are the scene's own (B.6).

### B.6 Scene

```json
{
  "filmopen": 1, "type": "sc", "tag": "5", "author": "john123", "v": 1,
  "name": "The archive",
  "location": "archive", "epoch": "mid-war", "story_day": 3, "time": "night", "weather": "rain",
  "cast": [{ "character": "main-hero", "epoch": "30yo" }],
  "props": ["chart"], "style": "war-grade",
  "synopsis": "Kira compares the two charts and realises the coastline moved.",
  "purpose": "First proof. Turns the mystery from doubt to certainty.",
  "target_duration_sec": 40,
  "shots": ["5.1", "5.2"],
  "cues": ["5.1", "5.2", "5.3"],
  "blocks": [
    { "id": "bl_1", "action": "Kira spreads both charts across the reading table." },
    { "id": "bl_2", "character": "main-hero", "dialogue": "The bay was here last spring.", "direction": "flat disbelief, does not look up" },
    { "id": "bl_3", "action": "Behind her, the window flashes white. A second later, the glass goes." },
    { "id": "bl_4", "character": "main-hero", "dialogue": "Not now.", "direction": "(O.S.)" }
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
  "size": "mcu", "angle": "eye", "movement": "push-in", "movement_notes": "slow, ends tight on her hands",
  "lens": { "focal_mm": 50, "dof": "shallow" },
  "lighting": { "key": { "direction": "side", "quality": "soft" }, "style": "low-key", "color_temp_k": 3200, "practicals": ["green desk lamp"] },
  "duration_sec": 8,
  "deliverables": {
    "first_frame": { "model": "nanobanana", "prompt": "Kira leaning over two nautical charts on an oak table, green desk lamp, archive shelving behind, 16mm grain",
                    "refs": ["cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1", "cs_lo_archive_mid-war_john123_v1_r7c21_john123_1"] },
    "clip": { "model": "seedance25", "prompt": "slow push in as she traces the coastline with a finger and speaks without looking up", "from": "first_frame" }
  },
  "place": { "track": "pic", "with": "scene", "offset_ms": 0 },
  "picks": { "first_frame": "ff_sh_5.1_john123_v1_r8af1_maria_1", "clip": "cl_sh_5.1_john123_v1_r8af2_maria_1" },
  "created": "2026-09-06T12:10:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

```json
{
  "filmopen": 1, "type": "sh", "tag": "5.2", "author": "john123", "v": 1,
  "name": "The window goes", "scene": "sc_5_john123_v1", "blocks": ["bl_3", "bl_4"],
  "characters": ["main-hero"],
  "size": "ms", "angle": "low", "movement": "static",
  "lens": { "focal_mm": 35, "dof": "moderate" },
  "lighting": { "key": { "direction": "back", "quality": "hard" }, "style": "low-key", "notes": "single white flash from behind, then darkness with lamp only" },
  "continuity": ["charts still on the table", "scar visible, left forearm"],
  "vfx": "glass shatter, no debris toward lens",
  "duration_sec": 5,
  "deliverables": {
    "first_frame": { "model": "nanobanana", "prompt": "low angle, Kira in medium shot at the archive table, the window behind her blown white", "refs": ["cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1"] },
    "clip": { "model": "seedance25", "prompt": "the window flashes white, glass falls, she does not turn", "from": "first_frame" }
  },
  "place": { "track": "pic", "after": "sh_5.1", "offset_ms": 0, "transition_in": { "kind": "cut" } },
  "picks": { "first_frame": "ff_sh_5.2_john123_v1_r8af3_maria_1", "clip": "cl_sh_5.2_john123_v1_r8af4_maria_1" },
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
  "place": { "track": "dx", "with": "sh_5.1", "offset_ms": 2750, "gain_db": -3 },
  "picks": { "voice": "vo_cu_5.1_john123_v1_r8af5_maria_1" },
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
  "place": { "track": "dx", "with": "sh_5.2", "offset_ms": -1500, "gain_db": -3 },
  "picks": { "voice": "vo_cu_5.3_john123_v1_r8af6_maria_1" },
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
  "place": { "track": "amb", "with": "scene", "offset_ms": 0, "in_ms": 0, "out_ms": 13000, "fade_in_ms": 1000, "fade_out_ms": 1500, "gain_db": -18 },
  "picks": { "ambience": "am_cu_5.2_john123_v1_r8af7_maria_1" },
  "created": "2026-09-06T12:25:00Z", "updated": "2026-09-06T16:00:00Z"
}
```

### B.9 Render batch and commentary

```json
{ "filmopen": 1, "type": "rd", "id": "7c21", "author": "john123", "kind": "manual",
  "status": "done", "items": [
    { "n": 1, "source": "lo_archive_mid-war_john123_v1", "deliverable": "sheet", "group": "location_sheets",
      "output": "cs_lo_archive_mid-war_john123_v1_r7c21_john123_1.png" }
  ] }
```

```json
{
  "filmopen": 1, "type": "rd", "id": "8af0", "author": "maria", "kind": "render",
  "created": "2026-09-06T15:30:00Z", "status": "done",
  "request": {
    "render_id": "job-8af0", "plugin": "pg_fo-midjourney_filmopen_v1", "model": "midjourney", "platform": "midjourney",
    "stage": "final",
    "prompt": "character sheet, 30yo woman, olive skin, cropped copper-red hair with undercut, lean build, burn scar left forearm, compass tattoo right wrist, front three-quarter profile, neutral grey",
    "params": {}, "seed_random": true, "inputs": [], "sources": [], "asked_at": "2026-09-06T15:30:00Z" },
  "cost_usd": 0.08,
  "items": [
    { "n": 1, "source": "ch_main-hero_30yo_maria_v1", "deliverable": "sheet", "group": "character_sheets",
      "output": "cs_ch_main-hero_30yo_maria_v1_r8af0_maria_1.png", "sha256": "0faa…", "bytes": 2216,
      "mime_type": "image/png", "width": 320, "height": 180, "reported": { "width": 2048, "height": 2048 },
      "human": { "selected_from": 6 } }
  ]
}
```

`rd_8af1_maria` … `rd_8af7_maria` record the shots' first frames and clips and the cues' voices and
ambience the same way, one render job each.

```json
{
  "filmopen": 1, "type": "cm", "target": "ch_main-hero", "author": "maria",
  "pick": { "30yo": "ch_main-hero_30yo_maria_v1" },
  "picked_at": { "30yo": "2026-09-06T15:41:00Z" },
  "visited": { "30yo": "2026-09-06T15:42:00Z" },
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

A marker *sc_5* at 0:00.000; a marker on each clip carrying its stem; exported conform slots beside the editor's files, outside the project, holding
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
| `fo` | Creative Work structure / Sequence, by `kind` | a `season`, `installment` or `episode` → a Creative Work within the series; an `act`, `arc`, `sequence`, `part` or `chapter` → Sequence; a folder with no kind, or with a token outside the vocabulary, → a grouping the exporter names and reports; nested by `children` |
| `sc` | Narrative Scene | blocks → scene description and dialogue; `story_day` → Context |
| `sh` | Shot | `place` → editorial timing; with Slate where an import batch supplies one |
| take | Asset | media file with identifiers; `sha256` → identifier |
| `picks` | **Depiction** | the narrative-object-to-asset link |
| `rd` | Task and Asset provenance | `human` → participant contribution |
| `author` | Participant | owner segment |
| epoch | Context | "in which circumstances" |

---

*FilmOpen Project Specification · filmopen.ai · CC-BY-4.0*
