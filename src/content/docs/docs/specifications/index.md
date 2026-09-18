---
title: About the specifications
description: What the three specifications are, and why they appear here as snapshots.
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/specifications/index.md
sidebar:
  label: About the specifications
  order: 0
---

FilmOpen is described by three documents, each kept with the application it describes.

| | What it specifies |
|---|---|
| **[Project Specification](/docs/specifications/project/)** | The file format: a film as a folder of plain text — the script, the shots, the cast, the prompts, the records of what was generated. It is a public draft, open for comment. |
| **[Software Specification](/docs/specifications/software/)** | The application that reads, browses and generates from a project: its parts, its screens, its rules. |
| **[MCP Specification](/docs/specifications/mcp/)** | How an agent starts, drives and reads the application over MCP. |

## Why they are snapshots

Each page is an **exact copy** of the document as it stands in the application's repository, taken at one commit; the note at the top of the page says which, and which version of the document that is. Nothing is edited here. A copy is refreshed when a milestone of the application closes, so a page may trail the newest draft by a few weeks — and never disagrees with itself.

The copies are checked by machine: every file is recorded with its SHA-256 in [`snapshot/manifest.json`](https://github.com/filmopen-ai/filmopen-docs/blob/dev/snapshot/manifest.json), and the site does not build if one differs.

## Proposing a change

Because a specification is copied and not written here, a pull request against its page cannot be merged. Open [an issue](https://github.com/filmopen-ai/filmopen-docs/issues) saying what is wrong or unclear and where; it is taken up where the document is kept, and arrives here with the next snapshot.
