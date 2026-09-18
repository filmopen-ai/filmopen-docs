---
title: Your FilmOpen account
description: Signing in to FilmOpen, what the account is for, and what to do when you cannot get in.
editUrl: https://github.com/filmopen-ai/filmopen-docs/edit/dev/src/content/docs/docs/guides/account.md
sidebar:
  label: Account help and recovery
  order: 1
---

A FilmOpen account is the same account in the app and on filmopen.ai. **You do not need one to work on a film**: projects on your own machine open, play and generate with your own keys without signing in. The account is for what happens between people and between machines — and most of that is still being built, which is why this guide is short.

## Signing in

In the app, open **Settings** and choose **Log in to filmopen.ai**. You can then:

- **Continue with Google, Discord or GitHub.** Your browser opens, you finish there, and the browser hands you back to the app. Nothing of your password reaches FilmOpen: it learns who you are from the service you chose, and nothing else.
- **Use your e-mail address.** Choose **Send a sign-in code**, then type the code that arrives. There is no password to choose and none to forget. Look in your spam folder if the message is slow; a new code can be sent with **Change email or resend**.

Signing in through the browser needs the app to receive the browser's answer, which it can do today on **Windows and Android**. An e-mailed code needs no browser, and works wherever the app runs.

## What the account holds

Your e-mail address, which FilmOpen does not show to other people, and a **display name**, which you set on the same card and which is the name other people will see when there is something of yours to see. That is all, for now.

## If you cannot get in

**There is no password, so there is nothing to reset.** You get back in the way you got in: if you signed up with Google, Discord or GitHub, continue with the same one — and if you have lost access to *that* account, its own recovery is the way back, since FilmOpen cannot restore it for you. If you signed up with your e-mail address, ask for a new code. If you no longer have that mailbox, there is no way yet to move the account to another one: that waits for help by mail, which opens when FilmOpen launches (see [Help](#help)).

When something goes wrong the app says so in one line. What each line means, in the app's own words:

| The app says | What to do |
|---|---|
| *That code is invalid or has expired. Request another code.* | Codes are short-lived, and a newer one replaces an older one. Use the latest message, or choose **Change email or resend**. |
| *Wait … seconds before requesting another code.* | A new code can be asked for only so often. The line counts down; ask again when it is gone. |
| *Please wait a minute before trying again.* | Too many attempts in a short time. Wait the minute, then try once. |
| *That method belongs to another account. Sign in with it separately.* | The Google, Discord or GitHub account you chose is already a FilmOpen account of its own. It cannot be added to the one you are in: sign out, and sign in with it. |
| *No browser could be opened. Use the email code instead.* and *This device cannot receive the sign-in from your browser. Use the email code instead.* | Signing in with Google, Discord or GitHub needs a browser, and needs the app to receive the browser's answer. Where either is missing, the e-mailed code works. |
| *This device's credential store could not be used, so a sign-in cannot be kept safely. Sign-in is unavailable.* | FilmOpen keeps a sign-in in the system's own credential store and will not keep it anywhere less safe. On Linux that store is the desktop's keyring: unlock it, or start one, and try again. |
| *Your session has expired. Sign in again.* | Nothing is lost. Sign in the same way as before. |
| *Your account is unavailable right now. Check your connection and try again.* and *Sign-in could not be completed. Please try again.* | Usually the network. Check the connection, and try again a little later. |
| *Your profile could not be read or saved. Try again later.* | You are signed in; only the display name is affected. **Retry** on the card asks again. |
| *The server refused that name. Keep it to 80 characters …* | A display name is at most 80 characters — accented letters and emoji can count as several — with no control characters. |

To keep one account, keep to one way of signing in.

## Signing out

**Sign out here** on the Settings card signs this device out and leaves your other devices as they are. Your projects stay where they were: they are files on your machine, not part of the account.

## Help

**Help by mail is not open yet.** It opens when FilmOpen launches, and this page will then say where to write. Until it does, this page is the help there is.

Whenever you do write to anyone about your account: say which way you sign in and what the app says, and never send a sign-in code or a password — nobody at FilmOpen will ask you for either.
