---
title: Atlas Cloud
description: "Atlas Cloud's image and video models in FilmOpen: what they cost, FilmOpen credit, and how to make your own key."
slug: docs/platforms/atlascloud
sidebar:
  label: Atlas Cloud
  order: 8
lastUpdated: 2026-11-09
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [Create your own key](#create-your-own-key)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-atlascloud`](#the-plugin).

## What it is and what FilmOpen uses it for

Atlas Cloud sells many makers' image and video models behind one account and one key. FilmOpen uses it to make pictures and video clips.

| Model | What it does in FilmOpen |
|---|---|
| Z-Image-Turbo | Makes an image from a prompt, one image at a time |
| Seedance 2.5 | Makes a shot from a prompt, reference images or a first frame |
| Kling 3.0 | Makes a shot from a prompt or a first frame |
| Wan 2.6 | Makes a shot from a first frame |

## Pricing

Atlas Cloud is prepaid: you top up, and what you use comes off your balance. The smallest top-up is $25 ([top up](https://www.atlascloud.ai/docs/billing/topup)). Purchases are final, and a failed task is not charged ([refunds](https://www.atlascloud.ai/docs/billing/refunds)).

| Model | Price |
|---|---|
| Z-Image-Turbo | $0.015 an image |
| Seedance 2.5 | About $0.14 a second at 480p, $0.30 at 720p, $0.59 at 1080p (Atlas's estimate from the video's tokens) |
| Kling 3.0 | $0.1071 a second (Standard), $0.1428 (Pro), $0.357 (4K), with sound on, Atlas's default |
| Wan 2.6 | $0.07 a second at 720p, $0.105 at 1080p |

These are the prices in FilmOpen's catalogue, read on Atlas's pricing page on 25 and 29 October 2026; on 9 November 2026 that page didn't load its model prices for us. FilmOpen records what Atlas reports for a finished video, and the agreed quote for an image. See [Atlas's pricing](https://www.atlascloud.ai/pricing/models) for today's.

## FilmOpen credit

You can use FilmOpen credit instead of your own Atlas Cloud key: FilmOpen can make images and video through Atlas Cloud on your balance.

**Top up your FilmOpen account on filmopen.ai.** FilmOpen passes on Atlas Cloud's actual rate and charges 8% plus the payment processor's fees when you top up.

With no Atlas Cloud key of your own saved, the plugin's page says **Ready on FilmOpen credit.** once you are signed in and have a balance; **Sign in to filmopen.ai to use FilmOpen credit.** or **FilmOpen credit: top up on filmopen.ai.** say what is missing. A key of your own wins: once you save one, FilmOpen uses it and Atlas Cloud bills you directly.

## Create your own key

These steps open an Atlas Cloud account of your own and put its key into FilmOpen. They were written from Atlas's pages on 9 November 2026, without an account, so there are no screenshots.

### Before you start

You need a Google or GitHub account, or an e-mail address, where Atlas sends a 6-digit code ([sign-in](https://www.atlascloud.ai/docs/account/sign-in)), and a way to pay at least $25: a credit or debit card, Alipay, WeChat Pay or cryptocurrency.

### Create an account

Open [Atlas Cloud's sign-in page](https://www.atlascloud.ai/login) and sign up.

### Add money

In the console, open **Billing** and top up at least $25 ([top up](https://www.atlascloud.ai/docs/billing/topup)). Purchases are final and can't be refunded.

### Create a key

1. Open the [API keys page](https://www.atlascloud.ai/console/api-keys) and create a key.
2. Give the key permission to read your account's balance, which FilmOpen's check uses.
3. Copy the key, and keep it somewhere safe, such as a password manager, until you add it to FilmOpen. The key starts with `apikey-`; a value starting `ak_` is only a public identifier.

### Add the key to FilmOpen

FilmOpen keeps your key on this device, encrypted in your operating system's credential store, for your user only. It never puts the key in a project or in its log, never shows it again apart from its last four characters, and sends it only to Atlas Cloud. Plugins run in FilmOpen's desktop app, so add the key there.

1. In FilmOpen, open **Settings**, choose **Plugins**, and press **Configure** on the **Atlas Cloud** row. If it isn't turned on yet, [install and allow it](/docs/guides/plugin-packages/#install-and-allow) first.
2. On the **Atlas Cloud key** card, paste your key into the **API key** box and press **Save**. FilmOpen asks Atlas Cloud about the key before it saves anything, and the card says so while it waits. If what you pasted doesn't start with `apikey-`, or it looks like another platform's key, a line under the box says so and *Save* asks first.
3. A green **Key was accepted** appears under the box, the box empties, and the card says **Verified on** the date, with the key's last four characters. FilmOpen saves no key Atlas Cloud did not accept.

**If the card says something else:**
- **Key is invalid:** Atlas Cloud refused the key, so nothing was saved and the box keeps it. Check that you copied all of it, or create a new key.
- **Could not check:** Atlas Cloud didn't answer in time, couldn't be reached, or answered with an error. Nothing was saved, and the box keeps the key: press **Save** again when the connection is back.
- **Saving this key could not be confirmed:** the box keeps the key. Press **Save** to try again, and if it keeps happening, restart FilmOpen.

**Save** checks the key with Atlas Cloud before it stores anything, without running a model. **Remove** takes the key out of FilmOpen after asking, and the key keeps working on Atlas Cloud until you delete it there.

After pasting a key anywhere, clear your clipboard history if your system keeps one: on Windows, press Win+V and choose **Clear all**.


### Keep the key safe

- **Anyone with your key can spend your balance.** Never put the key in a chat, an e-mail, a shared document or code.
- **If it may have leaked,** delete it on the API keys page and create a new one.

## The plugin

**fo-atlascloud** renders Atlas's images and video from FilmOpen's catalogue. Turn the plugin on in **Settings → Plugins**; [Installing plugins](/docs/guides/plugin-packages/) explains installing and allowing one. Its page is opened with **Configure** on its row, and **Check** under **Can it work?** asks the platform about your key without making anything.

**Rendering.** Open something you can edit, choose **Render**, pick the **Model** and **Runs on**, check the price and press **Render** once. FilmOpen sends a job once and fetches it until it ends. Atlas has no cancel: a stopped render may still finish and be charged. Seedance and Kling don't apply a seed.

**Sound.** The video models run at Atlas's default, sound on; there is no control for it in the render dialog yet.

**Keeping results.** Atlas keeps generated media only for a limited time, so keep what you want in your project.

**Cost.** For a finished video, Usage records the price Atlas reports. An image completes without one, so its cost is the agreed quote, marked as an estimate. Without either, the cost is unknown, never zero.

## If something goes wrong

- **A key is refused by Check though you copied it right:** it needs permission to read the balance. Atlas answers a key without it with a 403.
- **A render fails with a balance message:** top up in the console.
- **A render is stopped but still charged:** Atlas has no cancel, so a stopped job may still finish.
- **FilmOpen says the key is invalid, or that it could not check it:** nothing was saved and the box keeps the key. See [Add the key to FilmOpen](#add-the-key-to-filmopen).
