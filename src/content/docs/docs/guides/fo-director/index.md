---
title: "fo-director: timing your scenes"
description: "Times each block of your scenes with your text model, then divides them into shots that fit your video model."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-director/index.md
sidebar:
  label: fo-director
  order: 1
---

Plugin types: [Directors](../plugin-types/directors/).

**FilmOpen Director v1** times each block of your scenes with your text model: where each beat of action falls — before, during or after its line — and for how many seconds, and how long a block nobody speaks in lasts. It holds no key and keeps nothing between messages; every message reads the scenes again. It needs API 1, revision 1.

## Start it

1. [Install and allow](../plugin-packages/#install-and-allow) **FilmOpen Director** and the [assistant](../fo-assistant/) in **Settings → Plugins**. The assistant names the director as its delegate and offers its action.
2. Choose a text model, with a key on its [platform's page](/docs/platforms/) or your FilmOpen credit, as for the assistant.
3. On the Project rail, on the script, a folder or a scene, press **Add timing**. The assistant asks “How should it be timed?”, with **Natural pace**, **Fast and tense**, **Slow and lingering** and **Other…** for words of your own.

On the script it times every scene; on a folder, the scenes in that folder; on a scene, that scene. Each later message you write, such as *slow down the last two blocks*, times the same scenes again with every direction you have given so far.

## What it writes

For each block, in script order across the scenes, it asks your text model once, with the scene's context, the scene's blocks and their clock, the one block and your directions. The answer is checked before anything is written:

- it is valid JSON, its positions fit the block, and its numbers are above zero;
- seconds *during* a line stay within the line;
- every beat the block already has is still there, word for word, at its place and with its seconds — they change only where you gave a direction and the model says it followed one;
- a length is set only on a block nobody speaks in, so a spoken line's own length never changes.

A passing answer is written to the scene at once, so a stopped run keeps what it had. A refused answer leaves the block as it was and is not asked again. A failed call is asked once more; a second failure is reported for that block, and the next block follows. Where your direction does not concern a block that is already timed, the model keeps it and nothing is written; a block with no timing at all is always timed.

As it works, the chat says “Timing 7 blocks.” and, for each scene, a line such as “Scene 12: 4 of 4 timed.”; the progress bar reads, for example, “Timing scene 12, block 2 of 4”. Its reply names what was timed and every block refused or failed, with the reason. When every block asked failed or was refused, the turn fails with that summary.

The director also divides timed blocks into shots that fit the video model and asks FilmOpen for the frame and clip prompts and their renders, each only when FilmOpen asks it to; **Add timing** asks for timing alone.

## The models it uses

For timing, only your text model, the one FilmOpen gives it; the director chooses none. Prompts and renders, when FilmOpen asks for them, run on the models FilmOpen chooses. Timing is one text-model call a block, and one more where a call fails, on your key or your credit.

## What it logs

Everything, under `plugin.fo-director.*`, so that an error can be debugged from the log alone. Every message to the model and every answer is logged whole: the call (`timing.asked`), the answer (`timing.answered`), and what happened to it — `timing.checked`, `timing.kept` or `timing.refused`, each with the rule it was checked by, and `timing.written` with the entry written. Your directions are logged as you wrote them (`directions`), and so is each chat line (`timing.said`). A retry is `timing.retry`, a second failure `timing.failed` with each try's code and message, and a turn where nothing landed `timing.allFailed`. A run that ends early is `stopped` or `failed`, with the stage, the scene, the block and the error's message. FilmOpen stamps every line with its elapsed milliseconds. Nothing is masked; your keys never reach the log.
