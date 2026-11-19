---
title: "Directors"
description: "Plan and time a scene's work."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/directors.md
sidebar:
  order: 1
---

A director plug-in plans a scene's work. Its manifest declares `implements.director`, and an assistant names it as its director delegate; the assistant offers the director's actions in its chat, and FilmOpen calls the director's `direct` function for each message. The director owns no key: its model calls go through the person's text model, and FilmOpen writes the scenes, runs the renders and keeps the price.

## Subtypes

- Block timing with the text model — implemented

## Plugins

- [fo-director](../../fo-director/)

[All types of plugins](../)
