# FilmOpen Software Specification

**The desktop application that reads, browses and edits FilmOpen projects: how it is built, and the rules that must stay true when adding to it.**

| | |
|---|---|
| **Version** | 3.0 |
| **Date** | 21 September 2026 |
| **Status** | Describes the application as of the date above. Updated in the same change as the code it describes. |
| **Companion documents** | The *FilmOpen Project Specification* defines the file format this software reads and writes; the *FilmOpen MCP Specification* describes the agent layer as an agent uses it. |
| **Repository** | `filmopen-app` (`filmopen-ai/filmopen-app` on GitHub). This specification is the folder `docs/software/` there; the pages under `packages/` are generated from the code. |

The specification is in parts. Section numbers are kept across them, since the code and the other documents cite them (§6.11, §9.3).

| Part | Sections |
|---|---|
| [Purpose](index.md) | 1 |
| [Design principles](01-principles.md) | 2 |
| [Technology](02-technology.md) | 3 |
| [Architecture: the packages, the data flow, the agent layer](03-architecture.md) | 4 |
| [The packages, one page each (generated from the code)](packages/index.md) | — |
| [The model layer](04-model.md) | 5 |
| [Services: files, the writer and the log](05-files.md) | 6.1–6.5 |
| [The account, the device and provider keys](06-account-device-keys.md) | 6.6–6.7 |
| [The issue recorder](07-recorder.md) | 6.8 |
| [Media and Google Drive](08-media.md) | 6.9–6.10 |
| [Plug-ins](09-plugins.md) | 6.11 |
| [Jobs, and bringing media in](10-jobs-insertion.md) | 6.12–6.13 |
| [State and the tree](11-state-tree.md) | 7–8 |
| [The user interface](12-user-interface.md) | 9 |
| [Localisation, and the sample project](13-localisation-sample.md) | 10–11 |
| [Testing](14-testing.md) | 12 |
| [Conventions for contributors, and third-party code](15-conventions.md) | 13, 15 |
| [Known limitations, and points to address](16-limitations.md) | 14, 16 |
| [Glossary of code names](17-glossary.md) | Appendix B |

## 1. Purpose

A FilmOpen project is a folder of plain JSON files describing a film completely: characters, outfits, locations, props, styles, documents; the script as folders and scenes, nested as in a file system, a scene holding the blocks; shots and cues; models, platforms and plugins; render batches; commentary; and official pointers. Every entity file is versioned per author (`ch_main-hero_30yo_john123_v2.json`), forking copies a file into a new author's name, and a small `_official.json` pointer names the version the project has chosen. The intent is that a film is developed the way software is developed: many people, many versions, comparison, and a deliberate choice of what is official.

FilmOpen the application is the reader and editor for such folders. It is a **reader**: open a folder, see the whole project as a tree, inspect any object, see every version of it side by side, see the media rendered for it and what people said about it, and be warned about everything the format's rules say a reader should warn about. It is a **desktop application that lives on a machine**: it knows where a project's media is (the manifest, §4.4 of the format), where the shared library of models, platforms and plugins is, where its own preferences and log are, which projects the user has opened, and it can create a project folder. It is a **writer**: a new project comes with its creator's first project file, the project file is edited in a form that saves as you type, any version can be forked, a director sets official with a star, anyone picks the version they work from with a check, and a version can be labelled.

The application is not the format. The Project Specification is authoritative about what files mean; this document is authoritative about how the application is built. Where the application simplifies the format's rules, this document says so.

### 1.1 Audience of this document

A developer, or an AI development session, who has read the Project Specification and needs to continue the code without re-deriving its structure. It explains what exists, the reasons behind the shape of it, and the rules that must stay true when adding to it.
