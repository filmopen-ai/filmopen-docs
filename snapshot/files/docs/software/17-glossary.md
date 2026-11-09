# Glossary of code names

## Appendix B — Glossary of code names

| Name | Meaning |
|---|---|
| stem | a filename without extension, e.g. `sc_5_john123_v1` |
| versions key | the stem minus author and version, e.g. `ch_main-hero_30yo`; what an official pointer names |
| group key | type and tag only, e.g. `ch_main-hero`; every epoch and version of one entity |
| `EntityGroup` | one entity: all epochs |
| `EntityVersions` | one entity at one epoch: all authors' versions |
| viewer | the author handle the user browses as; empty means none |
| block | one unit of a scene's script (Project Specification §10.3): its one speaker, `dialogue`, `direction`, `action`, `duration_sec`, its `beats`, its `subtitles`, `output_duration_sec`; addressed by an id (`bl_<n>`) the file keeps and the screen never shows |
| speaker | a block's `character`, at most one; named by `speakerName`, the scene's own reference to the character |
| `next_block` | a scene's number for its next new block, which keeps a deleted block's number from being given out again |
| resolution | the outcome of looking up a reference: an entity, or a `ResolutionProblem` |
| selection | what the detail pane shows; the tree indexes rows by selection keys |
| wrapper row | the Shots / Cues grouping under a scene, and the Cues grouping under a folder |
| folder | a `fo` entity: what groups the script, as a folder groups files; a file, never a directory on disk (the word *directory* is kept for those) |
| entry | one item of a `children` list, as written: a short stem (`sc_1`), or a full reference, which pins a version (§5.11) |
| the walk, outline | `scriptOutline`: the script as one viewer sees it, the one traversal every reader of the script shares (§5.12) |
| unfiled, not in the script | a folder or scene of the project that no drawn `children` names; listed beside the script, never hidden |
| other file | a file outside the project layout, or a document whose name the grammar does not recognize |
| manifest | `filmopen-project.json`: the fixed-name file at the root that identifies a project folder |
| media folder | the project's flat `media/` folder, holding takes and hand-supplied reference files |
| sync target | a place that holds shared copies of the film's manifest, `data/` and `media/`, reached through `SyncTarget`; the local media source remains independent of it (§6.14) |
| shared folder | the target's folder that holds a film's shared copy: `FilmOpen/<tag>` in *My Drive*, named by the manifest's `sync.id`, or the folder of this computer chosen for the film and kept in this machine's preferences; distinct from the shared library |
| sharing | a film kept in step with the sync target its manifest names (`sync`): Google Drive by the folder's id, or a folder of this computer kept in this machine's preferences; started and stopped on Settings → General → *Sharing* (§9.4), its sends, fetches and conflicts listed on *Share* (§9.7). It copies the manifest, documents and media in both directions under their transfer rules; it grants no access to another person and propagates no deletion |
| inventory | files held locally or by a sync target, indexed by project-relative path with size and, for documents, MD5; the difference uses the agreement ledger to classify sends, fetches, document conflicts and newly observed equality |
| fetch | a verified copy from a sync target into the open film: a missing file is created, a document replacement uses expected local text, and an existing media name is never replaced (§6.14) |
| ledger | `SyncLedger`: agreed document hashes and the two hashes of each conflict set aside, isolated by film and target; persisted under a hashed filename for a durable film and held in memory for a session |
| part | an unpublished media prefix retained by `SyncParts` for one film and job, flushed once when its attempt ends, resumed from its actual length and verified whole before guarded publication |
| conflict | different local and target versions of a document when neither equals their last agreement, or when no agreement exists; neither direction moves it until a fresh decision permits a transfer, and Dismiss sets aside only that exact pair of hashes |
| agreed | the document MD5 used as the common baseline for the next decision: recorded after observed equality or a verified transfer; Keep mine explicitly accepts the current target hash as that baseline before the local copy is sent |
| receipt | `SyncReceipt`: a target's confirmation of a completed send, carrying the relative path, size and optional MD5 |
| lane | one queue with its own capacity and holds; sync uses `sync:media` for media and `sync:data` for the manifest and documents |
| library, shared library | the models, platforms and plugins installed beside projects, indexed with every project |
| origin | whether an entity file came from the project folder or the library |
| short name | a segment (§5.2) as a person types it: a folder name, a tag, an epoch |
| pick | the version of an entity in use for the viewer at one epoch (§6.1 step 2): their `pick` when it names one, else official, else their own highest, else the sole owner's highest, under their plain handle before their derived handles (the project file skips the own step and counts handles, §4.1); an explicit pick wears a green check, official in use wears the star alone |
| tracking value | `pick` = `<versions key>_official`: the pick follows the official pointer |
| version label | the header's `label`: a short word shown beside the version number in lists |
| session copy | a writable project without a disk root, for one opening: the sample extracted to a fresh folder of its own, or held in memory or in an overlay over bundled assets on the web; writes never reach the bundle |
| default epoch | the first epoch the project declares; where implicit references fall back to |
| reveal | showing a file in the platform's file browser with the file selected |
| media container | an entity's `media`: an object of named groups, each an array of entries (§5.10, Project Specification §9.0) |
| group | one array of the media container, named by a lowercase snake_case word that is not reserved (`preview`, `media`): `reference_images`, `character_sheets`, … or one of an author's own |
| media entry | one object of a group: its `reference`, the `batch` and `item` of the record that made it where one did, and what the version decides — `favorite`, `archived`, `deleted`, `note`; every other key kept (`MediaEntry`) |
| last look | the viewer's `visited` at an epoch, in their own commentary file: when they last had the entity's media on screen; what arrived after it wears *New* (§9.3, Project Specification §13.4) |
| media card | the card below *General* on a character's, an outfit's, a location's or a prop's View/Edit: its media as the type's fixed places, the display's last look and the delete (`MediaCard`, §9.3) |
| media place | one group of an entity's `media` as a page shows it: the add tile, the place's jobs and its entries as tiles (`MediaPlace`, §9.3) |
| add tile | a media place's first tile: **+** above one button per action that makes a kind the place takes, *Upload* first |
| provenance strip | the line across a tile's foot saying the model, platform and cost the batch item recorded, or *Imported* (§9.3) |
