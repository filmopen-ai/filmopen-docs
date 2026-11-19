---
title: Fish Audio
description: "Fish Audio's voices in FilmOpen: design or clone a voice, have it speak a line, with the lines before it as context, what it costs, FilmOpen credit, and how to make your own key."
slug: docs/platforms/fishaudio
sidebar:
  label: Fish Audio
  order: 7
lastUpdated: 2026-11-18
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [Create your own key](#create-your-own-key)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-fish`](#the-plugin).

## What it is and what FilmOpen uses it for

Fish Audio makes speech models. FilmOpen uses it to design an original voice from a written description, or to keep a recording of yours as a voice. Fish keeps that voice on the account, and FilmOpen has it speak your lines, each one, with Drama 3, after up to two lines just before it as context.

| Model | What it does in FilmOpen |
|---|---|
| Voice design | Makes three voice previews from a description; keeping one, or a recording of yours, as a voice is free |
| S2.1 Pro | Speaks your words in a kept voice, as a WAV file |
| S2.1 Pro (free) | The same, on Fish's free tier of S2.1 Pro |
| Drama 3 | Speaks expressive lines directed by inline tags; a script line is spoken after up to two lines just before it, as context, in one request |

## Pricing

Fish Audio bills its API from a prepaid API credit balance on your Fish account ([plans and pricing](https://fish.audio/plan/)). Its answers report no cost, so FilmOpen works out each call's price from what it sends.

| What | Price |
|---|---|
| Speech with S2.1 Pro | $15 per million bytes of text |
| Speech with S2.1 Pro (free) | $0, as Fish's pricing page lists it on 18 November 2026; Fish names no end date |
| Speech and dialogue with Drama 3 | $50 per million bytes of text |
| A voice design | $0.01 a request, for its three previews |
| Keeping a voice (a design or a recording) | Free |

- **Bytes, not characters:** speech is priced by the UTF-8 bytes of the whole text sent, its tags and directions included. A plain English letter is one byte; many other letters and symbols are two to four.
- **Drama 3's launch price:** Fish lists Drama 3 at $10 per million bytes until 30 November 2026, and $50 from 1 December. FilmOpen's estimate, and its charge on FilmOpen credit, use $50 from the start, so on your own key it may read high until then.
- **Failed requests** cost nothing.

Prices were checked on 17 November 2026. See Fish Audio's page for today's.

## FilmOpen credit

You can use FilmOpen credit instead of your own Fish Audio key: FilmOpen can design a voice, keep it, and speak lines with it through Fish Audio on your balance.

**Top up your FilmOpen account on filmopen.ai.** FilmOpen charges the rates above — Drama 3 at its $50 from the start — rounded up to the next cent, so a short line costs 1 cent (S2.1 Pro's free tier costs nothing), and 8% plus the payment processor's fees when you top up.

With no Fish Audio key of your own saved, the plugin's page says **Ready on FilmOpen credit.** once you are signed in and have a balance; otherwise it says what is missing. A key of your own wins: once you save one, FilmOpen uses it and Fish Audio bills you directly. **A voice kept on credit is on FilmOpen's Fish Audio account, not yours.**

## Create your own key

These steps open a Fish Audio account of your own and put its key into FilmOpen. They were written on 18 November 2026 from FilmOpen's record of Fish Audio's API, without an account's screens, so there are no screenshots.

### Create an account

Open [Fish Audio](https://fish.audio/) and create your account.

### Add money

Add API credit on the [plans and pricing page](https://fish.audio/plan/). The API spends that credit, and refuses a request once it runs out.

### Create a key

1. Open [Fish Audio's API keys page](https://fish.audio/app/api-keys/).
2. Create a new key and give it a name you will recognise.
3. Copy the key, and keep it somewhere safe, such as a password manager, until you add it to FilmOpen.

### Add the key to FilmOpen

FilmOpen keeps your key on this device, encrypted in your operating system's credential store, for your user only. It never puts the key in a project or in its log, never shows it again apart from its last four characters, and sends it only to Fish Audio. Plugins run in FilmOpen's desktop app, so add the key there.

1. In FilmOpen, open **Settings**, choose **Plugins**, and press **Configure** on the **Fish Audio voices** row. If it isn't turned on yet, [install and allow it](/docs/guides/plugin-packages/#install-and-allow) first.
2. On the **Fish Audio API key** card, paste your key into the **API key** box and press **Save**. FilmOpen asks Fish Audio about the key, by reading your API credit balance, before it saves anything.
3. A green **Key was accepted** appears under the box, the box empties, and the card says **Verified on** the date, with the key's last four characters. FilmOpen saves no key Fish Audio did not accept.

**If the card says something else:**
- **Key is invalid:** Fish Audio refused the key, so nothing was saved and the box keeps it. Check that you copied all of it, or create a new key.
- **Could not check:** Fish Audio didn't answer in time, couldn't be reached, or answered with an error. Nothing was saved, and the box keeps the key: press **Save** again when the connection is back.

**Remove** takes the key out of FilmOpen after asking, and the key keeps working on Fish Audio until you delete it there.

After pasting a key anywhere, clear your clipboard history if your system keeps one: on Windows, press Win+V and choose **Clear all**.

### Keep the key safe

- **Anyone with your key can spend your API credit.** Never put the key in a chat, an e-mail, a shared document or code.
- **If it may have leaked,** delete it on the API keys page and create a new one.

## The plugin

**fo-fish** designs and keeps voices and speaks with them on one key. Turn the plugin on in **Settings → Plugins**; [Installing plugins](/docs/guides/plugin-packages/) explains installing and allowing one. Its page is opened with **Configure** on its row.

**Designing a voice.**
1. Open a character you can edit. Under **Voice samples**, use the add control and choose **Voice**. This opens **Generate voice**; choose the **Fish Audio voice design** model.
2. Enter a **Voice prompt** describing the voice, in 1 to 2,000 characters. **Audition text**, 1 to 150 characters, is optional.
3. Press **Generate voice** once, and listen to the three previews. Choose one, name it and keep it. Fish keeps it on the account, free.

**Keeping a recording.** A recording under a character's **Recordings to keep** can be kept as a Fish voice too, also free: Fish transcribes it itself.

**Speaking.** After keeping a voice, use the add control under **Voice samples** and choose **Render**. Select **Fish Audio S2.1 Pro**, **Fish Audio S2.1 Pro (free)** or **Fish Audio Drama 3**, enter **Words to say** and press **Render** once. You get a 24 kHz WAV, with each word's timing.

**A line in its scene.** A script line's own **Render** with Drama 3 sends up to two lines just before it as context in the same request — as far back as the lines' speakers have Fish voices, up to 2,000 characters and ten voices — and keeps that one line's clip. To speak a line without context, choose S2.1 Pro or its free tier. The context lines are part of the text sent, so they are paid for. The scene's **Render** tab does not speak Fish voices yet: render each line from its own **Render**.

**A character whose voice is kept elsewhere.** A script line whose speaker keeps a voice on another platform, ElevenLabs for one, is offered Fish all the same, as a clone: *Renders with* says *Rendering as cloned voice*, and *Render* first keeps the speaker's voice on Fish from the voice sample in use, free, beside the other platform's, then speaks the line in it; the next line uses it. A speaker with no voice sample has no Fish route, and the model menu says why. A voice designed on Fish reads *Rendering as custom voice design*.

**Identity and cost.** A kept voice belongs to the Fish account that kept it. Copying a project doesn't give another account access to your voice. No paid request is repeated by itself, and a lost answer may have spent credit: check your account before repeating it.

## If something goes wrong

- **"Your Fish Audio account has no API credit":** add credit at fish.audio, then try again.
- **"Fish Audio refused this key":** the key was deleted or is wrong. Create a new one and save it.
- **"Select a kept Fish Audio voice before generating speech":** keep a voice for the character first.
- **"Design the voice again, then keep it":** the preview you chose is no longer one Fish can keep. Generate the previews again.
- **"Fish Audio refused the request (HTTP 429)":** Fish allows only a few requests at once on a smaller balance. Wait a moment and render again.
- **FilmOpen says the key is invalid, or that it could not check it:** nothing was saved and the box keeps the key. See [Add the key to FilmOpen](#add-the-key-to-filmopen).
