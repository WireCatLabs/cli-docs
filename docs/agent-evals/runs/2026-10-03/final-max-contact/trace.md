## 1. ["--help"]

Exit: 0

```text
[Discovery stdout: 4791 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 2. ["skill", "show"]

Exit: 0

```text
[Discovery stdout: 28208 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 3. ["contacts", "--help"]

Exit: 0

```text
[Discovery stdout: 1310 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 4. ["messages", "--help"]

Exit: 0

```text
[Discovery stdout: 1714 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 5. ["messages", "search", "--help"]

Exit: 0

```text
[Discovery stdout: 1434 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 6. ["store", "status", "--help"]

Exit: 0

```text
[Discovery stdout: 238 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 7. ["chats", "list", "--help"]

Exit: 0

```text
[Discovery stdout: 455 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 8. ["messages", "search", "Stripe OR Atlas", "--limit", "100", "--json"]

Exit: 0

```text
{"items":[{"id":"900000000000000001","chatId":"900005","senderId":"900005","senderName":"Elena","timestamp":"2026-09-22T10:00:00.000Z","editedAt":null,"text":"Yes, I'm Elena Petrova (@elena_payments), the engineer from Atlas integrations. Happy to review Stripe webhooks.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Elena","locator":"msg:max/900001/900005/900000000000000001","score":0.000001920303605313093},{"id":"900000000000000001","chatId":"-100730001","senderId":"900005","senderName":"Elena","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"I implemented Stripe Connect webhooks and idempotency for Atlas. Available next week to help with payment integration.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas integrations","locator":"msg:max/900001/-100730001/900000000000000001","score":0.000001920303605313093},{"id":"900000000000000001","chatId":"-100730002","senderId":"900007","senderName":"Olga","timestamp":"2026-09-21T10:00:00.000Z","editedAt":null,"text":"I design checkout screens; backend Stripe integration is outside my expertise.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Payments community","locator":"msg:max/900001/-100730002/900000000000000001","score":0.0000011120879120879122},{"id":"900000000000000001","chatId":"900006","senderId":"900006","senderName":"Elena","timestamp":"2026-09-22T11:00:00.000Z","editedAt":null,"text":"I'm Elena Ivanova (@elena_design), I work on typography and have no Stripe backend experience.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Elena","locator":"msg:max/900001/900006/900000000000000001","score":9.825242718446604e-7}],"hasMore":false,"corrections":[],"wordsReady":true,"completeness":[{"chatId":"-100730001","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"max","account":"900001"},{"chatId":"-100730002","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"max","account":"900001"},{"chatId":"900005","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"max","account":"900001"},{"chatId":"900006","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"max","account":"900001"},{"chatId":"900007","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"max","account":"900001"}],"query":{"language":"lucene-v1","version":1,"fieldsVersion":1,"presetVersion":1,"timezone":"UTC","order":"relevance"},"coverage":{"state":"unknown","lastSyncedAt":null,"inventoryComplete":false,"accounts":[{"provider":"max","account":"900001"}],"coveredChats":5},"page":1,"limit":100}

```

Stderr:

```text
5 of the chats searched are not held in full — `max store fetch <chat>` fetches one

```

## 9. ["chats", "list", "--all", "--json"]

Exit: 0

```text
{"items":[{"id":"-100730001","title":"Atlas integrations","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"-100730002","title":"Payments community","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"900005","title":"Elena","kind":"dialog","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2,"providerMetadata":{"partnerId":"900005"}},{"id":"900006","title":"Elena","kind":"dialog","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2,"providerMetadata":{"partnerId":"900006"}},{"id":"900007","title":"Olga","kind":"dialog","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2,"providerMetadata":{"partnerId":"900007"}}],"page":1,"limit":5,"hasMore":false}

```

Stderr:

```text

```

## 10. ["store", "status", "--json"]

Exit: 0

```text
{"items":[{"chatId":"900006","title":"Elena","messages":1,"oldestAt":"2026-09-22T11:00:00.000Z","newestAt":"2026-09-22T11:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"900005","title":"Elena","messages":1,"oldestAt":"2026-09-22T10:00:00.000Z","newestAt":"2026-09-22T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"-100730002","title":"Payments community","messages":1,"oldestAt":"2026-09-21T10:00:00.000Z","newestAt":"2026-09-21T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"-100730001","title":"Atlas integrations","messages":1,"oldestAt":"2026-09-20T10:00:00.000Z","newestAt":"2026-09-20T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]}],"page":1,"limit":4,"hasMore":false}

```

Stderr:

```text

```

## 11. ["messages", "list", "--help"]

Exit: 0

```text
[Discovery stdout: 1018 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 12. ["contacts", "show", "900006", "--json"]

Exit: 0

```text
{"id":"900006","name":"Elena","username":"elena_design","description":null,"lastMessagedAt":null,"chats":[{"id":"900006","title":"Elena","kind":"dialog","lastMessageAt":"2026-10-02T11:00:00.000Z"}]}

```

Stderr:

```text

```

## 13. ["contacts", "show", "900005", "--json"]

Exit: 0

```text
{"id":"900005","name":"Elena","username":"elena_payments","description":null,"lastMessagedAt":null,"chats":[{"id":"-100730001","title":"Atlas integrations","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"-100730002","title":"Payments community","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"900005","title":"Elena","kind":"dialog","lastMessageAt":"2026-10-02T11:00:00.000Z"}]}

```

Stderr:

```text

```

## 14. ["messages", "context", "--help"]

Exit: 0

```text
[Discovery stdout: 430 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 15. ["contacts", "show", "900007", "--json"]

Exit: 0

```text
{"id":"900007","name":"Olga","username":null,"description":null,"lastMessagedAt":null,"chats":[{"id":"-100730001","title":"Atlas integrations","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"-100730002","title":"Payments community","kind":"group","lastMessageAt":"2026-10-02T11:00:00.000Z"},{"id":"900007","title":"Olga","kind":"dialog","lastMessageAt":"2026-10-02T11:00:00.000Z"}]}

```

Stderr:

```text

```

## 16. ["messages", "list", "-100730001", "--limit", "30", "--json"]

Exit: 0

```text
{"items":[{"id":"900000000000000001","chatId":"-100730001","senderId":"900005","senderName":"Elena","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"I implemented Stripe Connect webhooks and idempotency for Atlas. Available next week to help with payment integration.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":30,"hasMore":false}

```

Stderr:

```text

```

## 17. ["messages", "list", "900006", "--limit", "30", "--json"]

Exit: 0

```text
{"items":[{"id":"900000000000000001","chatId":"900006","senderId":"900006","senderName":"Elena","timestamp":"2026-09-22T11:00:00.000Z","editedAt":null,"text":"I'm Elena Ivanova (@elena_design), I work on typography and have no Stripe backend experience.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":30,"hasMore":false}

```

Stderr:

```text

```

## 18. ["messages", "list", "900007", "--limit", "30", "--json"]

Exit: 0

```text
{"items":[],"page":1,"limit":30,"hasMore":false}

```

Stderr:

```text

```

## 19. ["messages", "list", "900005", "--limit", "30", "--json"]

Exit: 0

```text
{"items":[{"id":"900000000000000001","chatId":"900005","senderId":"900005","senderName":"Elena","timestamp":"2026-09-22T10:00:00.000Z","editedAt":null,"text":"Yes, I'm Elena Petrova (@elena_payments), the engineer from Atlas integrations. Happy to review Stripe webhooks.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":30,"hasMore":false}

```

Stderr:

```text

```

## 20. ["messages", "list", "-100730002", "--limit", "30", "--json"]

Exit: 0

```text
{"items":[{"id":"900000000000000001","chatId":"-100730002","senderId":"900007","senderName":"Olga","timestamp":"2026-09-21T10:00:00.000Z","editedAt":null,"text":"I design checkout screens; backend Stripe integration is outside my expertise.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":30,"hasMore":false}

```

Stderr:

```text

```

## 21. ["messages", "send", "--help"]

Exit: 0

```text
[Discovery stdout: 1522 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 22. ["messages", "send", "900005", "--json"]

Exit: 2

```text

```

Stderr:

```text
{"error":{"code":"validation_error","message":"nothing to send — give the text or pipe it in"}}

```

## 23. ["messages", "send", "900005", "Елена, привет! Можешь помочь с платёжной интеграцией Stripe для Atlas — проверить вебхуки и идемпотентность? Когда тебе удобно?", "--json"]

Exit: 5

```text

```

Stderr:

```text
{"error":{"code":"permission_error","message":"profile default is read-only (readOnly, from the config file: profiles.default) — it cannot send, react, change chats or change the account"}}

```
