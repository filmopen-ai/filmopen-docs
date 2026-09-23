# Glossary of code names

## Appendix B — Glossary of code names

| Name | Meaning |
| stem | a filename without extension, e.g. `sc_5_john123_v1` |
| versions key | the stem minus author and version, e.g. `ch_main-hero_30yo`; what an official pointer names |
| group key | type and tag only, e.g. `ch_main-hero`; every epoch and version of one entity |
| `EntityGroup` | one entity: all epochs |
| `EntityVersions` | one entity at one epoch: all authors' versions |
| viewer | the author handle the user browses as; empty means none |
| resolution | the outcome of looking up a reference: an entity, or a `ResolutionProblem` |
| selection | what the detail pane shows; the tree indexes rows by selection keys |
| wrapper row | the Shots / Cues grouping under a scene, and the Cues grouping under a folder |
| folder | a `fo` entity: what groups the script, as a folder groups files; a file, never a directory on disk (the word *directory* is kept for those) |
| entry | one item of a `children` list, as written: a short stem (`sc_1`), or a full reference, which pins a version (§5.11) |
| the walk, outline | `scriptOutline`: the script as one viewer sees it, the one traversal every reader of the script shares (§5.12) |
| unfiled, not in the script | a folder or scene of the project that no drawn `children` names; listed beside the script, never hidden |
| companion file | a file the grammar names that is not JSON (plugin code) |
| other file | a file the grammar does not name |
| manifest | `filmopen-project.json`: the fixed-name file that identifies a project folder and names its media root |
| media root | the folder takes and referenced media are read from: the manifest's `data` folder, else the project folder |
| locator | the manifest's typed "where" (`{kind, path}`) for the media root |
| library, shared library | the models, platforms and plugins installed beside projects, indexed with every project |
| origin | whether an entity file came from the project folder or the library |
| short name | a segment (§5.2) as a person types it: a folder name, a tag, an epoch |
| pick | the version of an entity in use for the viewer at one epoch (§6.1 step 2): their `pick` when it names one, else official, else their own highest, else the sole author's; an explicit pick wears a green check, official in use wears the star alone |
| tracking value | `pick` = `<versions key>_official`: the pick follows the official pointer |
| version label | the header's `label`: a short word shown beside the version number in lists |
| session copy | a project held in memory for one run of the web preview; nothing reaches a disk |
| default epoch | the first epoch the project declares; where implicit references fall back to |
| reveal | showing a file in the platform's file browser with the file selected |
