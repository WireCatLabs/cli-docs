## 1. ["--help"]

Exit: 0

```text
[Discovery stdout: 4549 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 2. ["skill", "show"]

Exit: 0

```text
[Discovery stdout: 17089 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 3. ["commands", "messages", "search", "--json"]

Exit: 0

```text
[Discovery stdout: 3821 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 4. ["commands", "contacts", "show", "--json"]

Exit: 0

```text
[Discovery stdout: 2511 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 5. ["commands", "store", "status", "--json"]

Exit: 0

```text
[Discovery stdout: 2582 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 6. ["store", "status", "--json"]

Exit: 0

```text
{"items":[{"chatId":"900006","title":"Elena","messages":1,"oldestAt":"2026-09-22T11:00:00.000Z","newestAt":"2026-09-22T11:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"900005","title":"Elena","messages":1,"oldestAt":"2026-09-22T10:00:00.000Z","newestAt":"2026-09-22T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"-100730002","title":"Payments community","messages":1,"oldestAt":"2026-09-21T10:00:00.000Z","newestAt":"2026-09-21T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"-100730001","title":"Atlas integrations","messages":1,"oldestAt":"2026-09-20T10:00:00.000Z","newestAt":"2026-09-20T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]}],"page":1,"limit":4,"hasMore":false}

```

Stderr:

```text

```

## 7. ["commands", "messages", "context", "--json"]

Exit: 0

```text
[Discovery stdout: 2935 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 8. ["messages", "search", "Stripe OR Atlas", "--limit", "100", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"900005","senderId":"900005","senderName":"Elena","timestamp":"2026-09-22T10:00:00.000Z","editedAt":null,"text":"Yes, I'm Elena Petrova (@elena_payments), the engineer from Atlas integrations. Happy to review Stripe webhooks.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Elena","locator":"msg:telegram/900001/900005/1","score":0.000001920303605313093},{"id":"1","chatId":"-100730001","senderId":"900005","senderName":"Elena","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"I implemented Stripe Connect webhooks and idempotency for Atlas. Available next week to help with payment integration.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas integrations","locator":"msg:telegram/900001/-100730001/1","score":0.000001920303605313093},{"id":"1","chatId":"-100730002","senderId":"900007","senderName":"Olga","timestamp":"2026-09-21T10:00:00.000Z","editedAt":null,"text":"I design checkout screens; backend Stripe integration is outside my expertise.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Payments community","locator":"msg:telegram/900001/-100730002/1","score":0.0000011120879120879122},{"id":"1","chatId":"900006","senderId":"900006","senderName":"Elena","timestamp":"2026-09-22T11:00:00.000Z","editedAt":null,"text":"I'm Elena Ivanova (@elena_design), I work on typography and have no Stripe backend experience.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Elena","locator":"msg:telegram/900001/900006/1","score":9.825242718446604e-7}],"hasMore":false,"corrections":[],"wordsReady":true,"completeness":[{"chatId":"-100730001","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"-100730002","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"900005","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"900006","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"900007","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"}],"query":{"language":"lucene-v1","version":1,"fieldsVersion":1,"presetVersion":1,"timezone":"UTC","order":"relevance"},"coverage":{"state":"unknown","lastSyncedAt":null,"inventoryComplete":false,"accounts":[{"provider":"telegram","account":"900001"}],"coveredChats":5},"page":1,"limit":100}

```

Stderr:

```text
5 of the chats searched are not held in full — `tg store fetch <chat>` fetches one

```

## 9. ["contacts", "show", "900007", "--json"]

Exit: 0

```text
{"id":"900007","name":"Olga","username":null,"description":null,"lastMessagedAt":null,"chats":[{"id":"-100730001","title":"Atlas integrations","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"-100730002","title":"Payments community","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"900007","title":"Olga","kind":"private","lastMessageAt":"2026-10-02T11:00:00.000Z"}]}

```

Stderr:

```text

```

## 10. ["messages", "context", "msg:telegram/900001/900006/1", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"900006","senderId":"900006","senderName":"Elena","timestamp":"2026-09-22T11:00:00.000Z","editedAt":null,"text":"I'm Elena Ivanova (@elena_design), I work on typography and have no Stripe backend experience.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true}],"page":1,"limit":1,"hasMore":false}

```

Stderr:

```text

```

## 11. ["messages", "context", "msg:telegram/900001/-100730002/1", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100730002","senderId":"900007","senderName":"Olga","timestamp":"2026-09-21T10:00:00.000Z","editedAt":null,"text":"I design checkout screens; backend Stripe integration is outside my expertise.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true}],"page":1,"limit":1,"hasMore":false}

```

Stderr:

```text

```

## 12. ["messages", "context", "msg:telegram/900001/900005/1", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"900005","senderId":"900005","senderName":"Elena","timestamp":"2026-09-22T10:00:00.000Z","editedAt":null,"text":"Yes, I'm Elena Petrova (@elena_payments), the engineer from Atlas integrations. Happy to review Stripe webhooks.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true}],"page":1,"limit":1,"hasMore":false}

```

Stderr:

```text

```

## 13. ["messages", "context", "msg:telegram/900001/-100730001/1", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100730001","senderId":"900005","senderName":"Elena","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"I implemented Stripe Connect webhooks and idempotency for Atlas. Available next week to help with payment integration.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true}],"page":1,"limit":1,"hasMore":false}

```

Stderr:

```text

```

## 14. ["contacts", "show", "900005", "--json"]

Exit: 0

```text
{"id":"900005","name":"Elena","username":"elena_payments","description":null,"lastMessagedAt":null,"chats":[{"id":"-100730001","title":"Atlas integrations","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"-100730002","title":"Payments community","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"900005","title":"Elena","kind":"private","lastMessageAt":"2026-10-02T11:00:00.000Z"}]}

```

Stderr:

```text

```

## 15. ["contacts", "show", "900006", "--json"]

Exit: 0

```text
{"id":"900006","name":"Elena","username":"elena_design","description":null,"lastMessagedAt":null,"chats":[{"id":"900006","title":"Elena","kind":"private","lastMessageAt":"2026-10-02T11:00:00.000Z"}]}

```

Stderr:

```text

```

## 16. ["commands", "messages", "send", "--json"]

Exit: 0

```text
[Discovery stdout: 4369 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 17. ["messages", "send", "900005", "Елена, привет! Можешь сейчас помочь с интеграцией Stripe для Atlas — проверить webhooks и идемпотентность? Ты писала, что уже реализовала их для проекта.", "--json"]

Exit: 5

```text

```

Stderr:

```text
{"error":{"code":"permission_error","message":"profile default denies messages.send (permissions.messages.send is deny, from the config file)","permission":"messages.send"}}

```
