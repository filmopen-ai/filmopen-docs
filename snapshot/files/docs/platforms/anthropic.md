---
title: Anthropic (Claude)
description: "Anthropic's Claude models in FilmOpen, through your own key or your own Claude Code: what they cost and how to set them up."
slug: docs/platforms/anthropic
sidebar:
  label: Anthropic (Claude)
  order: 5
lastUpdated: 2026-11-09
---

- [What it is and what FilmOpen uses it for](#what-it-is-and-what-filmopen-uses-it-for)
- [Pricing](#pricing)
- [FilmOpen credit](#filmopen-credit)
- [Create your own key](#create-your-own-key)
- [The plugin](#the-plugin)
- [If something goes wrong](#if-something-goes-wrong)

Implemented in plugin [`fo-anthropic`](#the-plugin).

## What it is and what FilmOpen uses it for

Anthropic makes the Claude models. FilmOpen uses them to write and to read text, and can reach them two ways: with a Claude API key, or through **Claude Code**, Anthropic's own program, running on your computer and signed in by you.

| Model | What it does in FilmOpen |
|---|---|
| Claude Opus 5 | Writes prose, scenes, dialogue and scripts |
| Claude Sonnet 5 | Reads text and returns structured data, and writes for the assistant, with tools |
| Claude Fable 5.2, Claude Opus 5.5 | Write prose, scenes, dialogue and scripts, and write for the assistant, with tools |
| Claude Sonnet 5.5, Claude Haiku 5.5 | Read text and return structured data, and write for the assistant, with tools |

Claude Opus 5 and Claude Sonnet 5 are also reachable through [OpenRouter](/docs/platforms/openrouter/).

## Pricing

Anthropic is prepaid: you buy credits, and each request's cost comes off them. Credits expire a year after purchase and can't be refunded. Failed requests are not charged ([paying for API usage](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage)).

Prices per million tokens ([pricing](https://platform.claude.com/docs/en/about-claude/pricing)):

| Model | Input | Output | Cache hit | Cache write (5 minutes / 1 hour) |
|---|---|---|---|---|
| Claude Opus 5 | $5 | $25 | $0.50 | $6.25 / $10 |
| Claude Sonnet 5 | $2 | $10 | $0.20 | $2.50 / $4 |
| Claude Fable 5.2 | $8 | $40 | $0.20 | $10 / $16 |
| Claude Opus 5.5 | $4 | $20 | $0.20 | $5 / $8 |
| Claude Sonnet 5.5 | $2 | $10 | $0.10 | $2.50 / $4 |
| Claude Haiku 5.5 | $0.10 ($0.50 for prompts over 100,000 tokens) | $0.50 ($2.50) | $0.01 ($0.05) | $0.125 / $0.20 ($0.625 / $1) |

Prices were checked on 9 November 2026, those of Fable 5.2, Opus 5.5, Sonnet 5.5 and Haiku 5.5 on 10 November 2026. See Anthropic's page for today's.

**Through Claude Code,** the program bills its own account: a Claude subscription's plan or an API key of your own. FilmOpen makes no charge for those turns, and the tokens the program reports are recorded in Usage without a price.

## FilmOpen credit

FilmOpen credit does not pay for this platform yet; use your own key, or your own Claude Code.

## Create your own key

These steps open an Anthropic account of your own and put its key into FilmOpen.

### Before you start

You need a Google account or an e-mail address to sign in, and a card to buy credits. Anthropic sells to [these countries](https://www.anthropic.com/supported-countries).

### Create an account

Open [the Claude Console](https://platform.claude.com/) and press **Continue with Google** or **Continue with email**. There is no password to set ([signing in](https://support.claude.com/en/articles/13371040-log-in-to-your-console-account)).

### Add money

On the [Billing page](https://platform.claude.com/settings/billing), an Admin or Billing role presses **Buy credits**. Anthropic's pages don't publish the smallest purchase. **Set up auto-reload** is optional: leave it off unless you want Anthropic to buy more by itself. Under **Spend limits** you can set your own monthly limit ([limits](https://platform.claude.com/docs/en/api/rate-limits)).

### Create a key

1. On the [keys page](https://platform.claude.com/settings/keys), press **Create key**.
2. Give it a name you will recognise, such as *FilmOpen*, and pick an expiration. **Choose one workspace** for the key: a key not scoped to a single workspace needs a header FilmOpen doesn't send, and its requests fail.
3. Copy the key somewhere safe, such as a password manager. Anthropic shows it in full only once. The key starts with `sk-ant-` ([getting a key](https://platform.claude.com/docs/en/get-api-key)).

### Add the key to FilmOpen

FilmOpen keeps your key on this device, encrypted in your operating system's credential store, for your user only. It never puts the key in a project or in its log, never shows it again apart from its last four characters, and sends it only to Anthropic. Plugins run in FilmOpen's desktop app, so add the key there.

1. In FilmOpen, open **Settings**, choose **Plugins**, and press **Configure** on the **Anthropic** row. If it isn't turned on yet, [install and allow it](/docs/guides/plugin-packages/#install-and-allow) first.
2. On the **Anthropic key** card, paste your key into the **API key** box and press **Save**. FilmOpen asks Anthropic about the key before it saves anything, and the card says so while it waits. If what you pasted doesn't start with `sk-ant-`, or it looks like another platform's key, a line under the box says so and *Save* asks first.
3. A green **Key was accepted** appears under the box, the box empties, and the card says **Verified on** the date, with the key's last four characters. FilmOpen saves no key Anthropic did not accept.

**If the card says something else:**
- **Key is invalid:** Anthropic refused the key, so nothing was saved and the box keeps it. Check that you copied all of it, or create a new key.
- **Could not check:** Anthropic didn't answer in time, couldn't be reached, or answered with an error. Nothing was saved, and the box keeps the key: press **Save** again when the connection is back.
- **Saving this key could not be confirmed:** the box keeps the key. Press **Save** to try again, and if it keeps happening, restart FilmOpen.

**Save** checks the key with Anthropic before it stores anything, without running a model. **Remove** takes the key out of FilmOpen after asking, and the key keeps working on Anthropic until you delete it there.

After pasting a key anywhere, clear your clipboard history if your system keeps one: on Windows, press Win+V and choose **Clear all**.


### Keep the key safe

- **Anyone with your key can spend your credits.** Never put the key in a chat, an e-mail, a shared document or code.
- **Set a spend limit** so a leaked key can spend only so much.
- **If it may have leaked,** delete it on the keys page and create a new one.

### Or use Claude Code

Claude Code needs no key in FilmOpen. Install it from [Anthropic's page](https://code.claude.com/docs/en/overview), run `claude` once in a terminal to sign in, then choose it under **Claude Code program** on the plugin's page. **Claude Code runs as you, with only FilmOpen's tools**, and keeps its own transcript of the chat on your computer. FilmOpen never signs it in or out, and a failure of the program never switches to your API key.

## The plugin

**fo-anthropic** gives FilmOpen Claude Sonnet 5, Claude Opus 5, Claude Fable 5.2, Claude Opus 5.5, Claude Sonnet 5.5 and Claude Haiku 5.5, on your key or through Claude Code. Turn the plugin on in **Settings → Plugins**; [Installing plugins](/docs/guides/plugin-packages/) explains installing and allowing one. Its page is opened with **Configure** on its row, and **Check** under **Can it work?** asks the platform about your key without making anything.

**Writing.** Claude's answer streams to the assistant, its thinking shows as notes, and it can call tools. A request is never repeated by itself; an answer cut off in a tool turn is refused so it can't run with broken arguments. Usage records the tokens at the catalogue's prices, and a cost that can't be worked out stays unknown.

**On Claude Code.** One turn starts one run of the program, using FilmOpen's tools and no others. In a chat with tools, Stop ends the run and settles the tokens so far; a call without tools ends and settles none. A chat's history stays with the program on your computer, and a signed-in plan or API key both work.

## If something goes wrong

- **"Create key" is greyed out:** your role in the organisation may not allow it. Ask an administrator.
- **Requests are refused for a limit:** your monthly spend limit has been reached. Raise it on the Billing page.
- **The key stopped working:** your credits have run out, or the key expired.
- **Claude Code isn't found:** choose it under **Claude Code program** on the plugin's page, and run `claude` once in a terminal to sign in.
- **FilmOpen says the key is invalid, or that it could not check it:** nothing was saved and the box keeps the key. See [Add the key to FilmOpen](#add-the-key-to-filmopen).
