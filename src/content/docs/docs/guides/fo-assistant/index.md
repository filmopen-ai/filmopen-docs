---
title: "fo-assistant: the assistant"
description: "The default assistant: answers questions about your film and offers help where you are working."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-assistant/index.md
sidebar:
  label: fo-assistant
  order: 1
---

Plugin types: [Assistants](../plugin-types/assistants/).

FilmOpen's default assistant answers questions about your film, reviews the story, and fills in fields where you are working. It is data, not a model: FilmOpen chooses a model from the assistant's settings and runs it on your key or your [FilmOpen credit](/docs/platforms/).

## Where it appears

- **Ask about this film**, anywhere: answers a question from what the project holds, every scene, character and location whole. Asked to, it can create what the film implies, and says which details it inferred.
- **Explain my recent activity**, on the Activity rail: what ran, what it cost, what failed and why.
- **Review the story**, on the Project rail: what is strong, what is missing, and three next steps.
- **What is still unsaid**, on the Project section: what the film leaves unsaid, from its own fields.
- **Write the Synopsis**, on the Synopsis section: asks for a two-sentence summary if the film doesn't have one yet, then writes it.
- **Describe character** and its siblings, on a character, outfit, location or prop: reads the entity and fills in what it can, saying first what it read and what it will fill.

## Set up

1. [Install and allow](../plugin-packages/#install-and-allow) **FilmOpen Assistant** in **Settings → Plugins**. It owns no key: it uses the text model you chose under **Settings → General**.
2. Add a text model's key on its [platform's page](/docs/platforms/), or sign in and use FilmOpen credit.
3. Press **Ask about this film** and ask a short question.

What it sends to the model depends on the action:

- **Ask about this film:** the project overview, the folders' synopses, and every character, location and scene whole.
- **Review the story:** the same, and every outfit and prop whole.
- **What is still unsaid:** the project's main details, the scenes' synopses, and every character, location, outfit and prop whole.
- **Write the Synopsis:** the project's details and notes; each character's kind, aliases, summary, appearance, personality, relationships and reference prompt; each location's kind, description and reference prompt; the folders' synopses and notes; and each scene's story and notes, with every block's dialogue, direction and action.
- **Describe character** and **Describe location:** the entity whole, and every scene it appears in, with each block's dialogue, direction and action.
- **Describe outfit** and **Describe prop:** the entity whole.
- **Explain my recent activity:** your recent activity.

*Whole* includes the entity's creator notes and its prompts, negative prompts among them; it leaves out media and picks.
