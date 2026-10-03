## 1. ["--help"]

Exit: 0

```text
[Discovery stdout: 4552 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 2. ["skill", "show"]

Exit: 0

```text
[Discovery stdout: 16994 bytes; exact output is in trace.jsonl]
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

## 4. ["chats", "list", "--search", "Atlas", "--json"]

Exit: 0

```text
{"items":[{"id":"-100710001","title":"Atlas analytics","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"-100710002","title":"Atlas finance","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"-100710003","title":"Atlas procurement","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2}],"page":1,"limit":20,"hasMore":false}

```

Stderr:

```text

```

## 5. ["store", "status", "--json"]

Exit: 0

```text
{"items":[{"chatId":"-100710002","title":"Atlas finance","messages":2,"oldestAt":"2026-09-28T10:00:00.000Z","newestAt":"2026-09-29T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"-100710001","title":"Atlas analytics","messages":30,"oldestAt":"2026-09-05T10:00:00.000Z","newestAt":"2026-09-20T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]}],"page":1,"limit":2,"hasMore":false}

```

Stderr:

```text

```

## 6. ["messages", "search", "Atlas OR аналитика OR НДС", "--limit", "100", "--newest", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100710002","senderId":"900002","senderName":"Anna","timestamp":"2026-09-28T10:00:00.000Z","editedAt":null,"text":"Final correction to Atlas analytics quote: EUR 1800 including VAT, replaces EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas finance","locator":"msg:telegram/900001/-100710002/1","score":1.7827684933889765},{"id":"1","chatId":"-100710001","senderId":"900002","senderName":"Anna","timestamp":"2026-09-05T10:00:00.000Z","editedAt":null,"text":"Atlas analytics quote: EUR 1500 excluding VAT. Please confirm.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas analytics","locator":"msg:telegram/900001/-100710001/1","score":2.2405135092249577}],"hasMore":false,"corrections":[],"wordsReady":true,"completeness":[{"chatId":"-100710001","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"-100710002","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"-100710003","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"}],"query":{"language":"lucene-v1","version":1,"fieldsVersion":1,"presetVersion":1,"timezone":"UTC","order":"newest"},"coverage":{"state":"unknown","lastSyncedAt":null,"inventoryComplete":false,"accounts":[{"provider":"telegram","account":"900001"}],"coveredChats":3},"page":1,"limit":100}

```

Stderr:

```text
3 of the chats searched are not held in full — `tg store fetch <chat>` fetches one

```

## 7. ["messages", "context", "--help"]

Exit: 0

```text
[Discovery stdout: 489 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 8. ["messages", "list", "--help"]

Exit: 0

```text
[Discovery stdout: 1083 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 9. ["messages", "context", "-100710001", "1", "--before-n", "2", "--after-n", "5", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100710001","senderId":"900002","senderName":"Anna","timestamp":"2026-09-05T10:00:00.000Z","editedAt":null,"text":"Atlas analytics quote: EUR 1500 excluding VAT. Please confirm.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true},{"id":"2","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-06T10:00:00.000Z","editedAt":null,"text":"Confirmed analytics EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"3","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-07T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 1; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"4","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-07T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 2; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"5","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-08T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 3; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"6","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-08T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 4; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":6,"hasMore":false}

```

Stderr:

```text

```

## 10. ["messages", "context", "-100710002", "1", "--before-n", "2", "--after-n", "5", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100710002","senderId":"900002","senderName":"Anna","timestamp":"2026-09-28T10:00:00.000Z","editedAt":null,"text":"Final correction to Atlas analytics quote: EUR 1800 including VAT, replaces EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true},{"id":"2","chatId":"-100710002","senderId":"900003","senderName":"Kate","timestamp":"2026-09-29T10:00:00.000Z","editedAt":null,"text":"Approved final analytics price EUR 1800 including VAT; use this for payment.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":2,"hasMore":false}

```

Stderr:

```text

```

## 11. ["messages", "search", "1500 OR 1800 OR VAT OR сентябр* OR September", "--limit", "100", "--newest", "--timezone", "Europe/Madrid", "--json"]

Exit: 0

```text
{"items":[{"id":"2","chatId":"-100710002","senderId":"900003","senderName":"Kate","timestamp":"2026-09-29T10:00:00.000Z","editedAt":null,"text":"Approved final analytics price EUR 1800 including VAT; use this for payment.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas finance","locator":"msg:telegram/900001/-100710002/2","score":null},{"id":"1","chatId":"-100710002","senderId":"900002","senderName":"Anna","timestamp":"2026-09-28T10:00:00.000Z","editedAt":null,"text":"Final correction to Atlas analytics quote: EUR 1800 including VAT, replaces EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas finance","locator":"msg:telegram/900001/-100710002/1","score":null},{"id":"2","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-06T10:00:00.000Z","editedAt":null,"text":"Confirmed analytics EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas analytics","locator":"msg:telegram/900001/-100710001/2","score":null},{"id":"1","chatId":"-100710001","senderId":"900002","senderName":"Anna","timestamp":"2026-09-05T10:00:00.000Z","editedAt":null,"text":"Atlas analytics quote: EUR 1500 excluding VAT. Please confirm.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas analytics","locator":"msg:telegram/900001/-100710001/1","score":null}],"hasMore":false,"corrections":[],"wordsReady":true,"completeness":[{"chatId":"-100710001","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"-100710002","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"-100710003","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"}],"query":{"language":"lucene-v1","version":1,"fieldsVersion":1,"presetVersion":1,"timezone":"Europe/Madrid","order":"newest"},"coverage":{"state":"unknown","lastSyncedAt":null,"inventoryComplete":false,"accounts":[{"provider":"telegram","account":"900001"}],"coveredChats":3},"page":1,"limit":100}

```

Stderr:

```text
3 of the chats searched are not held in full — `tg store fetch <chat>` fetches one

```

## 12. ["messages", "search", "Atlas OR аналитик* OR quote OR price OR VAT OR НДС OR 1500 OR 1800", "--chat", "-100710003", "--limit", "100", "--json"]

Exit: 0

```text
{"items":[],"hasMore":false,"corrections":[],"wordsReady":true,"completeness":[{"chatId":"-100710003","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"}],"query":{"language":"lucene-v1","version":1,"fieldsVersion":1,"presetVersion":1,"timezone":"UTC","order":"relevance"},"coverage":{"state":"unknown","lastSyncedAt":null,"inventoryComplete":false,"accounts":[{"provider":"telegram","account":"900001"}],"chat":"-100710003","coveredChats":1},"page":1,"limit":100}

```

Stderr:

```text
1 of the chats searched are not held in full — `tg store fetch <chat>` fetches one

```

## 13. ["chats", "list", "--json"]

Exit: 0

```text
{"items":[{"id":"-100710001","title":"Atlas analytics","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"-100710002","title":"Atlas finance","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"-100710003","title":"Atlas procurement","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2}],"page":1,"limit":20,"hasMore":false}

```

Stderr:

```text

```

## 14. ["--offline", "messages", "list", "-100710003", "--limit", "100", "--json"]

Exit: 0

```text
{"items":[],"page":1,"limit":100,"hasMore":false}

```

Stderr:

```text

```

## 15. ["--offline", "messages", "list", "-100710001", "--limit", "100", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100710001","senderId":"900002","senderName":"Anna","timestamp":"2026-09-05T10:00:00.000Z","editedAt":null,"text":"Atlas analytics quote: EUR 1500 excluding VAT. Please confirm.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"2","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-06T10:00:00.000Z","editedAt":null,"text":"Confirmed analytics EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"3","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-07T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 1; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"4","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-07T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 2; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"5","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-08T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 3; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"6","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-08T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 4; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"7","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-09T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 5; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"8","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-09T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 6; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"9","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-10T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 7; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"10","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-10T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 8; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"11","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-11T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 9; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"12","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-11T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 10; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"13","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-12T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 11; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"14","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-12T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 12; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"15","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-13T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 13; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"16","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-13T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 14; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"17","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-14T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 15; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"18","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-14T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 16; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"19","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-15T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 17; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"20","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-15T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 18; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"21","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-16T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 19; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"22","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-16T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 20; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"23","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-17T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 21; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"24","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-17T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 22; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"25","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-18T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 23; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"26","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-18T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 24; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"27","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-19T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 25; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"28","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-19T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 26; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"29","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 27; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"30","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 28; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":100,"hasMore":false}

```

Stderr:

```text

```
