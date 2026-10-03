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

## 3. ["commands", "messages"]

Exit: 0

```text
[Discovery stdout: 15660 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 4. ["commands", "chats"]

Exit: 0

```text
[Discovery stdout: 16038 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 5. ["messages", "context", "--help"]

Exit: 0

```text
[Discovery stdout: 489 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 6. ["messages", "search", "--help"]

Exit: 0

```text
[Discovery stdout: 1505 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 7. ["chats", "list", "--all", "--json"]

Exit: 0

```text
{"items":[{"id":"-100710001","title":"Atlas analytics","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"-100710002","title":"Atlas finance","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2},{"id":"-100710003","title":"Atlas procurement","kind":"group","unreadCount":0,"lastMessageAt":"2026-10-02T11:00:00.000Z","participantsCount":2}],"page":1,"limit":3,"hasMore":false}

```

Stderr:

```text

```

## 8. ["store", "status", "--help"]

Exit: 0

```text
[Discovery stdout: 293 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 9. ["store", "status", "--json"]

Exit: 0

```text
{"items":[{"chatId":"-100710002","title":"Atlas finance","messages":2,"oldestAt":"2026-09-28T10:00:00.000Z","newestAt":"2026-09-29T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]},{"chatId":"-100710001","title":"Atlas analytics","messages":30,"oldestAt":"2026-09-05T10:00:00.000Z","newestAt":"2026-09-20T10:00:00.000Z","lastStoredAt":"2026-10-03T10:00:00.000Z","held":[]}],"page":1,"limit":2,"hasMore":false}

```

Stderr:

```text

```

## 10. ["messages", "search", "Atlas OR аналитик* OR НДС", "--limit", "100", "--newest", "--timezone", "Europe/Madrid", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100710002","senderId":"900002","senderName":"Anna","timestamp":"2026-09-28T10:00:00.000Z","editedAt":null,"text":"Final correction to Atlas analytics quote: EUR 1800 including VAT, replaces EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas finance","locator":"msg:telegram/900001/-100710002/1","score":null},{"id":"1","chatId":"-100710001","senderId":"900002","senderName":"Anna","timestamp":"2026-09-05T10:00:00.000Z","editedAt":null,"text":"Atlas analytics quote: EUR 1500 excluding VAT. Please confirm.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"chatTitle":"Atlas analytics","locator":"msg:telegram/900001/-100710001/1","score":null}],"hasMore":false,"corrections":[],"wordsReady":true,"completeness":[{"chatId":"-100710001","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"-100710002","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"},{"chatId":"-100710003","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"}],"query":{"language":"lucene-v1","version":1,"fieldsVersion":1,"presetVersion":1,"timezone":"Europe/Madrid","order":"newest"},"coverage":{"state":"unknown","lastSyncedAt":null,"inventoryComplete":false,"accounts":[{"provider":"telegram","account":"900001"}],"coveredChats":3},"page":1,"limit":100}

```

Stderr:

```text
3 of the chats searched are not held in full — `tg store fetch <chat>` fetches one

```

## 11. ["messages", "search", "Atlas OR analytics OR аналитик* OR 1500 OR 1800 OR VAT OR НДС OR price OR цена", "--chat", "-100710003", "--limit", "100", "--json"]

Exit: 0

```text
{"items":[],"hasMore":false,"corrections":[],"wordsReady":true,"completeness":[{"chatId":"-100710003","state":"unknown","upToDate":false,"gaps":false,"reachesStart":false,"provider":"telegram","account":"900001"}],"query":{"language":"lucene-v1","version":1,"fieldsVersion":1,"presetVersion":1,"timezone":"UTC","order":"relevance"},"coverage":{"state":"unknown","lastSyncedAt":null,"inventoryComplete":false,"accounts":[{"provider":"telegram","account":"900001"}],"chat":"-100710003","coveredChats":1},"page":1,"limit":100}

```

Stderr:

```text
1 of the chats searched are not held in full — `tg store fetch <chat>` fetches one

```

## 12. ["store", "status", "-100710003", "--json"]

Exit: 0

```text
{"items":[],"page":1,"limit":0,"hasMore":false}

```

Stderr:

```text
the store holds no messages for this profile yet

```

## 13. ["messages", "context", "-100710002", "1", "--before-n", "3", "--after-n", "10", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100710002","senderId":"900002","senderName":"Anna","timestamp":"2026-09-28T10:00:00.000Z","editedAt":null,"text":"Final correction to Atlas analytics quote: EUR 1800 including VAT, replaces EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true},{"id":"2","chatId":"-100710002","senderId":"900003","senderName":"Kate","timestamp":"2026-09-29T10:00:00.000Z","editedAt":null,"text":"Approved final analytics price EUR 1800 including VAT; use this for payment.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":2,"hasMore":false}

```

Stderr:

```text

```

## 14. ["messages", "context", "-100710001", "1", "--before-n", "3", "--after-n", "40", "--json"]

Exit: 0

```text
{"items":[{"id":"1","chatId":"-100710001","senderId":"900002","senderName":"Anna","timestamp":"2026-09-05T10:00:00.000Z","editedAt":null,"text":"Atlas analytics quote: EUR 1500 excluding VAT. Please confirm.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null,"anchor":true},{"id":"2","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-06T10:00:00.000Z","editedAt":null,"text":"Confirmed analytics EUR 1500 excluding VAT.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"3","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-07T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 1; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"4","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-07T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 2; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"5","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-08T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 3; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"6","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-08T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 4; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"7","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-09T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 5; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"8","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-09T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 6; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"9","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-10T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 7; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"10","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-10T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 8; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"11","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-11T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 9; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"12","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-11T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 10; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"13","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-12T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 11; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"14","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-12T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 12; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"15","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-13T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 13; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"16","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-13T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 14; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"17","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-14T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 15; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"18","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-14T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 16; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"19","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-15T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 17; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"20","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-15T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 18; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"21","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-16T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 19; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"22","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-16T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 20; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"23","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-17T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 21; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"24","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-17T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 22; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"25","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-18T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 23; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"26","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-18T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 24; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"27","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-19T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 25; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"28","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-19T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 26; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"29","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 27; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null},{"id":"30","chatId":"-100710001","senderId":"900003","senderName":"Kate","timestamp":"2026-09-20T10:00:00.000Z","editedAt":null,"text":"Analytics planning update 28; timeline unchanged.","outgoing":false,"attachments":[],"replyTo":null,"forwardedFrom":null,"reactions":null}],"page":1,"limit":30,"hasMore":false}

```

Stderr:

```text

```

## 15. ["messages", "evidence", "--help"]

Exit: 0

```text
[Discovery stdout: 392 bytes; exact output is in trace.jsonl]
```

Stderr:

```text

```

## 16. ["messages", "evidence", "-100710001", "--before-id", "3", "--limit", "10", "--json"]

Exit: 0

```text
{"schemaVersion":1,"kind":"chats","source":{"provider":"telegram","account":"900001","chat":"-100710001"},"limits":{"messages":10,"bytes":65536},"contentBytes":752,"coverage":{"provided":2,"included":2,"omitted":0,"hasMore":false,"history":"unknown","truncatedBy":null},"items":[{"locator":"msg:telegram/900001/-100710001/2","timestamp":"2026-09-06T10:00:00.000Z","editedAt":null,"senderId":"900003","senderName":"Kate","senderIsChat":false,"outgoing":false,"text":"Confirmed analytics EUR 1500 excluding VAT.","replyTo":null,"threadId":null,"attachmentKinds":[],"fingerprint":"727b905f2ee797e5a8e56e3ce5e5807bf1e63365abb8f5e34e4d2b1973945b14"},{"locator":"msg:telegram/900001/-100710001/1","timestamp":"2026-09-05T10:00:00.000Z","editedAt":null,"senderId":"900002","senderName":"Anna","senderIsChat":false,"outgoing":false,"text":"Atlas analytics quote: EUR 1500 excluding VAT. Please confirm.","replyTo":null,"threadId":null,"attachmentKinds":[],"fingerprint":"409759f54c3818b608ab6ca57fdce49b62ddac1be2bfcba3f20c675a4d38dfd4"}],"id":"4ed5e58b-7fda-4840-bddd-a6ca9a5b5e29","fingerprint":"bde33556b7c22910e6470a08c2b4c8dc0986a89ec397f922da8195ce5c70c7e6","nextBeforeId":null}

```

Stderr:

```text

```

## 17. ["messages", "evidence", "-100710003", "--limit", "10", "--json"]

Exit: 0

```text
{"schemaVersion":1,"kind":"chats","source":{"provider":"telegram","account":"900001","chat":"-100710003"},"limits":{"messages":10,"bytes":65536},"contentBytes":2,"coverage":{"provided":0,"included":0,"omitted":0,"hasMore":false,"history":"unknown","truncatedBy":null},"items":[],"id":"85ff3f51-3df3-44a6-b776-ef30d0a045fc","fingerprint":"3904829a3b94319be9af38da18834f9427808e524ff74bf76a38b29073b36eb4","nextBeforeId":null}

```

Stderr:

```text

```

## 18. ["messages", "evidence", "-100710002", "--limit", "10", "--json"]

Exit: 0

```text
{"schemaVersion":1,"kind":"chats","source":{"provider":"telegram","account":"900001","chat":"-100710002"},"limits":{"messages":10,"bytes":65536},"contentBytes":822,"coverage":{"provided":2,"included":2,"omitted":0,"hasMore":false,"history":"unknown","truncatedBy":null},"items":[{"locator":"msg:telegram/900001/-100710002/2","timestamp":"2026-09-29T10:00:00.000Z","editedAt":null,"senderId":"900003","senderName":"Kate","senderIsChat":false,"outgoing":false,"text":"Approved final analytics price EUR 1800 including VAT; use this for payment.","replyTo":null,"threadId":null,"attachmentKinds":[],"fingerprint":"9c496f898ad526f7c7f0cf7c1838fb141025d53fff771714633a6cf8287a6f45"},{"locator":"msg:telegram/900001/-100710002/1","timestamp":"2026-09-28T10:00:00.000Z","editedAt":null,"senderId":"900002","senderName":"Anna","senderIsChat":false,"outgoing":false,"text":"Final correction to Atlas analytics quote: EUR 1800 including VAT, replaces EUR 1500 excluding VAT.","replyTo":null,"threadId":null,"attachmentKinds":[],"fingerprint":"7cb71c35af784787f1a15310b2797832d6b335a5c58ba87a5c261c333aaaeb2d"}],"id":"3826287f-6f29-41f8-bf27-46d0ce354652","fingerprint":"f05c8bcd753dd779b6ac521f5aba985b758212742f0f00a3008b494a8538a7b7","nextBeforeId":null}

```

Stderr:

```text

```
