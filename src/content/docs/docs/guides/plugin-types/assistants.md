---
title: "Assistants"
description: "Expose user-facing assistance through host-selected AI routing."
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/plugin-types/assistants.md
sidebar:
  order: 1
---

An assistant plug-in is a catalogue of actions: its manifest names the catalogue in `implements.assistant.catalog`, and FilmOpen offers each action where it belongs, builds the action's context from the project, and chooses and runs the model. The plug-in owns no provider key. It may also publish messages from a feed of its own, as below.

## Subtypes

- Prompt-to-answer action — implemented
- Message feed — specified

## Messages from your feed

*Specified; the FilmOpen application shows these messages from a coming release.*

### What the person sees

Rows under your assistant's header in the assistant panel, above its actions in the scrolling band: each with an optional picture, an optional bold title and its text, and an X at its upper right. A tall row may push the actions down a scroll. The X hides the row for good on that computer; your plug-in is never told.

### Declaring a feed

Name an `https` address, without query or fragment, in `implements.assistant.feed`, and its host in `capabilities.network` (an excerpt of a manifest):

```json
{
  "kind": "assistant",
  "capabilities": { "network": ["filmopen.ai"] },
  "implements": {
    "assistant": {
      "catalog": "assets/assistant.json",
      "feed": "https://filmopen.ai/feeds/fo-assistant.json"
    }
  }
}
```

### When the application asks

`checkMessages(ctx, event)` is an optional function on the object your `main.js` returns, beside `status`. FilmOpen calls it once at start, once when the person turns the assistant on while the application runs, and again 44 hours after the last attempt, failed or not. An assistant that is off is never called. The call runs in check mode (no paid call) within 10 seconds in all, its wait for a turn included. The event is:

```json
{"reason":"start","feed":"https://filmopen.ai/feeds/fo-assistant.json","app":{"version":"0.1.0","platform":"windows"}}
```

`reason` is `start`, `enable` or `interval`; `feed` is your manifest's address as written; `app.platform` is `windows`, `macos`, `linux`, `android`, `ios` or `web`.

### The request

One `ctx.http` GET, no body and no headers, `timeoutMs: 8000`, each value encoded with `encodeURIComponent`:

```text
GET <feed>?plugin=<ctx.plugin.tag>&author=<ctx.plugin.author>&v=<ctx.plugin.v>&app=<event.app.version>&platform=<event.app.platform>
```

For example:

```text
GET https://filmopen.ai/feeds/fo-assistant.json?plugin=fo-assistant&author=filmopen&v=1&app=0.1.0&platform=windows
```

A static file ignores the query and sends everyone the same list. A server may choose by it — a security notice only to older versions, say.

### The feed's answer

A 200 response with JSON `{ "messages": [ … ] }`, at most ten. Eleven refuse the whole answer; nothing is cut. Extra fields are ignored. A video's thumbnail, linking the video, with its description and a link:

```json
{"messages":[{"id":"first-scene","title":"Your first scene","text":"A short walkthrough.\n[Watch the video](https://www.youtube.com/watch?v=abc123)","image":"https://i.ytimg.com/vi/abc123/hqdefault.jpg","link":"https://www.youtube.com/watch?v=abc123"}]}
```

### A message

Lengths count Unicode characters; other fields are ignored.

| Field | Required | Bound |
|---|---|---|
| `id` | yes | 1–64 characters of `A-Z a-z 0-9 . _ -`, yours to choose |
| `text` | yes | 1–2000 characters, plain text; a newline breaks the line |
| `title` | no | 1–120 characters, one bold line, no links |
| `image` | no | an `https` address of a PNG, JPEG or WebP picture, at most 2048 characters |
| `link` | no | an `https` address, at most 2048 characters, opened by the picture or the title |

In `text`, `[words](https://…)` becomes underlined words that open the address. That is the only rule: everything else — angle brackets, asterisks, bare addresses, `[words](http://…)` — is drawn as written.

A picture may come from any `https` host, with no network declaration: PNG, JPEG or WebP, at most 2 MiB and 4096 px a side, shown at most 240 px high without cropping. If it cannot be fetched, the row keeps its text.

Links open outside the application: in the browser, or on a phone in whichever app the phone opens that link with.

### `ctx.message(message)`

Callable in any of an assistant's calls. Shows one row and answers `{ shown: true }`, without waiting for the picture. A row with the same `id` is replaced in place; an `id` the person dismissed answers `{ shown: false }` and stays dismissed on that computer — publish a new `id` to show it again. At ten rows a new one evicts the oldest. Rows are kept in memory only and start empty at every start; leaving a message out of a later feed does not remove it.

A refusal is thrown as an error with `code` and `reason`: `badArgs` with the field's name as `reason`, or `notAssistant`.

### What `checkMessages` answers

`{ ok: true }` when every message was shown or already dismissed, an empty list included. Otherwise `{ ok: false, reason }`: `http` (the request threw), `status` (not 200), `shape` (not JSON, or no `messages` list of at most ten), or `refused` (a message was refused, or was not an object; the others are still shown).

### Logging

Log with `ctx.log` the event, the request, the answer whole, every message whole with its outcome or refusal (`code` and `reason`), and the counts at the end. Nothing is masked; FilmOpen times each line. No retry and no cache: a feed that is down is logged and answered honestly, and the next start, enable or 44 hours asks again.

```js
async checkMessages(ctx, event) {
  ctx.log('my-plugin.messages.start', { event, plugin: ctx.plugin });
  const counts = { received: 0, shown: 0, dismissed: 0, refused: 0 };
  const done = answer => { ctx.log('my-plugin.messages.done', { ...counts, answer }); return answer; };
  const p = ctx.plugin, q = encodeURIComponent;
  const url = `${event.feed}?plugin=${q(p.tag)}&author=${q(p.author)}&v=${q(p.v)}&app=${q(event.app.version)}&platform=${q(event.app.platform)}`;
  const fail = (reason, details) => { ctx.log('my-plugin.messages.failed', { reason, url, ...details }, 'warning'); return done({ ok: false, reason }); };
  const request = { method: 'GET', url, timeoutMs: 8000 };
  ctx.log('my-plugin.messages.request', request);
  let response, body;
  try { response = await ctx.http(request); }
  catch (e) { return fail('http', { code: e?.code, reason: e?.reason, message: e?.message ?? String(e) }); }
  ctx.log('my-plugin.messages.answer', response);
  if (response.status !== 200) return fail('status', { status: response.status, body: response });
  try { body = response.json ?? JSON.parse(response.text); }
  catch (e) { return fail('shape', { body: response, message: e?.message ?? String(e) }); }
  if (!body || typeof body !== 'object' || Array.isArray(body) || !Array.isArray(body.messages) || body.messages.length > 10)
    return fail('shape', { body: response });
  counts.received = body.messages.length;
  for (const [index, message] of body.messages.entries()) {
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      counts.refused++;
      ctx.log('my-plugin.messages.message.refused', { index, message, code: 'badArgs', reason: 'notObject' }, 'warning');
      continue;
    }
    try {
      const answer = await ctx.message(message), outcome = answer.shown ? 'shown' : 'dismissed';
      counts[outcome]++;
      ctx.log('my-plugin.messages.message.' + outcome, { index, message, answer });
    } catch (e) {
      counts.refused++;
      ctx.log('my-plugin.messages.message.refused', { index, message, code: e?.code, reason: e?.reason ?? e?.message ?? String(e) }, 'warning');
    }
  }
  return done(counts.refused ? { ok: false, reason: 'refused' } : { ok: true });
}
```

## Plugins

- [fo-assistant](../../fo-assistant/)

[All types of plugins](../)
