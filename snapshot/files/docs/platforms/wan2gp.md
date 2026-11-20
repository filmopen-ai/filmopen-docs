---
title: WanGP
description: "Render frames and clips and run a local language model on WanGP, on your own computer or a server you name. No key and no charge per use."
slug: docs/platforms/wan2gp
sidebar:
  label: WanGP
  order: 11
lastUpdated: 2026-11-09
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-wan2gp`](#the-plugin).

## What it is and what FilmOpen uses it for

WanGP is free software that runs video, image and language models on your own graphics card. FilmOpen can use it for pictures and clips, and for writing, so your text work can run with no cloud service at all.

| Model | What it does in FilmOpen |
|---|---|
| Z-Image-Turbo | Renders a block's first frame |
| Wan 2.2 TI2V 5B | Renders its clip, from that first frame |
| Qwen3.8 VL Uncensored 27B | Writes and reads text and uses tools for the assistant. WanGP advises its Bonsai quantisation below 16 GB of video memory |
| Qwen3.8 9B Uncensored | The same, for a smaller GPU |

The picture and video models come in two tiers:

| Tier | Both models, on | What you need |
|---|---|---|
| 8 GB | Transformer and encoder int8 | At least 8 GB of video memory |
| 16 GB | Transformer and encoder bf16 | At least 16 GB of video memory |

FilmOpen suggests the largest tier that fits your GPU.

## Pricing

WanGP itself is free, and FilmOpen makes no charge per use: you pay only for the machine. Usage records a text model's tokens as *on your computer*, with no price. A clip is 81 frames at 24 frames per second, about 3.4 seconds, without sound.

## FilmOpen credit

WanGP runs on your own computer or on a server you name, so FilmOpen credit doesn't come into it.

## The plugin

**fo-wan2gp** connects FilmOpen to WanGP. It has no key.

**Setting up.**
1. Install WanGP under [Pinokio](https://pinokio.co/) or by itself, following [its install notes](https://github.com/deepbeepmeep/Wan2GP).
2. Open **Settings → Plugins → Wan2GP**, press **Configure**, and allow it.
3. Set **Wan2GP address** to the address **Open Web UI** shows. The default is `http://127.0.0.1:7860`; Pinokio may use another port. A WanGP elsewhere works over your own network, VPN or a trusted proxy; its password login isn't supported.
4. Press **Check** under **Can it work?**. It says unavailable if nothing answers, and ready when FilmOpen's helper answers.

**Starting WanGP from FilmOpen.** Choose **WanGP's Python**, the Python inside WanGP's own folder: under Pinokio, `api/wan.git/app/venv/bin/python`, or `venv\Scripts\python.exe` on Windows. Then **Start WanGP**, **Check**, and turning the card Off and On each start WanGP when nothing answers on the address. It takes a minute or two to answer, so press **Check** to see when it is ready. FilmOpen stops the WanGP it started when FilmOpen quits; a WanGP you started yourself is never stopped.

**FilmOpen's helper installs itself, only when WanGP is idle.** Where **Check**, turning the card Off and On, or **Start WanGP** finds no helper, FilmOpen asks WanGP's Plugins manager to install it and then restarts WanGP. A helper too old for text is updated the same way. FilmOpen first asks WanGP whether it is at work: while a render runs or a pause is under way, or Deepy, WanGP's own assistant, is answering, nothing is installed, updated or restarted, and the card says *WanGP is rendering; press Check when it is idle.* FilmOpen asks again just before the restart, so a render begun meanwhile is left alone, and the next **Check** finishes the job. **Set up Wan2GP for FilmOpen** does the same by hand. Under Pinokio, press **Stop**, then **Start**, and come back to **Check**.

**What the card shows.** When ready, it names WanGP's version and every GPU with its video memory and how much is free, and suggests the largest tier that fits. Readiness doesn't promise a tier's files are downloaded. The helper also reports the versions of torch and CUDA, system memory, and WanGP's language model engine with whether it is loaded; these go to FilmOpen's log.

**Preparing a tier's files.** **Verify files** lists what is present, with counts and sizes, not the content. **Download files** asks WanGP's own downloader for what's missing, one job at a time, for up to eight minutes a press; work already accepted keeps running. Verify later to see what arrived.

**Rendering.** Choose a tier and a resolution. A frame uses a prompt of up to 16,000 characters. A clip uses the prompt and one PNG or JPEG first frame of at most 16 MiB. Render the frame at 1280×720 for a 16:9 clip: WanGP follows the first frame's shape, so the clip's size can differ from the one you chose. A render is sent once; if FilmOpen loses its answer, look in WanGP before asking again. A stopped render is reported as interrupted. Restarting WanGP forgets earlier jobs.

**Writing.** Choose one of the two Qwen3.8 models under **Use the LLM:** in **Settings → General**. WanGP runs one language model at a time, the engine chosen in its Configuration. FilmOpen's request sets WanGP to the model you chose for that call and puts WanGP's own choice back after it. Images are not sent on this route. A call is never repeated by itself.

## If something goes wrong

- **The card says unavailable, or *WanGP is not running — press Start WanGP on its card.*** Press **Start WanGP**, or start WanGP yourself, and check the address matches **Open Web UI**.
- ***WanGP is rendering; press Check when it is idle.*** Wait for the render to finish, then press **Check**. Nothing was installed or restarted meanwhile.
- **FilmOpen says it installed or updated its helper:** start WanGP again (under Pinokio, **Stop**, then **Start**), then press **Check**.
- **The card says WanGP did not update the helper:** nothing was restarted. Update it in WanGP's Plugins tab.
- **The assistant says the helper has no text endpoint:** press **Check** on the card, and FilmOpen updates it.
- **A writing request fails while a render runs:** WanGP is busy. Try again when it is idle.
- **An answer is refused as cut off:** it stopped at its output limit where tools were offered, or with no words. Ask for less.
- **A render is blocked:** the helper may be missing, or your GPU too small for the tier. Choose the smaller tier.
- **Files are missing:** press **Download files**, or start the render, and WanGP downloads them first.
- **A download timed out:** WanGP may still be working. Verify later before asking again.
