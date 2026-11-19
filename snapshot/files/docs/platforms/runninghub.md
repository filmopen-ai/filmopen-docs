---
title: RunningHub
description: "FilmOpen's own ComfyUI workflows on RunningHub, on your own key or FilmOpen credit: what runs there, what it costs, and how to add your key."
slug: docs/platforms/runninghub
sidebar:
  label: RunningHub
  order: 13
lastUpdated: 2026-11-17
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [Create your own key](#create-your-own-key)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-runninghub`](#the-plugin).

## What it is and what FilmOpen uses it for

RunningHub runs ComfyUI workflows on its own GPUs. FilmOpen sends it its own ComfyUI workflows, the same ones the [ComfyUI](/docs/platforms/comfyui/) plugin runs on your machine, so you need no ComfyUI server of your own.

| Model | What it does in FilmOpen |
|---|---|
| Z-Image Turbo | Makes a picture from a prompt |
| FLUX.2 klein 4B | Changes one picture as the prompt says |
| Wan 2.2 TI2V 5B | Animates one first frame into a clip, 81 frames at 24 fps |

All three workflows are marked *executed*: each ran on RunningHub at its default size and steps; what it made was not inspected, and RunningHub's bytes for these files are not proved.

## Pricing

RunningHub says what a task cost only when it ends, so the render dialog shows an estimate, about a cent or two: USD 0.0104 a Z-Image Turbo picture, 0.00884 a FLUX.2 klein 4B edit and 0.01638 a Wan 2.2 clip. Each is the time one task took on RunningHub's default machine when FilmOpen tested it (40, 34 and 63 seconds), at USD 0.00026 a second. The charge is what RunningHub reports when the task ends, in US dollars, and FilmOpen's Usage records it. On an account that pays in RunningHub's points, the cost stays unknown. RunningHub's own account page shows what you were billed.

## FilmOpen credit

You can use FilmOpen credit instead of your own RunningHub key: FilmOpen can run all three on your balance.

**Top up your FilmOpen account on filmopen.ai.** FilmOpen passes on what RunningHub reports a task cost and charges 8% plus the payment processor's fees when you top up. While a task runs, FilmOpen holds enough of your balance for ten minutes of RunningHub's machine, and lets go of the rest when the task ends.

With no RunningHub key of your own saved, the plugin's page says **Ready on FilmOpen credit.** once you are signed in and have a balance; **Sign in to filmopen.ai to use FilmOpen credit.** or **FilmOpen credit: top up on filmopen.ai.** say what is missing. A key of your own wins: once you save one, FilmOpen uses it and RunningHub bills you directly.

## Create your own key

These steps were written from RunningHub's [API documentation](https://www.runninghub.ai/runninghub-api-doc-en/) on 17 November 2026, without the screens, so there are no screenshots.

### Create an account and a key

1. Open [RunningHub](https://www.runninghub.ai/), sign up, and add money to your wallet.
2. Make an API key on your account, as RunningHub's API documentation says.
3. Copy the key, and keep it somewhere safe, such as a password manager, until you add it to FilmOpen.

### Add the key to FilmOpen

FilmOpen keeps your key on this device, encrypted in your operating system's credential store, for your user only. It never shows the key again apart from its last four characters, and sends it only to RunningHub. Plugins run in FilmOpen's desktop app, so add the key there.

1. In FilmOpen, open **Settings** and choose **Plugins**. Turn on **ComfyUI** and **RunningHub**: RunningHub takes its workflows from the ComfyUI plugin. If they aren't installed or allowed yet, [install and allow them](/docs/guides/plugin-packages/#install-and-allow) first.
2. Press **Configure** on the **RunningHub** row. On the **RunningHub API key** card, paste your key into the **API key** box and press **Save**. RunningHub has no way to check a key without running something, so the card says **FilmOpen cannot check RunningHub keys, so Save keeps this one unchecked.** A wrong key shows at the first render.

**Remove** takes the key out of FilmOpen after asking, and the key keeps working on RunningHub until you delete it there.

After pasting a key anywhere, clear your clipboard history if your system keeps one: on Windows, press Win+V and choose **Clear all**.

### Keep the key safe

- **Anyone with your key can spend on your account.** Never put the key in a chat, an e-mail, a shared document or code.
- **If it may have leaked,** delete it on RunningHub and make a new one.

## The plugin

**fo-runninghub** runs FilmOpen's ComfyUI workflows on RunningHub. [Installing plugins](/docs/guides/plugin-packages/) explains installing and allowing one.

**Rendering.** Open something you can edit, choose **Render**, pick the **Model** and **RunningHub** under **Runs on**, and press **Render** once. A picture you edit is uploaded to RunningHub first, then one task is made and followed until it ends. **Stop** cancels a task that hasn't finished; one that has finished is kept, with what it cost. If RunningHub doesn't confirm the cancel, the render says so: the task may still finish and be charged.

**The workflow ID.** RunningHub asks for the ID of a saved workflow with each task, and FilmOpen sends one of RunningHub's own, so the plugin's **Workflow ID** setting stays empty. Only if your account refuses it does the render say: *RunningHub did not accept FilmOpen's workflow ID on your account. Save any workflow on RunningHub and paste its ID in Settings → Plugins → RunningHub.*

## If something goes wrong

- **The first render fails with RunningHub's words about the key:** the key may be mistyped or deleted. Save it again.
- **RunningHub did not accept FilmOpen's workflow ID:** set the **Workflow ID**, as above.
- **A render fails with RunningHub's own words:** they are shown as RunningHub gave them, such as a node or a file its check refused.
- **RunningHub isn't under Runs on:** turn on both the **ComfyUI** and the **RunningHub** plugins.
