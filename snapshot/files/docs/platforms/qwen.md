---
title: Qwen Cloud
description: "Qwen Cloud's pictures, video, speech and voices cloned from a character's sample in FilmOpen: what they cost, on your own key or FilmOpen credit, and how to make your own key."
slug: docs/platforms/qwen
sidebar:
  label: Qwen Cloud
  order: 12
lastUpdated: 2026-11-17
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [Create your own key](#create-your-own-key)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-qwen`](#the-plugin).

## What it is and what FilmOpen uses it for

Qwen Cloud is Alibaba's own service for its Qwen and Wan models. FilmOpen uses it, on your own key or on FilmOpen credit, to make pictures, video clips and spoken lines.

| Model | What it does in FilmOpen |
|---|---|
| Z-Image Turbo | Makes a picture from a prompt |
| Qwen-Image 3.0 | Makes a picture from a prompt |
| Qwen-Image 2.1 Turbo | Changes one to ten pictures as the prompt says |
| Wan 3.0 | Makes a shot from a prompt, a first frame, or a first and a last frame |
| HappyHorse 1.1 | Makes a shot from a prompt or a first frame |
| Qwen-Audio 3.1 TTS Flash | Speaks a line in one of its 70 voices, or in a character's own voice cloned on Qwen |
| Qwen-Audio 3.1 TTS Flash voice from a recording | Clones a character's voice sample into a voice of your Qwen account, or of FilmOpen's on credit |

## Pricing

Qwen Cloud bills what you use to your account. These are the Singapore prices on Qwen's [model prices](https://docs.qwencloud.com/developer-guides/getting-started/model-prices) page, read on 17 November 2026:

| Model | Price |
|---|---|
| Z-Image Turbo | $0.015 a picture |
| Qwen-Image 3.0 | $0.03 a picture |
| Qwen-Image 2.1 Turbo | $0.016 a picture made; the pictures you send aren't charged |
| Wan 3.0 | $0.035 a second at 480P, $0.07 at 720P, $0.14 at 1080P: a limited-time 30% off $0.05, $0.10 and $0.20 |
| HappyHorse 1.1 | $0.07 a second at 480P, $0.14 at 720P, $0.18 at 1080P |
| Qwen-Audio 3.1 TTS Flash | $0.23 a million tokens in and $1.87 a million out: about $0.0002 for a seven-second line, in its voices or a cloned one |
| Voice cloning | Free; a voice takes one of the account's 1,000 voice slots |

Qwen's answers say what each call used, such as pictures, seconds or tokens, but not what it cost, so FilmOpen's Usage records that use at these prices. A new account's free quota, and a price Qwen changes, aren't seen there: Qwen's console shows what you were actually billed.

## FilmOpen credit

You can use FilmOpen credit instead of your own Qwen key: FilmOpen can make pictures, video clips and spoken lines through Qwen Cloud on your balance, and keep a character's voice cloned from a sample, which is free: FilmOpen keeps that voice on its own Qwen account for you.

**Top up your FilmOpen account on filmopen.ai.** FilmOpen charges the Singapore prices above, each render rounded up to a whole cent, and 8% plus the payment processor's fees when you top up. While a clip renders, FilmOpen holds its price from your balance; a clip you stop once Qwen has started it is charged that hold.

With no Qwen key of your own saved, the plugin's page says **Ready on FilmOpen credit.** once you are signed in and have a balance; **Sign in to filmopen.ai to use FilmOpen credit.** or **FilmOpen credit: top up on filmopen.ai.** say what is missing. A key of your own wins: once you save one, FilmOpen uses it and Qwen bills you directly.

## Create your own key

These steps open a Qwen Cloud account of your own and put its key into FilmOpen. They were written from Qwen's pages on 17 November 2026, without the screens, so there are no screenshots.

### Create an account and a key

1. Open [Qwen Cloud](https://www.qwencloud.com/), sign up, and add a way to pay.
2. Make an API key as Qwen's [API key page](https://docs.qwencloud.com/api-reference/preparation/api-key) says, **in the Singapore region**, where the console opens. A key works only in the region it was made in, and FilmOpen sends to Singapore.
3. Copy the key, and keep it somewhere safe, such as a password manager, until you add it to FilmOpen. It starts with `sk-ws-`, or `sk-` for an older key. A Token Plan key (`sk-sp-`) works only on Qwen's Token Plan service, not here.

### Add the key to FilmOpen

FilmOpen keeps your key on this device, encrypted in your operating system's credential store, for your user only. It never puts the key in a project or in its log, never shows it again apart from its last four characters, and sends it only to Qwen Cloud. Plugins run in FilmOpen's desktop app, so add the key there.

1. In FilmOpen, open **Settings**, choose **Plugins**, and press **Configure** on the **Qwen Cloud** row. If it isn't turned on yet, [install and allow it](/docs/guides/plugin-packages/#install-and-allow) first.
2. On the **Qwen Cloud API key (Singapore)** card, paste your key into the **API key** box and press **Save**. Qwen has no way to check a key without making something, so the card says **FilmOpen cannot check Qwen Cloud keys, so Save keeps this one unchecked.** A wrong key shows at the first render.

**Remove** takes the key out of FilmOpen after asking, and the key keeps working on Qwen Cloud until you delete it there.

After pasting a key anywhere, clear your clipboard history if your system keeps one: on Windows, press Win+V and choose **Clear all**.

### Keep the key safe

- **Anyone with your key can spend on your account.** Never put the key in a chat, an e-mail, a shared document or code.
- **If it may have leaked,** delete it in Qwen's console and make a new one.

## The plugin

**fo-qwen** renders Qwen Cloud's pictures, video and speech from FilmOpen's catalogue. Turn the plugin on in **Settings → Plugins**; [Installing plugins](/docs/guides/plugin-packages/) explains installing and allowing one.

**Rendering.** Open something you can edit, choose **Render**, pick the **Model** and **Runs on**, check the price and press **Render** once. Pictures and speech come back in the same call. A clip is sent once and asked about every ten seconds until it ends; a clip stopped while it still waits in Qwen's queue is cancelled, and one already being made may still finish and be charged.

**What it sends for you.** Prompt rewriting is off and one picture is asked for, so the price is the one shown; clips have no watermark. Z-Image and HappyHorse take no seed.

**Voices.** Speech offers Qwen's 70 voices for the model in Singapore: 15 English, 4 multilingual and 51 in other languages.

**A character's own voice on Qwen.** Qwen designs voices only in its Beijing region, which FilmOpen doesn't use, so a character's voice is designed elsewhere, such as on ElevenLabs, or uploaded as a recording. Under the character's **Voice samples**, a sample kept on another platform offers **Keep with Qwen Cloud** while the character has no Qwen voice yet, with your Qwen key or without one; an uploaded recording offers **Use this recording**, where Qwen is one of the models. Either sends the sample once, whole, to be cloned: a WAV, MP3 or M4A recording of 5 to 60 seconds of clear speech, at most 10 MB, at 16 kHz or more. A sample FilmOpen knows to be outside the format, size or length bounds is refused before anything is sent, saying which bound; the sample rate, and a length FilmOpen hasn't measured, are Qwen's to check, and Qwen's refusal is shown in its own words. Qwen takes about 15 seconds to make the voice ready, and FilmOpen waits for it. Cloning is free. On your own key the voice is kept in your Qwen account until you delete it in Qwen's console; without one, FilmOpen keeps it on its own Qwen account and the question before the keep says so. Either way the character keeps its id beside its other platforms' voices, so its ElevenLabs voice stays as it was. A line of that character's dialogue then offers Qwen Cloud beside ElevenLabs, spoken in the clone at the usual speech price, one line at a time. FilmOpen keeps the id without the model's name that Qwen puts before it (`qwen-audio-3.1-tts-flash-`).

**Qwen and ElevenLabs side by side,** at list prices read on 17 November 2026, so you can render a line with each and compare:

| | Qwen Cloud (Singapore) | ElevenLabs |
|---|---|---|
| Voice design | Not offered: Qwen designs only in Beijing | From a description: up to three previews, one kept |
| Voice from a recording | Free; WAV, MP3 or M4A, 5 to 60 seconds, at most 10 MB | Not offered in FilmOpen |
| Speech | About $0.002 per 1,000 English characters, or $0.0014 a minute ($0.23 and $1.87 a million tokens in and out) | $0.10 per 1,000 characters (v3 and v4) |
| Kept voices | 1,000 an account, no expiry | 2 to 25 by plan |
| Dialogue in one call | No: one line at a time | Yes, up to 2,000 characters and ten voices |
| Languages spoken | 67 on Flash | 74 on v3 |
| FilmOpen credit | Offered for speech and for a voice from a recording, kept on FilmOpen's account | Offered |

Which sounds better is for your ear.

**Keeping results.** Qwen keeps what it makes for a limited time, a day for clips and speech, so keep what you want in your project.

## If something goes wrong

- **The first render says the key was refused:** the key may be from another region, a Token Plan key, or mistyped. Make a Singapore key and save it again.
- **A render fails with Qwen's own words:** they are shown as Qwen gave them, such as a prompt its content check refused.
- **A clip was stopped but still charged:** Qwen cancels only a clip still waiting in its queue.
- **Keeping a voice on Qwen (*Keep with Qwen Cloud*, or *Use this recording* with Qwen chosen) says Qwen did not deploy the voice:** Qwen refused the recording after taking it, for example for music, noise or another speaker in it. Try a cleaner sample of one voice.
