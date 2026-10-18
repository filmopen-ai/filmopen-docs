---
title: "fo-model-picker: model defaults"
description: "Choose default text, image, video and speech models from the character’s render stage."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/fo-model-picker/index.md
sidebar:
  label: fo-model-picker
  order: 1
---

Plugin types: [Model Pickers](../plugin-types/model-pickers/).

**fo-model-picker v4** supplies a fixed list of default models and routes for each render kind and stage: text, still images, video and speech. It needs API 1, revision 10. It works locally without a key or network setup; it does not render. FilmOpen checks whether the selected model and route are available.

## Choose a stage

[Install and allow](../plugin-packages/#install-and-allow) **fo-model-picker** in **Settings → Plugins**. On an editable character's **Media** card, choose **Prototype**, **Draft** or **Final**. The stage applies to that version's renders. On narrow cards the control shows initials; its tooltips give the full meaning:

- “Prototype: a fast, inexpensive model, to brainstorm concepts that are still fluid.”
- “Draft: the same model as Final; where the technology allows it, it first renders a low-resolution version, which you can render again at final resolution.”
- “Final: the best model, at full resolution.”

Open **Render** from a media place, such as **Reference images**, **Sheets**, **Motion clips** or **Voice samples**. The popup confirms the stage with **Renders at: Prototype**, **Renders at: Draft** or **Renders at: Final**. Inspect **Model** and **Runs on** before continuing; a default is not proof that its provider is ready.

## The fixed image defaults

| Image task | Prototype | Draft and Final |
|---|---|---|
| Generate from a prompt | Z-Image Turbo on fal; 1024×1024, prompt expansion off | GPT Image 2.5 Sunburst on fal; 1024×1024, high quality |
| Edit from a reference | FLUX.2 klein 4B on fal | GPT Image 2.5 editing, Sunburst on fal; high quality |

For still images, Draft and Final use the same model and settings; Draft is not automatically smaller or cheaper. The package supplies no alternative suggestions.

## Text, video and speech

- **Text** (`llm`): Claude Sonnet 5 through [fo-openrouter](../fo-openrouter/) at every stage.
- **Video**, from text (`t2v`) or from an image (`i2v`), on fal, each 5 seconds:

  | Prototype | Draft | Final |
  |---|---|---|
  | MiniMax H3 Max, 480P | Seedance 2.5, 480p | Seedance 2.5, 1080p |

  For video, Draft renders at 480p and Final at 1080p.
- **Speech** (`tts`): Eleven v3 on fal at every stage.

The other kinds have no default, each with a reason: `flf2v` has no last-frame control, `ia2v` has no lip-sync route, and `flfa2v`, `ttv` and `ttm` have no fal model.

The image, video and speech routes use [fo-fal](../fo-fal/), which must be enabled with a usable fal key. A character sheet needs a reference image first. The [prompt writer](../fo-prompts/) can supply the words; you can inspect the model, prompt and price before rendering.
