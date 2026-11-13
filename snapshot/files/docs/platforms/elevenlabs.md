---
title: ElevenLabs
description: "ElevenLabs' voices in FilmOpen: design a voice, have it speak, what it costs, FilmOpen credit, and how to make your own key."
slug: docs/platforms/elevenlabs
sidebar:
  label: ElevenLabs
  order: 7
lastUpdated: 2026-11-09
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [Create your own key](#create-your-own-key)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-elevenlabs`](#the-plugin).

## What it is and what FilmOpen uses it for

ElevenLabs makes speech models. FilmOpen uses it to design an original voice from a written description, keep that voice, and speak your lines with it.

| Model | What it does in FilmOpen |
|---|---|
| Voice Design v3 | Makes up to three voice previews from a description |
| Eleven v3 and v4 | Speak your words in a kept voice, as a WAV file |

## Pricing

ElevenLabs sells a monthly plan with an allowance of credits, and charges per use once that allowance is used ([plans](https://elevenlabs.io/pricing), [API pricing](https://elevenlabs.io/pricing/api)).

| Plan | Per month | Credits |
|---|---|---|
| Free | $0 | 10,000 |
| Starter | $6 | 30,000 |
| Creator | $22 | 121,000 |

Larger plans are on ElevenLabs' page. Starter is the first plan that lists a commercial licence.

- **Speech:** ElevenLabs' pricing page listed Eleven v3 at $0.08 per 1,000 characters on 9 November 2026. FilmOpen's own estimate before speaking still uses the catalogue's $0.10 from September for Eleven v3 and v4, so it may read high.
- **Voice Design:** ElevenLabs lists it with the plans; a preview uses credits.
- **Saving a voice** uses one of your plan's voice slots.
- **Pay as you go:** a prepaid dollar balance on top of a plan. Downgrading or cancelling a plan makes unused paid credits expire.

Prices were checked on 9 November 2026. See ElevenLabs' pages for today's.

## FilmOpen credit

You can use FilmOpen credit instead of your own ElevenLabs key: FilmOpen can design a voice, keep it and speak with it through ElevenLabs on your balance.

**Top up your FilmOpen account on filmopen.ai.** FilmOpen passes on ElevenLabs' actual rate and charges 8% plus the payment processor's fees when you top up.

With no ElevenLabs key of your own saved, the plugin's page says **Ready on FilmOpen credit.** once you are signed in and have a balance; **Sign in to filmopen.ai to use FilmOpen credit.** or **FilmOpen credit: top up on filmopen.ai.** say what is missing. A key of your own wins: once you save one, FilmOpen uses it and ElevenLabs bills you directly. **A voice saved on credit is on FilmOpen's ElevenLabs account, not yours.**

## Create your own key

These steps open an ElevenLabs account of your own and put its key into FilmOpen. They were written from ElevenLabs' pages on 9 November 2026, without an account, so there are no screenshots.

### Before you start

You need an e-mail address, or a Google or Apple account, and a card if you choose a paid plan.

### Create an account

Open [ElevenLabs' sign-up page](https://elevenlabs.io/app/sign-up) and create your account. Your plan's monthly credits begin there.

### Add money

Choose a plan on the [pricing page](https://elevenlabs.io/pricing), or add a pay-as-you-go balance. Starter is the first plan with a commercial licence.

### Create a key

1. Open [ElevenLabs' API keys page](https://elevenlabs.io/app/settings/api-keys).
2. Create a new key and give it a name you will recognise. You can limit what it may call, give it a credit quota, and set when it expires. Allow the speech and voice endpoints FilmOpen uses.
3. Copy the key, and keep it somewhere safe, such as a password manager, until you add it to FilmOpen.

### Add the key to FilmOpen

FilmOpen keeps your key on this device, encrypted in your operating system's credential store, for your user only. It never puts the key in a project or in its log, never shows it again apart from its last four characters, and sends it only to ElevenLabs. Plugins run in FilmOpen's desktop app, so add the key there.

1. In FilmOpen, open **Settings**, choose **Plugins**, and press **Configure** on the **ElevenLabs voices** row. If it isn't turned on yet, [install and allow it](/docs/guides/plugin-packages/#install-and-allow) first.
2. On the **ElevenLabs API key** card, paste your key into the **API key** box and press **Save**. FilmOpen asks ElevenLabs about the key before it saves anything, and the card says so while it waits. If what you pasted looks like another platform's key, a line under the box says so and *Save* asks first.
3. A green **Key was accepted** appears under the box, the box empties, and the card says **Verified on** the date, with the key's last four characters. FilmOpen saves no key ElevenLabs did not accept.

**If the card says something else:**
- **Key is invalid:** ElevenLabs refused the key, so nothing was saved and the box keeps it. Check that you copied all of it, or create a new key.
- **Could not check:** ElevenLabs didn't answer in time, couldn't be reached, or answered with an error. Nothing was saved, and the box keeps the key: press **Save** again when the connection is back.
- **Saving this key could not be confirmed:** the box keeps the key. Press **Save** to try again, and if it keeps happening, restart FilmOpen.

**Save** checks the key with ElevenLabs before it stores anything, without running a model. **Remove** takes the key out of FilmOpen after asking, and the key keeps working on ElevenLabs until you delete it there.

After pasting a key anywhere, clear your clipboard history if your system keeps one: on Windows, press Win+V and choose **Clear all**.


### Keep the key safe

- **Anyone with your key can spend your credits.** Never put the key in a chat, an e-mail, a shared document or code.
- **Give it a credit quota,** so a leaked key can spend only so much.
- **If it may have leaked,** delete it on the API keys page and create a new one.

## The plugin

**fo-elevenlabs** designs voices and speaks with them on one key. Turn the plugin on in **Settings → Plugins**; [Installing plugins](/docs/guides/plugin-packages/) explains installing and allowing one. Its page is opened with **Configure** on its row, and **Check** under **Can it work?** asks the platform about your key without making anything.

**Designing a voice.**
1. Open a character you can edit. Under **Voice samples**, use the add control and choose **Voice**. This opens **Generate voice**.
2. Enter a **Voice prompt** describing tone, apparent age, accent and pace, between 20 and 1,000 characters. **Audition text**, 100 to 1,000 characters, is optional.
3. Press **Generate voice** once, and listen to the previews (up to three). Under **Previews to audition**, choose **Use this voice**. In **Keep this voice?**, enter a name and press **Keep**. This saves a voice to your ElevenLabs account and uses a voice slot.

**Speaking.** After keeping a voice, use the add control under **Voice samples** and choose **Render**. Select the Eleven v3 or v4 speech model, enter **Words to say** (1 to 5,000 characters) and press **Render** once. You get a 24 kHz WAV.

Uploading a WAV or MP3 keeps a local reference sample. It does not clone that voice or send it to ElevenLabs. Cloning and streaming are not offered. Speech can't be repeated from a seed. Voice Design takes FilmOpen's seed, folding one above ElevenLabs' maximum into its range the same way each time, so a saved seed gives the same design.

**Identity and cost.** A preview's identity is temporary; a kept voice has a permanent one in your account. Copying a project doesn't give another account access to your voice. ElevenLabs' credits are not an exact dollar invoice, so a dollar cost that isn't known stays unknown in Usage, never zero. No paid request is repeated by itself, and a lost answer may have spent credits or created a voice: check your account before repeating it. If the provider kept the voice but FilmOpen couldn't save it, **Retry write** saves it without creating another.

## If something goes wrong

- **Previews or speech fail with a credits message:** your plan's allowance is used up. Add a balance, or wait for the next month.
- **"Keep" says your voice slots are full:** delete a voice on ElevenLabs, or move to a larger plan.
- **A kept voice doesn't speak on another account:** a voice belongs to the account that made it.
- **FilmOpen says the key is invalid, or that it could not check it:** nothing was saved and the box keeps the key. See [Add the key to FilmOpen](#add-the-key-to-filmopen).
