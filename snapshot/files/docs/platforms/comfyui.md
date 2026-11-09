---
title: ComfyUI
description: "Render images and video on ComfyUI, on your own computer or a rented server, through FilmOpen. No key and no per-render charge."
slug: docs/platforms/comfyui
sidebar:
  label: ComfyUI
  order: 10
lastUpdated: 2026-11-09
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-cui`](#the-plugin).

## What it is and what FilmOpen uses it for

ComfyUI is free software that runs image and video models on your own graphics card. FilmOpen can use a ComfyUI you already run, on this computer or a server you name, or one started for you on [Salad](/docs/platforms/salad/).

| Model | What it does in FilmOpen | Way of running it |
|---|---|---|
| Z-Image-Turbo | Makes an image from a prompt | 8 GB Fast, 8 GB Quality, 24 GB Quality |
| FLUX.2 [klein] 4B | Edits one reference image at 1024×1024 | 8 GB edit |
| Wan 2.2 TI2V 5B | Makes about 3.4 seconds of video, without sound, from a first frame | 8 GB |

## Pricing

ComfyUI itself is free, and FilmOpen makes no charge per render: you pay only for the machine. On your own computer that is your electricity. On a server, it's that server's price: on Salad, see [its page](/docs/platforms/salad/).

## FilmOpen credit

ComfyUI runs on your own computer or on a server you name, so FilmOpen credit doesn't come into it. A Salad server that runs ComfyUI can be paid for with FilmOpen credit: see [Salad](/docs/platforms/salad/).

## The plugin

**fo-cui** connects FilmOpen to a ComfyUI that is already running. It doesn't install or start ComfyUI. Download ComfyUI from [comfy.org](https://comfy.org/download) (Windows, Linux) and start it first.

**Setting up.**
1. Open **Settings → Plugins → ComfyUI**, press **Configure**, and allow it.
2. Under **Settings on this computer**, set **ComfyUI server** to the address ComfyUI reports. The usual local value is `http://127.0.0.1:8188`; a bare `127.0.0.1` lacks the scheme and port.
3. Press **Check** under **Can it work?**. This checks the server, not your model files.

**Preparing a model's files.** On the plugin's page each way of running a model has its own buttons, such as **Verify files: 8 GB Fast** and **Download missing files: 8 GB Fast**. Verify reads ComfyUI's own model lists and checks each file's name and size, never its content. A file of the wrong size is a mismatch to remove, never downloaded over. Download missing files asks a FilmOpen node inside ComfyUI for the first missing file, one file a press; where ComfyUI lacks the node, the first press installs it through ComfyUI-Manager and restarts ComfyUI.

**Rendering.** Open what you're editing, choose **Render**, set **Runs on** to ComfyUI, and press **Render** once. Open the result and check it. A render is sent once; if FilmOpen loses track of it, look at the job in ComfyUI before asking again. FilmOpen never clears your queue or stops other work.

Wan 2.2 uses exactly one PNG or JPEG first frame of at most 16 MiB. The FLUX edit uses one reference image; for more, fal's route takes up to four.

## If something goes wrong

- **Check can't reach the server:** check the address has its scheme and port, and that ComfyUI's own page opens at it.
- **Check passes but a render says files are missing:** press **Download missing files** for that way of running it.
- **A file has the wrong size:** remove it in ComfyUI's models folder, then download again.
- **A render runs out of memory:** choose a smaller way of running it; the model's name says how much memory it needs.
- **A timeout or lost answer:** ComfyUI may still be working. Look at its queue before asking again.
