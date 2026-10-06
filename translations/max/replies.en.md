---
title: "Automatic replies"
---

`max serve` can answer incoming messages using rules you write in a profile file. Automatic replies currently work **only for test accounts**: a rule answers only people listed in `testers`. Nothing goes to anyone else, even when a rule matches. This lets you test rules with your own second account rather than with real people.

Every command in detail: [commands.md](./commands.md#max-replies).

## Enable replies

1. Write the rules file `<профиль>.replies.json` in the configuration directory, next to the file identified as `configFile` by `max config show --json`. An example with one rule:

   ```json
   {
     "testers": [{ "id": "<id тестового аккаунта>" }],
     "rules": [
       {
         "id": "away",
         "on": true,
         "do": ["reply"],
         "where": { "kinds": ["dialog"], "chats": [], "notChats": [] },
         "when": {
           "hours": { "outside": "09:00-19:00", "days": "mon-fri", "timezone": "Europe/Madrid" },
           "words": [],
           "question": false,
           "mentionsMe": false,
           "from": { "people": [], "notPeople": [], "contactsOnly": false }
         },
         "reply": { "template": "Спасибо, {firstName}! Отвечу утром.", "model": "fill-only", "asReply": true },
         "limits": { "perChat": "1/12h", "perPerson": "1/1d" }
       }
     ]
   }
   ```

   Every field is required. An unknown field name stops the rule and identifies the field.

2. Check what the rule would have answered in already stored messages; nothing is sent:

   ```sh
   max replies test --since-time 7d
   ```

3. Allow sending and start the server:

   ```sh
   max config set permissions.replies.send allow
   max serve
   ```

   Without `allow`, the server sends nothing. Here `ask` also means no: the server has nobody to ask.

## Messages a rule never touches

- your own messages, channels or bots;
- messages already answered, or edited messages;
- messages received before `max serve` started: after a week offline, it does not answer the entire week;
- in a group, messages that neither mention you nor reply to you, unless the rule names that group in `chats`.

Each rule must specify `perChat` and `perPerson` limits. Two automatic responders replying to each other stop at the first limit.

## Stop and check

- `max replies pause` stops every rule for the profile immediately, including in a running `max serve`; no restart is needed. `max replies resume` enables them again.
- `max replies status` shows whether sending is allowed, which rules are enabled and how many test accounts are listed.
- `max sends list` shows each automatic reply with `rule:<id>`, identifying the rule that sent it.