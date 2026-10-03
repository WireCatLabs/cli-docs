// Eight selected landing scenarios. Full scenario bank: docs/LANDING_SCENARIOS.md.
window.WireScenarioVariants = {
  "en": [
    {
      "title": "Context for a call",
      "hint": "tg chats list → tg review",
      "steps": [
        {
          "ask": "Use tg cli, gather context for tomorrow’s Atlas call: decisions, risks and questions."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · team\",\n      \"kind\": \"group\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · design\",\n      \"kind\": \"group\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg review --chat \"Atlas · team\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · team\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"We’re launching on Friday.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Anna needs the final copy by Thursday.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Tom needs staging access.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Decisions so far</h3><ul><li><b>Launch:</b> Friday. The scope of the first release is agreed.</li><li><b>Copy:</b> Anna needs the final version by Thursday.</li></ul><h3>Blocking the launch</h3><p><b>Tom:</b> needs staging access to test payments.</p><h3>For the call</h3><p>Agree who will provide access and when testing will be finished. I also found the design group — I can check it and your direct messages with the people involved.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "We’re launching on Friday.",
              "chat": "Atlas · team",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Anna needs the final copy by Thursday.",
              "chat": "Atlas · team",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Tom needs staging access.",
              "chat": "Atlas · team",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Check the design group and my DMs with Tom too. He may have sent the results there."
        },
        {
          "tool": "tg review --chat \"Atlas · design\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · design\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"The design is ready. We’re still waiting for the final copy.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg chats list --search \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"503\",\n      \"title\": \"Tom\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages list 503 --limit 30",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Test payments work. I still need access to production.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"Atlas\" --chat 503",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Test payments work. I still need access to production.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Context from other chats</h3><ul><li><b>Design:</b> the layout is ready; final copy is the last dependency.</li><li><b>Tom, in your DMs:</b> test payments work. He still needs access to production.</li></ul><h3>The remaining risk</h3><p>Payment testing is partly done — only the production check is blocked. Focus the call on that, rather than starting from scratch.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Test payments work. I still need access to production.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Make a 20-minute agenda covering risks, owners and deadlines. Don't send anything."
        },
        {
          "tool": "tg messages context 503 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Test payments work. I still need access to production.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Tom\",\n      \"text\": \"I need access to production.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>20-minute agenda</h3><ol><li><b>0–7 min:</b> production access — who will grant it, and when can Tom finish testing?</li><li><b>7–12 min:</b> final copy — who will get it to Anna by Thursday?</li><li><b>12–17 min:</b> if we run out of time, do we reduce scope or move the launch?</li><li><b>17–20 min:</b> record an owner and deadline for each action.</li></ol><p><small>Draft ready, based on the project group, design group and your DMs with Tom. Nothing has been sent.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Test payments work. I still need access to production.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Tom",
              "text": "I need access to production.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "context"
    },
    {
      "id": "search",
      "title": "Find recommendations",
      "hint": "messages search --source all",
      "steps": [
        {
          "ask": "Use tg cli, find SQL course recommendations across Telegram and MAX. I want exercises and feedback."
        },
        {
          "tool": "tg messages search \"SQL\" --source all --limit 10",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"601\",\n      \"chat\": \"Analytics · community\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"Took a SQL workshop: weekly exercises and feedback from the instructor.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Daria\"\n    },\n    {\n      \"id\": \"67210\",\n      \"chatId\": \"701\",\n      \"chat\": \"Team · learning\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"The SQL video course helped with basics, but nobody reviewed my work.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Alex\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Two recommendations from different messengers</h3><ul><li><b>Workshop:</b> reviewed exercises — closer to your requirements.</li><li><b>Video course:</b> self-paced learning; feedback is not confirmed.</li></ul><p>Found messages in a Telegram community and a MAX work chat. I’ll check the context of the reviews.</p>",
          "sources": [
            {
              "id": "48210",
              "chatId": "601",
              "chat": "Analytics · community",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "text": "Took a SQL workshop: weekly exercises and feedback from the instructor.",
              "senderName": "Daria"
            },
            {
              "id": "67210",
              "chatId": "701",
              "chat": "Team · learning",
              "messenger": "max",
              "date": "2026-10-02T12:00:00Z",
              "text": "The SQL video course helped with basics, but nobody reviewed my work.",
              "senderName": "Alex"
            }
          ]
        },
        {
          "ask": "Read the messages around those recommendations. I want feedback on mistakes, not just videos."
        },
        {
          "tool": "tg messages context msg:telegram/900001/601/48210 --before-n 1 --after-n 1",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"601\",\n      \"chat\": \"Analytics · community\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"Took a SQL workshop: weekly exercises and feedback from the instructor.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Daria\"\n    },\n    {\n      \"id\": \"48211\",\n      \"chatId\": \"601\",\n      \"chat\": \"Analytics · community\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"The workshop reviews mistakes. Don’t expect advanced topics.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Daria\"\n    }\n  ]\n}",
          "fixedMessenger": true
        },
        {
          "tool": "max messages context msg:max/900001/701/67210 --before-n 1 --after-n 1",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"67210\",\n      \"chatId\": \"701\",\n      \"chat\": \"Team · learning\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"The SQL video course helped with basics, but nobody reviewed my work.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Alex\"\n    },\n    {\n      \"id\": \"67211\",\n      \"chatId\": \"701\",\n      \"chat\": \"Team · learning\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"Easy to watch at your own pace; I had to find practice exercises elsewhere.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Alex\"\n    }\n  ]\n}",
          "fixedMessenger": true
        },
        {
          "say": "<h3>What to check first</h3><p>Start with the workshop: a participant confirms feedback on mistakes. Keep the video course as a self-paced alternative.</p><p>These reviews don’t establish the current syllabus, price or availability. Ask the organizers about assignment reviews and course level.</p>",
          "sources": [
            {
              "id": "48211",
              "chatId": "601",
              "chat": "Analytics · community",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "text": "The workshop reviews mistakes. Don’t expect advanced topics.",
              "senderName": "Daria"
            },
            {
              "id": "67211",
              "chatId": "701",
              "chat": "Team · learning",
              "messenger": "max",
              "date": "2026-10-02T12:00:00Z",
              "text": "Easy to watch at your own pace; I had to find practice exercises elsewhere.",
              "senderName": "Alex"
            }
          ]
        }
      ]
    },
    {
      "id": "moderation",
      "title": "Manage a group",
      "hint": "chats moderate --dry-run",
      "steps": [
        {
          "ask": "Use tg cli, I’m an admin of the Community group. Show violations of its rules and a proposed action plan. Don’t delete anything yet."
        },
        {
          "tool": "tg chats list --search \"Community\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"301\",\n      \"title\": \"Community\",\n      \"kind\": \"group\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg chats rules show 301",
          "out": "{\n  \"items\": [],\n  \"rules\": {\n    \"links\": \"delete\",\n    \"consent.delete\": \"ask\"\n  }\n}"
        },
        {
          "tool": "tg messages list 301 --limit 20",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"301\",\n      \"chat\": \"Community\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"We help small teams launch websites and set up advertising. Portfolio and details: https://example.com/services\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Alex\"\n    },\n    {\n      \"id\": \"48211\",\n      \"chatId\": \"301\",\n      \"chat\": \"Community\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"We can take on two more projects this week. If your business needs leads, here are our packages: https://example.com/pricing\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Alex\"\n    },\n    {\n      \"id\": \"48212\",\n      \"chatId\": \"301\",\n      \"chat\": \"Community\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"Will there be a recording of the meeting?\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Daria\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg chats moderate 301 --dry-run --max-actions 2",
          "out": "{\n  \"items\": [\n    {\n      \"messageId\": \"48210\",\n      \"action\": \"delete\",\n      \"outcome\": \"planned\"\n    },\n    {\n      \"messageId\": \"48211\",\n      \"action\": \"delete\",\n      \"outcome\": \"planned\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>A plan for your review</h3><p>Two promotional messages violate the saved link rule. The proposal is to delete only those messages.</p><p>The question about a recording follows the rules. No members will be removed. This is a preview; no actions have been taken.</p>",
          "sources": [
            {
              "id": "48210",
              "chatId": "301",
              "chat": "Community",
              "date": "2026-10-02T14:00:00Z",
              "text": "We help small teams launch websites and set up advertising. Portfolio and details: https://example.com/services",
              "senderName": "Alex"
            },
            {
              "id": "48211",
              "chatId": "301",
              "chat": "Community",
              "date": "2026-10-02T14:00:00Z",
              "text": "We can take on two more projects this week. If your business needs leads, here are our packages: https://example.com/pricing",
              "senderName": "Alex"
            }
          ]
        },
        {
          "ask": "Delete only those two promotional messages for everyone. Keep the question and all members."
        },
        {
          "tool": "tg messages delete 301 48210 48211 --for-everyone --allow-dangerous",
          "out": "{\n  \"items\": [],\n  \"deleted\": [\n    \"48210\",\n    \"48211\"\n  ]\n}"
        },
        {
          "say": "<h3>Two messages deleted</h3><p>Only the selected messages were deleted. The recording question and all members remain. No other actions from the plan were run.</p>",
          "sources": [
            {
              "id": "48211",
              "chatId": "301",
              "chat": "Community",
              "date": "2026-10-02T14:00:00Z",
              "text": "We can take on two more projects this week. If your business needs leads, here are our packages: https://example.com/pricing",
              "messenger": "tg",
              "senderName": "Alex"
            },
            {
              "id": "48212",
              "chatId": "301",
              "chat": "Community",
              "date": "2026-10-02T14:00:00Z",
              "text": "Will there be a recording of the meeting?",
              "messenger": "tg",
              "senderName": "Daria"
            }
          ]
        }
      ]
    },
    {
      "title": "Morning briefing",
      "hint": "tg inbox → tg review",
      "steps": [
        {
          "ask": "Use tg cli, show who is waiting for my reply and which updates from my subscriptions are worth reading."
        },
        {
          "tool": "tg inbox",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Marco\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Approve the budget by 11:00 or the contractor cannot start.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    },\n    {\n      \"title\": \"Anna\",\n      \"messages\": [\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Anna\",\n          \"text\": \"The meeting moved to 19:30. Please confirm.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    },\n    {\n      \"title\": \"Mum\",\n      \"messages\": [\n        {\n          \"id\": \"8812\",\n          \"senderName\": \"Mum\",\n          \"text\": \"Voice note, 0:42\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --chat \"Tech news\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Tech news\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"The coding tool has been updated.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"A practical guide to a new search approach is out.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Needs your attention today</h3><ul><li><b>Before 11:00 — Marco:</b> approve the budget so the team can continue.</li><li><b>This evening — Anna:</b> the meeting moved to 19:30; she needs your confirmation.</li><li><b>No deadline — Mum:</b> a 42-second voice note.</li></ul><h3>From your news channels</h3><ul><li><b>Coding tools:</b> an update to the development workflow.</li><li><b>Search:</b> a practical guide with examples.</li></ul><p><small>I can show the details and original messages for each item, or filter the news to work-related topics.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Marco",
              "text": "Approve the budget by 11:00 or the contractor cannot start.",
              "chat": "Marco",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48211",
              "senderName": "Anna",
              "text": "The meeting moved to 19:30. Please confirm.",
              "chat": "Anna",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "8812",
              "senderName": "Mum",
              "text": "Voice note, 0:42",
              "chat": "Mum",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "The coding tool has been updated.",
              "chat": "Tech news",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            }
          ]
        },
        {
          "ask": "Transcribe Mum’s voice note and tell me what needs doing today."
        },
        {
          "tool": "tg messages transcribe \"Mum\" 8812",
          "out": "{\n  \"messageId\": \"8812\",\n  \"text\": \"My appointment is tomorrow. Please confirm today whether you can drive me there.\",\n  \"timestamp\": \"2026-10-02T09:00:00Z\",\n  \"senderName\": \"Mum\"\n}"
        },
        {
          "say": "<h3>Mum needs an answer today</h3><p>Her appointment is tomorrow; confirm whether you can drive her. The voice note is transcribed. No reply has been sent.</p>",
          "sources": [
            {
              "id": "8812",
              "text": "My appointment is tomorrow. Please confirm today whether you can drive me there.",
              "chat": "Mum",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "senderName": "Mum"
            }
          ]
        },
        {
          "ask": "What should I tackle first in the next 15 minutes?"
        },
        {
          "tool": "tg messages context \"Marco\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Marco\",\n      \"text\": \"The budget needs approval before 11:00 or the contractor can’t start.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Your first 15 minutes</h3><ol><li><b>Budget first:</b> open Marco’s request and make a decision — the contractor is waiting on it.</li><li><b>Then the meeting:</b> confirm 19:30 with Anna.</li><li><b>After that:</b> confirm whether you can drive Mum tomorrow.</li></ol><p><small>I’ve kept the news in a separate list for later. None of it needs immediate action.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Marco",
              "text": "The budget needs approval before 11:00 or the contractor can’t start.",
              "chat": "Marco",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48211",
              "senderName": "Anna",
              "text": "The meeting moved to 19:30. Please confirm.",
              "chat": "Anna",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "8812",
              "text": "My appointment is tomorrow. Please confirm today whether you can drive me there.",
              "chat": "Mum",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "senderName": "Mum"
            }
          ]
        }
      ],
      "id": "inbox"
    },
    {
      "title": "Commitments and replies",
      "hint": "tg review --unanswered",
      "steps": [
        {
          "ask": "Use tg cli, find who needs my reply, what I promised and what I’m waiting on from others."
        },
        {
          "tool": "tg review --since-time 7d --all --unanswered",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Marco: please confirm the budget.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Customer: when is delivery?\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --since-time 7d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"You: I’ll send Anna the invoice by Friday.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Tom: I’ll send the design on Wednesday.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Customer: Friday works for me.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>On your list</h3><ul><li><b>Anna:</b> an invoice by Friday — that’s today.</li><li><b>Marco:</b> a budget decision.</li><li><b>Customer:</b> delivery confirmation.</li></ul><h3>Waiting on others</h3><p><b>Tom:</b> promised the design by Wednesday. I’ll check the other chats before drafting a reminder.</p><h3>Ready to resolve</h3><p>The delivery date is already agreed. The budget needs your decision; I won’t assume it’s approved.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "You: I’ll send Anna the invoice by Friday.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Tom: I’ll send the design on Wednesday.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Customer: Friday works for me.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Find Tom’s chat and check whether he already sent the design. Draft replies to the customer, Anna and Tom."
        },
        {
          "tool": "tg chats list --search \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"503\",\n      \"title\": \"Tom\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages list 503 --limit 30",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Here’s the first design draft. I’ll finalise it after your feedback.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"design\" --chat 503",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Here’s the first design draft. I’ll finalise it after your feedback.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>To the customer</h3><blockquote><p>Delivery is still set for Friday, as agreed. Please let me know if there’s a particular time that works best for you.</p></blockquote><h3>To Anna</h3><blockquote><p>Hi Anna! I’ll send the invoice today, as agreed.</p></blockquote><h3>To Tom</h3><blockquote><p>Tom, thanks for the first draft! When can you send the final version with our feedback incorporated?</p></blockquote><p><small>Tom already sent a draft in your DMs, so saying he hasn’t sent anything would be wrong. All three replies are drafts.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Here’s the first design draft. I’ll finalise it after your feedback.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Send Tom that draft asking about the final design. Hold the other replies."
        },
        {
          "tool": "tg messages send 503 \"Tom, thanks for the first draft! When can you send the final version with our feedback incorporated?\"",
          "out": "{\n  \"chatId\": \"503\",\n  \"messageId\": \"48221\",\n  \"status\": \"sent\"\n}"
        },
        {
          "say": "<h3>Sent to Tom</h3><p>Asked about the final design in the direct chat we found. The customer and Anna replies remain drafts. The budget decision stays with you.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Tom: I’ll send the design on Wednesday.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Customer: Friday works for me.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Here’s the first design draft. I’ll finalise it after your feedback.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "commitments"
    },
    {
      "title": "Reminders and scheduled messages",
      "hint": "tg messages send --at-time",
      "steps": [
        {
          "ask": "Use tg cli, remind me in two hours to check the invoice and in six hours to resolve open questions."
        },
        {
          "tool": "tg messages send me \"Check the invoice\" --at-time 2h",
          "out": "{\n  \"chatId\": \"me\",\n  \"status\": \"scheduled\",\n  \"sendId\": \"schedule-1\"\n}"
        },
        {
          "tool": "tg messages send me \"Resolve open questions\" --at-time 6h",
          "out": "{\n  \"chatId\": \"me\",\n  \"status\": \"scheduled\",\n  \"sendId\": \"schedule-2\"\n}"
        },
        {
          "say": "<h3>Two reminders in Saved Messages</h3><p>In two hours: check the invoice. In six: return to open questions. Telegram will deliver them even with your laptop off.</p>",
          "sources": []
        },
        {
          "ask": "In one hour, ask Anna for the final copy and Tom for the payment status. Message each privately."
        },
        {
          "tool": "tg messages send \"Anna\" \"Hi Anna! Please send the final copy.\" --at-time 1h",
          "out": "{\n  \"status\": \"scheduled\"\n}"
        },
        {
          "tool": "tg messages send \"Tom\" \"Hi Tom! Please send the payment-testing status.\" --at-time 1h",
          "out": "{\n  \"status\": \"scheduled\"\n}"
        },
        {
          "say": "<h3>Private follow-ups scheduled</h3><p>In one hour, Anna will get the request for final copy and Tom for payment status. Two private messages and your two reminders are ready.</p>",
          "sources": []
        }
      ],
      "id": "schedule"
    },
    {
      "title": "All documents on a topic",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Use tg cli, find the current Atlas contract, invoices and presentation. Check project groups and direct messages."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · team\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · design\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"contract OR invoice OR presentation\" --chat \"Atlas · team\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Atlas presentation v2.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"Invoice for the first phase.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48212\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Contract — initial draft.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>In the project group</h3><ul><li><b>Presentation:</b> version v2.</li><li><b>Invoice:</b> for the first phase.</li><li><b>Contract:</b> an initial draft.</li></ul><h3>Before putting the set together</h3><p>I should check Anna’s DMs and the design group for newer files.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Atlas presentation v2.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · team",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Invoice for the first phase.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · team",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Contract — initial draft.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · team",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Check Anna's DMs and the design group. Use the latest versions, but keep the old ones too."
        },
        {
          "tool": "tg chats list --search \"Anna\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"501\",\n      \"title\": \"Anna\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"contract\" --chat 501",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Final Atlas contract. Payment terms updated.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"presentation\" --chat \"Atlas · design\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Atlas presentation v3, with updated designs.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Latest versions</h3><table><thead><tr><th>Document</th><th>Version</th><th>Found in</th></tr></thead><tbody><tr><td>Contract</td><td>Final</td><td>Anna’s DMs</td></tr><tr><td>Invoice</td><td>First phase</td><td>Atlas · team</td></tr><tr><td>Presentation</td><td>v3</td><td>Atlas · design</td></tr></tbody></table><h3>Version history</h3><p>The contract draft and presentation v2 are listed separately. Nothing is being deleted.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Invoice for the first phase.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · team",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Atlas presentation v3, with updated designs.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · design",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Check the remaining invoices and download the current files into an Atlas folder. Don’t send anything."
        },
        {
          "tool": "tg messages search \"invoice\" --chat 501",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48213\",\n      \"senderName\": \"Anna\",\n      \"text\": \"The second-phase invoice hasn’t been issued yet.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages download 501 48210 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/contract-final.pdf\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg messages download 101 48211 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/invoice-phase-1.pdf\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg messages download 102 48210 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/presentation-v3.pdf\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>In the Atlas folder</h3><ul><li>contract-final.pdf — the final contract.</li><li>invoice-phase-1.pdf — the first-phase invoice.</li><li>presentation-v3.pdf — the current presentation.</li></ul><p>The second-phase invoice has not been issued. Older versions stay in chat history. Files are downloaded; nothing was sent to the customer.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Invoice for the first phase.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · team",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Atlas presentation v3, with updated designs.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · design",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "files"
    },
    {
      "title": "Customer support bot",
      "hint": "tg bot messages list → tg bot messages send",
      "steps": [
        {
          "ask": "Use tg cli, check Anna’s order questions received by the sales bot and draft replies."
        },
        {
          "tool": "tg bot list",
          "out": "{\n  \"items\": [\n    {\n      \"name\": \"sales\",\n      \"configured\": true\n    }\n  ]\n}"
        },
        {
          "tool": "tg sales bot messages list 501 --limit 10",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"text\": \"Delivery agreed for Friday. Address confirmed.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"sales\"\n    },\n    {\n      \"id\": \"48211\",\n      \"text\": \"When is delivery? Can you move it to tomorrow?\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Anna\"\n    }\n  ],\n  \"source\": \"local\"\n}"
        },
        {
          "say": "<h3>Draft for Anna</h3><p>Delivery is agreed for Friday and your address is confirmed. I’ll check with the team whether we can move it to tomorrow and get back to you.</p><h3>Your decision is needed</h3><p>The customer requests a date change. No promise: it was not confirmed in the messages received by the bot. Nothing sent yet.</p>",
          "sources": [
            {
              "id": "48210",
              "text": "Delivery agreed for Friday. Address confirmed.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "sales"
            },
            {
              "id": "48211",
              "text": "When is delivery? Can you move it to tomorrow?",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "Anna"
            }
          ]
        },
        {
          "ask": "Send that reply from sales. I’ll check the date change myself."
        },
        {
          "tool": "tg sales bot messages send 501 \"Delivery is agreed for Friday and your address is confirmed. I’ll check with the team whether we can move it to tomorrow and get back to you.\"",
          "out": "{\n  \"chatId\": \"501\",\n  \"messageId\": \"48212\",\n  \"status\": \"sent\"\n}"
        },
        {
          "say": "<h3>Anna received the reply</h3><p>The agreed date is confirmed; the date change stays with you. Context came only from messages previously received by this bot on this computer.</p>",
          "sources": [
            {
              "id": "48210",
              "text": "Delivery agreed for Friday. Address confirmed.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "sales"
            },
            {
              "id": "48211",
              "text": "When is delivery? Can you move it to tomorrow?",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "Anna"
            }
          ]
        }
      ],
      "id": "bot"
    }
  ],
  "es": [
    {
      "title": "Contexto para una llamada",
      "hint": "tg chats list → tg review",
      "steps": [
        {
          "ask": "Usa tg cli, reúne el contexto para la llamada de Atlas de mañana: decisiones, riesgos y preguntas."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · equipo\",\n      \"kind\": \"group\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · diseño\",\n      \"kind\": \"group\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg review --chat \"Atlas · equipo\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · equipo\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Lanzamos el viernes.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Anna necesita los textos finales para el jueves.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Tom necesita acceso al entorno de pruebas.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Lo que ya está decidido</h3><ul><li><b>Lanzamiento:</b> el viernes. El alcance de la primera versión está definido.</li><li><b>Textos:</b> Anna necesita la versión final para el jueves.</li></ul><h3>Qué bloquea el lanzamiento</h3><p><b>Tom:</b> necesita acceso al entorno de pruebas para comprobar los pagos.</p><h3>Para la llamada</h3><p>Acordar quién dará acceso y cuándo terminarán las pruebas. También he encontrado el grupo de diseño: puedo revisarlo junto con tus conversaciones privadas con los participantes.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Lanzamos el viernes.",
              "chat": "Atlas · equipo",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Anna necesita los textos finales para el jueves.",
              "chat": "Atlas · equipo",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Tom necesita acceso al entorno de pruebas.",
              "chat": "Atlas · equipo",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Revisa también el grupo de diseño y mi conversación privada con Tom. Puede que haya enviado los resultados por ahí."
        },
        {
          "tool": "tg review --chat \"Atlas · diseño\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · diseño\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"La maqueta está lista. Aún faltan los textos finales.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg chats list --search \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"503\",\n      \"title\": \"Tom\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages list 503 --limit 30",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Los pagos de prueba funcionan. Todavía necesito acceso a producción.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"Atlas\" --chat 503",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Los pagos de prueba funcionan. Todavía necesito acceso a producción.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Contexto de otros chats</h3><ul><li><b>Diseño:</b> la maqueta está lista; solo faltan los textos finales.</li><li><b>Tom, por privado:</b> los pagos de prueba funcionan. Lo que le falta es acceso al entorno de producción.</li></ul><h3>El riesgo pendiente</h3><p>Las pruebas de pago están parcialmente hechas: solo queda la comprobación en producción. Conviene centrar la llamada en eso, sin empezar de cero.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Los pagos de prueba funcionan. Todavía necesito acceso a producción.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Prepara una agenda de 20 minutos con riesgos, responsables y plazos. No envíes nada."
        },
        {
          "tool": "tg messages context 503 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Los pagos de prueba funcionan. Todavía necesito acceso a producción.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Necesito acceso a producción.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Agenda de 20 minutos</h3><ol><li><b>0–7 min:</b> acceso a producción: quién lo dará y cuándo podrá Tom terminar las pruebas.</li><li><b>7–12 min:</b> textos finales: quién se los entregará a Anna para el jueves.</li><li><b>12–17 min:</b> si no llegamos a tiempo, ¿reducimos el alcance o aplazamos el lanzamiento?</li><li><b>17–20 min:</b> dejar un responsable y un plazo para cada tarea.</li></ol><p><small>Borrador listo a partir del grupo del proyecto, el de diseño y tu conversación privada con Tom. No se ha enviado nada.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Los pagos de prueba funcionan. Todavía necesito acceso a producción.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Tom",
              "text": "Necesito acceso a producción.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "context"
    },
    {
      "id": "search",
      "title": "Buscar recomendaciones",
      "hint": "messages search --source all",
      "steps": [
        {
          "ask": "Usa tg cli, busca recomendaciones de cursos de SQL en Telegram y MAX. Quiero ejercicios y comentarios del profesor."
        },
        {
          "tool": "tg messages search \"SQL\" --source all --limit 10",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"601\",\n      \"chat\": \"Analistas · comunidad\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"Hice un taller de SQL: ejercicios semanales y comentarios del profesor.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Daria\"\n    },\n    {\n      \"id\": \"67210\",\n      \"chatId\": \"701\",\n      \"chat\": \"Equipo · formación\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"El curso de vídeos de SQL me ayudó con lo básico, pero nadie revisaba los ejercicios.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Álex\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Dos recomendaciones de distintos mensajeros</h3><ul><li><b>Taller:</b> ejercicios revisados, más cerca de lo que buscas.</li><li><b>Curso de vídeos:</b> aprendizaje autónomo; no se confirma revisión.</li></ul><p>Encontré mensajes en una comunidad de Telegram y un chat de trabajo de MAX. Revisaré el contexto.</p>",
          "sources": [
            {
              "id": "48210",
              "chatId": "601",
              "chat": "Analistas · comunidad",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "text": "Hice un taller de SQL: ejercicios semanales y comentarios del profesor.",
              "senderName": "Daria"
            },
            {
              "id": "67210",
              "chatId": "701",
              "chat": "Equipo · formación",
              "messenger": "max",
              "date": "2026-10-02T12:00:00Z",
              "text": "El curso de vídeos de SQL me ayudó con lo básico, pero nadie revisaba los ejercicios.",
              "senderName": "Álex"
            }
          ]
        },
        {
          "ask": "Lee los mensajes alrededor de esas recomendaciones. Quiero que expliquen los errores, no solo vídeos."
        },
        {
          "tool": "tg messages context msg:telegram/900001/601/48210 --before-n 1 --after-n 1",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"601\",\n      \"chat\": \"Analistas · comunidad\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"Hice un taller de SQL: ejercicios semanales y comentarios del profesor.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Daria\"\n    },\n    {\n      \"id\": \"48211\",\n      \"chatId\": \"601\",\n      \"chat\": \"Analistas · comunidad\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"En el taller explican los errores. No esperes temas avanzados.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Daria\"\n    }\n  ]\n}",
          "fixedMessenger": true
        },
        {
          "tool": "max messages context msg:max/900001/701/67210 --before-n 1 --after-n 1",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"67210\",\n      \"chatId\": \"701\",\n      \"chat\": \"Equipo · formación\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"El curso de vídeos de SQL me ayudó con lo básico, pero nadie revisaba los ejercicios.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Álex\"\n    },\n    {\n      \"id\": \"67211\",\n      \"chatId\": \"701\",\n      \"chat\": \"Equipo · formación\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"Puedes verlo a tu ritmo; tuve que buscar ejercicios prácticos por separado.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Álex\"\n    }\n  ]\n}",
          "fixedMessenger": true
        },
        {
          "say": "<h3>Qué comprobar primero</h3><p>Empieza por el taller: un participante confirma la revisión de errores. Deja el curso de vídeos como alternativa para estudiar a tu ritmo.</p><p>Las opiniones no confirman el temario, precio ni plazas actuales. Pregunta a los organizadores por la revisión de ejercicios y el nivel.</p>",
          "sources": [
            {
              "id": "48211",
              "chatId": "601",
              "chat": "Analistas · comunidad",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "text": "En el taller explican los errores. No esperes temas avanzados.",
              "senderName": "Daria"
            },
            {
              "id": "67211",
              "chatId": "701",
              "chat": "Equipo · formación",
              "messenger": "max",
              "date": "2026-10-02T12:00:00Z",
              "text": "Puedes verlo a tu ritmo; tuve que buscar ejercicios prácticos por separado.",
              "senderName": "Álex"
            }
          ]
        }
      ]
    },
    {
      "id": "moderation",
      "title": "Gestionar un grupo",
      "hint": "chats moderate --dry-run",
      "steps": [
        {
          "ask": "Usa tg cli, soy administrador del grupo Comunidad. Muéstrame las infracciones y un plan. No borres nada todavía."
        },
        {
          "tool": "tg chats list --search \"Comunidad\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"301\",\n      \"title\": \"Comunidad\",\n      \"kind\": \"group\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg chats rules show 301",
          "out": "{\n  \"items\": [],\n  \"rules\": {\n    \"links\": \"delete\",\n    \"consent.delete\": \"ask\"\n  }\n}"
        },
        {
          "tool": "tg messages list 301 --limit 20",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"301\",\n      \"chat\": \"Comunidad\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"Ayudamos a pequeños equipos a lanzar su web y preparar campañas. Trabajos y condiciones: https://example.com/services\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Álex\"\n    },\n    {\n      \"id\": \"48211\",\n      \"chatId\": \"301\",\n      \"chat\": \"Comunidad\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"Esta semana podemos aceptar dos proyectos más. Si tu negocio necesita nuevos clientes, consulta nuestros paquetes: https://example.com/pricing\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Álex\"\n    },\n    {\n      \"id\": \"48212\",\n      \"chatId\": \"301\",\n      \"chat\": \"Comunidad\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"¿Habrá grabación de la reunión?\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Daria\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg chats moderate 301 --dry-run --max-actions 2",
          "out": "{\n  \"items\": [\n    {\n      \"messageId\": \"48210\",\n      \"action\": \"delete\",\n      \"outcome\": \"planned\"\n    },\n    {\n      \"messageId\": \"48211\",\n      \"action\": \"delete\",\n      \"outcome\": \"planned\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>Plan para revisar</h3><p>Dos mensajes promocionales incumplen la regla guardada sobre enlaces. Se propone borrar solo esos mensajes.</p><p>La pregunta sobre la grabación cumple las reglas. No se eliminarán miembros. Es una vista previa; no se ha actuado.</p>",
          "sources": [
            {
              "id": "48210",
              "chatId": "301",
              "chat": "Comunidad",
              "date": "2026-10-02T14:00:00Z",
              "text": "Ayudamos a pequeños equipos a lanzar su web y preparar campañas. Trabajos y condiciones: https://example.com/services",
              "senderName": "Álex"
            },
            {
              "id": "48211",
              "chatId": "301",
              "chat": "Comunidad",
              "date": "2026-10-02T14:00:00Z",
              "text": "Esta semana podemos aceptar dos proyectos más. Si tu negocio necesita nuevos clientes, consulta nuestros paquetes: https://example.com/pricing",
              "senderName": "Álex"
            }
          ]
        },
        {
          "ask": "Borra solo esos dos mensajes promocionales para todos. Conserva la pregunta y a todos los miembros."
        },
        {
          "tool": "tg messages delete 301 48210 48211 --for-everyone --allow-dangerous",
          "out": "{\n  \"items\": [],\n  \"deleted\": [\n    \"48210\",\n    \"48211\"\n  ]\n}"
        },
        {
          "say": "<h3>Dos mensajes borrados</h3><p>Solo se borraron los mensajes seleccionados. La pregunta y todos los miembros siguen. No se ejecutaron otras acciones del plan.</p>",
          "sources": [
            {
              "id": "48211",
              "chatId": "301",
              "chat": "Comunidad",
              "date": "2026-10-02T14:00:00Z",
              "text": "Esta semana podemos aceptar dos proyectos más. Si tu negocio necesita nuevos clientes, consulta nuestros paquetes: https://example.com/pricing",
              "messenger": "tg",
              "senderName": "Álex"
            },
            {
              "id": "48212",
              "chatId": "301",
              "chat": "Comunidad",
              "date": "2026-10-02T14:00:00Z",
              "text": "¿Habrá grabación de la reunión?",
              "messenger": "tg",
              "senderName": "Daria"
            }
          ]
        }
      ]
    },
    {
      "title": "Resumen de la mañana",
      "hint": "tg inbox → tg review",
      "steps": [
        {
          "ask": "Usa tg cli, muestra quién espera mi respuesta y qué noticias de mis suscripciones vale la pena leer."
        },
        {
          "tool": "tg inbox",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Marco\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Aprueba el presupuesto antes de las 11:00 o el proveedor no puede empezar.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    },\n    {\n      \"title\": \"Anna\",\n      \"messages\": [\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Anna\",\n          \"text\": \"La reunión pasa a las 19:30. Confirma, por favor.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    },\n    {\n      \"title\": \"Mamá\",\n      \"messages\": [\n        {\n          \"id\": \"8812\",\n          \"senderName\": \"Mamá\",\n          \"text\": \"Audio, 0:42\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --chat \"Noticias de tecnología\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Noticias de tecnología\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"La herramienta de desarrollo se ha actualizado.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Han publicado una guía sobre un nuevo enfoque de búsqueda.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Para hoy</h3><ul><li><b>Antes de las 11:00 — Marco:</b> aprobar el presupuesto para que el equipo pueda continuar.</li><li><b>Esta tarde — Anna:</b> la reunión pasa a las 19:30; espera tu confirmación.</li><li><b>Sin plazo — mamá:</b> un audio de 42 segundos.</li></ul><h3>Noticias de tus canales</h3><ul><li><b>Herramientas de desarrollo:</b> una actualización del flujo de trabajo.</li><li><b>Búsqueda:</b> una guía práctica con ejemplos.</li></ul><p><small>Puedo mostrar los detalles y los mensajes originales de cada punto, o limitar las noticias a temas de trabajo.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Marco",
              "text": "Aprueba el presupuesto antes de las 11:00 o el proveedor no puede empezar.",
              "chat": "Marco",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48211",
              "senderName": "Anna",
              "text": "La reunión pasa a las 19:30. Confirma, por favor.",
              "chat": "Anna",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "8812",
              "senderName": "Mamá",
              "text": "Audio, 0:42",
              "chat": "Mamá",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "La herramienta de desarrollo se ha actualizado.",
              "chat": "Noticias de tecnología",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            }
          ]
        },
        {
          "ask": "Transcribe el audio de mamá y dime qué hay que hacer hoy."
        },
        {
          "tool": "tg messages transcribe \"Mamá\" 8812",
          "out": "{\n  \"messageId\": \"8812\",\n  \"text\": \"Tengo cita médica mañana. Confirma hoy si puedes llevarme.\",\n  \"timestamp\": \"2026-10-02T09:00:00Z\",\n  \"senderName\": \"Mamá\"\n}"
        },
        {
          "say": "<h3>Mamá necesita respuesta hoy</h3><p>Su cita es mañana; confirma si puedes llevarla. El audio está transcrito. No se ha enviado respuesta.</p>",
          "sources": [
            {
              "id": "8812",
              "text": "Tengo cita médica mañana. Confirma hoy si puedes llevarme.",
              "chat": "Mamá",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "senderName": "Mamá"
            }
          ]
        },
        {
          "ask": "¿Por dónde empiezo en los próximos 15 minutos?"
        },
        {
          "tool": "tg messages context \"Marco\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Marco\",\n      \"text\": \"Hay que aprobar el presupuesto antes de las 11:00 para que el proveedor pueda empezar.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Tus primeros 15 minutos</h3><ol><li><b>Primero, el presupuesto:</b> abre la petición de Marco y decide; el proveedor está esperando tu aprobación.</li><li><b>Después, la reunión:</b> confirma las 19:30 con Anna.</li><li><b>Luego:</b> confirma si puedes llevar a mamá mañana.</li></ol><p><small>Las noticias quedan en una lista aparte para más tarde. Ninguna requiere actuar ahora.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Marco",
              "text": "Hay que aprobar el presupuesto antes de las 11:00 para que el proveedor pueda empezar.",
              "chat": "Marco",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48211",
              "senderName": "Anna",
              "text": "La reunión pasa a las 19:30. Confirma, por favor.",
              "chat": "Anna",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "8812",
              "text": "Tengo cita médica mañana. Confirma hoy si puedes llevarme.",
              "chat": "Mamá",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "senderName": "Mamá"
            }
          ]
        }
      ],
      "id": "inbox"
    },
    {
      "title": "Compromisos y respuestas",
      "hint": "tg review --unanswered",
      "steps": [
        {
          "ask": "Usa tg cli, busca quién necesita mi respuesta, qué prometí y qué estoy esperando de otros."
        },
        {
          "tool": "tg review --since-time 7d --all --unanswered",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Marco: confirma el presupuesto, por favor.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Cliente: ¿cuándo llega el pedido?\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --since-time 7d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Tú: enviaré la factura a Anna para el viernes.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Tom: enviaré la maqueta el miércoles.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Cliente: el viernes me va bien.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Tus pendientes</h3><ul><li><b>Anna:</b> la factura para el viernes, que es hoy.</li><li><b>Marco:</b> una decisión sobre el presupuesto.</li><li><b>Cliente:</b> confirmar la entrega.</li></ul><h3>Lo que esperas de otros</h3><p><b>Tom:</b> prometió la maqueta para el miércoles. Revisaré los demás chats antes de preparar un recordatorio.</p><h3>Se puede resolver ya</h3><p>La fecha de entrega ya está acordada. El presupuesto necesita tu decisión; no daré por hecho que está aprobado.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Tú: enviaré la factura a Anna para el viernes.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Tom: enviaré la maqueta el miércoles.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Cliente: el viernes me va bien.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Busca el chat de Tom y comprueba si ya envió el diseño. Prepara respuestas para el cliente, Anna y Tom."
        },
        {
          "tool": "tg chats list --search \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"503\",\n      \"title\": \"Tom\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages list 503 --limit 30",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Aquí está la primera versión de la maqueta. La cerraré después de vuestros comentarios.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"maqueta\" --chat 503",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Aquí está la primera versión de la maqueta. La cerraré después de vuestros comentarios.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Al cliente</h3><blockquote><p>La entrega sigue prevista para el viernes, como acordamos. Si necesitas una franja horaria concreta, dímelo, por favor.</p></blockquote><h3>A Anna</h3><blockquote><p>¡Hola, Anna! Te enviaré la factura hoy, como acordamos.</p></blockquote><h3>A Tom</h3><blockquote><p>¡Gracias por la primera versión, Tom! ¿Cuándo podrás enviar la versión final con nuestros comentarios incorporados?</p></blockquote><p><small>Tom ya envió una primera versión por privado, así que sería incorrecto decirle que no ha enviado nada. Las tres respuestas son borradores.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Aquí está la primera versión de la maqueta. La cerraré después de vuestros comentarios.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Envía a Tom ese borrador sobre el diseño final. No envíes las otras respuestas todavía."
        },
        {
          "tool": "tg messages send 503 \"¡Gracias por la primera versión, Tom! ¿Cuándo podrás enviar la versión final con nuestros comentarios incorporados?\"",
          "out": "{\n  \"chatId\": \"503\",\n  \"messageId\": \"48221\",\n  \"status\": \"sent\"\n}"
        },
        {
          "say": "<h3>Enviado a Tom</h3><p>Pregunté por el diseño final en el chat privado encontrado. Las respuestas al cliente y a Anna siguen como borradores. La decisión del presupuesto queda en tus manos.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Tom: enviaré la maqueta el miércoles.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Cliente: el viernes me va bien.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Tom",
              "text": "Aquí está la primera versión de la maqueta. La cerraré después de vuestros comentarios.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Tom",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "commitments"
    },
    {
      "title": "Recordatorios y mensajes programados",
      "hint": "tg messages send --at-time",
      "steps": [
        {
          "ask": "Usa tg cli, recuérdame en dos horas revisar la factura y en seis horas resolver los asuntos pendientes."
        },
        {
          "tool": "tg messages send me \"Revisar la factura\" --at-time 2h",
          "out": "{\n  \"chatId\": \"me\",\n  \"status\": \"scheduled\",\n  \"sendId\": \"schedule-1\"\n}"
        },
        {
          "tool": "tg messages send me \"Resolver asuntos pendientes\" --at-time 6h",
          "out": "{\n  \"chatId\": \"me\",\n  \"status\": \"scheduled\",\n  \"sendId\": \"schedule-2\"\n}"
        },
        {
          "say": "<h3>Dos recordatorios en Mensajes guardados</h3><p>En dos horas: revisar la factura. En seis: volver a los asuntos pendientes. Telegram los enviará aunque el portátil esté apagado.</p>",
          "sources": []
        },
        {
          "ask": "En una hora, pide a Anna los textos finales y a Tom el estado del pago. Escribe a cada uno en privado."
        },
        {
          "tool": "tg messages send \"Anna\" \"¡Hola, Anna! Envía los textos finales, por favor.\" --at-time 1h",
          "out": "{\n  \"status\": \"scheduled\"\n}"
        },
        {
          "tool": "tg messages send \"Tom\" \"¡Hola, Tom! Envía el estado de las pruebas del pago, por favor.\" --at-time 1h",
          "out": "{\n  \"status\": \"scheduled\"\n}"
        },
        {
          "say": "<h3>Mensajes privados programados</h3><p>En una hora, Anna recibirá la petición de textos y Tom la del estado del pago. Están listos dos mensajes privados y tus dos recordatorios.</p>",
          "sources": []
        }
      ],
      "id": "schedule"
    },
    {
      "title": "Todos los documentos de un tema",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Usa tg cli, encuentra el contrato, las facturas y la presentación actuales de Atlas. Revisa grupos y mensajes privados."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · equipo\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · diseño\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"contrato OR factura OR presentación\" --chat \"Atlas · equipo\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Presentación de Atlas v2.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"Factura de la primera fase.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48212\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Contrato: versión preliminar.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>En el grupo del proyecto</h3><ul><li><b>Presentación:</b> versión v2.</li><li><b>Factura:</b> de la primera fase.</li><li><b>Contrato:</b> una versión preliminar.</li></ul><h3>Antes de reunir el conjunto</h3><p>Hay que revisar tu conversación privada con Anna y el grupo de diseño por si hay archivos más recientes.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Presentación de Atlas v2.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · equipo",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Factura de la primera fase.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · equipo",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Tom",
              "text": "Contrato: versión preliminar.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · equipo",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Revisa mi conversación con Anna y el grupo de diseño. Quédate con las últimas versiones, pero conserva también las anteriores."
        },
        {
          "tool": "tg chats list --search \"Anna\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"501\",\n      \"title\": \"Anna\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"contrato\" --chat 501",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Contrato final de Atlas. Condiciones de pago actualizadas.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"presentación\" --chat \"Atlas · diseño\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Presentación de Atlas v3, con las maquetas actualizadas.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Últimas versiones</h3><table><thead><tr><th>Documento</th><th>Versión</th><th>Dónde está</th></tr></thead><tbody><tr><td>Contrato</td><td>Final</td><td>Conversación con Anna</td></tr><tr><td>Factura</td><td>Primera fase</td><td>Atlas · equipo</td></tr><tr><td>Presentación</td><td>v3</td><td>Atlas · diseño</td></tr></tbody></table><h3>Historial de versiones</h3><p>El contrato preliminar y la presentación v2 están en una lista aparte. No se elimina nada.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Factura de la primera fase.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · equipo",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Contrato final de Atlas. Condiciones de pago actualizadas.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Anna",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Presentación de Atlas v3, con las maquetas actualizadas.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · diseño",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Revisa las facturas restantes y descarga los archivos actuales en una carpeta Atlas. No envíes nada."
        },
        {
          "tool": "tg messages search \"factura\" --chat 501",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48213\",\n      \"senderName\": \"Anna\",\n      \"text\": \"La factura de la segunda fase aún no se ha emitido.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages download 501 48210 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/contract-final.pdf\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg messages download 101 48211 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/invoice-phase-1.pdf\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg messages download 102 48210 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/presentation-v3.pdf\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>En la carpeta Atlas</h3><ul><li>contract-final.pdf — contrato final.</li><li>invoice-phase-1.pdf — factura de la primera fase.</li><li>presentation-v3.pdf — presentación actual.</li></ul><p>La segunda factura aún no está emitida. Las versiones anteriores siguen en el historial. Los archivos están descargados; no se envió nada al cliente.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Marco",
              "text": "Factura de la primera fase.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · equipo",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Contrato final de Atlas. Condiciones de pago actualizadas.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Anna",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Anna",
              "text": "Presentación de Atlas v3, con las maquetas actualizadas.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · diseño",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "files"
    },
    {
      "title": "Bot de atención al cliente",
      "hint": "tg bot messages list → tg bot messages send",
      "steps": [
        {
          "ask": "Usa tg cli, revisa las preguntas de Anna sobre su pedido recibidas por el bot sales y prepara respuestas."
        },
        {
          "tool": "tg bot list",
          "out": "{\n  \"items\": [\n    {\n      \"name\": \"sales\",\n      \"configured\": true\n    }\n  ]\n}"
        },
        {
          "tool": "tg sales bot messages list 501 --limit 10",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"text\": \"Entrega acordada para el viernes. Dirección confirmada.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"sales\"\n    },\n    {\n      \"id\": \"48211\",\n      \"text\": \"¿Cuándo llega el pedido? ¿Se puede cambiar a mañana?\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Anna\"\n    }\n  ],\n  \"source\": \"local\"\n}"
        },
        {
          "say": "<h3>Borrador para Anna</h3><p>La entrega está acordada para el viernes y la dirección confirmada. Consultaré con el equipo si podemos cambiarla a mañana y volveré con una respuesta.</p><h3>Hace falta tu decisión</h3><p>La cliente solicita cambiar la fecha. No prometo el cambio: los mensajes recibidos por el bot no lo confirman. Aún no se envió nada.</p>",
          "sources": [
            {
              "id": "48210",
              "text": "Entrega acordada para el viernes. Dirección confirmada.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "sales"
            },
            {
              "id": "48211",
              "text": "¿Cuándo llega el pedido? ¿Se puede cambiar a mañana?",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "Anna"
            }
          ]
        },
        {
          "ask": "Envía esa respuesta desde sales. Yo consultaré el cambio de fecha."
        },
        {
          "tool": "tg sales bot messages send 501 \"La entrega está acordada para el viernes y la dirección confirmada. Consultaré con el equipo si podemos cambiarla a mañana y volveré con una respuesta.\"",
          "out": "{\n  \"chatId\": \"501\",\n  \"messageId\": \"48212\",\n  \"status\": \"sent\"\n}"
        },
        {
          "say": "<h3>Anna recibió la respuesta</h3><p>La fecha acordada está confirmada; el cambio queda en tus manos. El contexto procede solo de mensajes recibidos antes por el bot en este equipo.</p>",
          "sources": [
            {
              "id": "48210",
              "text": "Entrega acordada para el viernes. Dirección confirmada.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "sales"
            },
            {
              "id": "48211",
              "text": "¿Cuándo llega el pedido? ¿Se puede cambiar a mañana?",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Anna",
              "messenger": "tg",
              "senderName": "Anna"
            }
          ]
        }
      ],
      "id": "bot"
    }
  ],
  "ru": [
    {
      "title": "Контекст к созвону",
      "hint": "tg chats list → tg review",
      "steps": [
        {
          "ask": "Используй tg cli, собери контекст к завтрашнему созвону по Atlas: решения, риски и вопросы."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · команда\",\n      \"kind\": \"group\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · дизайн\",\n      \"kind\": \"group\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg review --chat \"Atlas · команда\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Запускаем в пятницу.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Анна ждёт финальные тексты до четверга.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Том\",\n          \"text\": \"Тому нужен доступ к стенду.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Уже решили</h3><ul><li><b>Запуск:</b> пятница, объём первой версии зафиксирован.</li><li><b>Тексты:</b> Анне нужна финальная версия до четверга.</li></ul><h3>Блокирует запуск</h3><p><b>Том:</b> ждёт доступ к стенду для проверки оплаты.</p><h3>К созвону</h3><p>Назначить ответственного за доступ и срок проверки. Нашёл также группу дизайна — могу проверить её и личные договорённости участников.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Запускаем в пятницу.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Марко",
              "text": "Анна ждёт финальные тексты до четверга.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Том",
              "text": "Тому нужен доступ к стенду.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Посмотри ещё дизайн и мою личку с Томом. Он мог прислать результат туда."
        },
        {
          "tool": "tg review --chat \"Atlas · дизайн\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Макет готов. Финальные тексты ещё ждём.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg chats list --search \"Том\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"503\",\n      \"title\": \"Том\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages list 503 --limit 30",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Том\",\n      \"text\": \"Проверил тестовую оплату. Для боевого стенда всё ещё нужен доступ.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"Atlas\" --chat 503",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Том\",\n      \"text\": \"Проверил тестовую оплату. Для боевого стенда всё ещё нужен доступ.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Контекст из других чатов</h3><ul><li><b>Дизайн:</b> макет готов; тексты остаются последней зависимостью.</li><li><b>Том, личная переписка:</b> тестовую оплату проверил. Доступ нужен именно к боевому стенду.</li></ul><h3>Уточнённый риск</h3><p>Не вся проверка оплаты заблокирована — осталась проверка в боевой среде. На созвоне стоит обсуждать её, а не начинать с нуля.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Том",
              "text": "Проверил тестовую оплату. Для боевого стенда всё ещё нужен доступ.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Том",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Сделай повестку на 20 минут: риски, ответственные и сроки. Ничего не отправляй."
        },
        {
          "tool": "tg messages context 503 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Том\",\n      \"text\": \"Проверил тестовую оплату. Для боевого стенда всё ещё нужен доступ.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Том\",\n      \"text\": \"Нужен доступ к боевому стенду.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Повестка на 20 минут</h3><ol><li><b>0–7:</b> боевой стенд — кто выдаёт доступ и когда Том завершит проверку.</li><li><b>7–12:</b> финальные тексты — кто передаёт Анне до четверга.</li><li><b>12–17:</b> если не успеваем — сокращаем объём или переносим запуск?</li><li><b>17–20:</b> зафиксировать владельца и срок каждого решения.</li></ol><p><small>Черновик готов. Учтены проектная группа, дизайн и личная переписка с Томом. Ничего не отправлено.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Том",
              "text": "Проверил тестовую оплату. Для боевого стенда всё ещё нужен доступ.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Том",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Том",
              "text": "Нужен доступ к боевому стенду.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Том",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "context"
    },
    {
      "id": "search",
      "title": "Найти рекомендации",
      "hint": "messages search --source all",
      "steps": [
        {
          "ask": "Используй tg cli, найди в Telegram и MAX рекомендации курса SQL с практикой и обратной связью."
        },
        {
          "tool": "tg messages search \"SQL\" --source all --limit 10",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"601\",\n      \"chat\": \"Аналитики · сообщество\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"Проходил практикум SQL: каждую неделю задания и комментарии преподавателя.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Дарья\"\n    },\n    {\n      \"id\": \"67210\",\n      \"chatId\": \"701\",\n      \"chat\": \"Команда · обучение\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"Видеокурс SQL помог с базой, но работы никто не проверял.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Алексей\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Две рекомендации из разных мессенджеров</h3><ul><li><b>Практикум:</b> задания с проверкой — ближе к вашим условиям.</li><li><b>Видеокурс:</b> подходит для самостоятельного изучения, обратная связь не подтверждена.</li></ul><p>Нашёл сообщения в сообществе Telegram и рабочем чате MAX. Сверю контекст отзывов.</p>",
          "sources": [
            {
              "id": "48210",
              "chatId": "601",
              "chat": "Аналитики · сообщество",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "text": "Проходил практикум SQL: каждую неделю задания и комментарии преподавателя.",
              "senderName": "Дарья"
            },
            {
              "id": "67210",
              "chatId": "701",
              "chat": "Команда · обучение",
              "messenger": "max",
              "date": "2026-10-02T12:00:00Z",
              "text": "Видеокурс SQL помог с базой, но работы никто не проверял.",
              "senderName": "Алексей"
            }
          ]
        },
        {
          "ask": "Проверь отзывы вокруг этих сообщений. Мне важно, чтобы разбирали ошибки, а не просто давали видео."
        },
        {
          "tool": "tg messages context msg:telegram/900001/601/48210 --before-n 1 --after-n 1",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"601\",\n      \"chat\": \"Аналитики · сообщество\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"Проходил практикум SQL: каждую неделю задания и комментарии преподавателя.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Дарья\"\n    },\n    {\n      \"id\": \"48211\",\n      \"chatId\": \"601\",\n      \"chat\": \"Аналитики · сообщество\",\n      \"messenger\": \"tg\",\n      \"date\": \"2026-10-02T09:00:00Z\",\n      \"text\": \"В практикуме есть разбор ошибок. На продвинутые темы не рассчитывайте.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Дарья\"\n    }\n  ]\n}",
          "fixedMessenger": true
        },
        {
          "tool": "max messages context msg:max/900001/701/67210 --before-n 1 --after-n 1",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"67210\",\n      \"chatId\": \"701\",\n      \"chat\": \"Команда · обучение\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"Видеокурс SQL помог с базой, но работы никто не проверял.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Алексей\"\n    },\n    {\n      \"id\": \"67211\",\n      \"chatId\": \"701\",\n      \"chat\": \"Команда · обучение\",\n      \"messenger\": \"max\",\n      \"date\": \"2026-10-02T12:00:00Z\",\n      \"text\": \"Видеокурс удобно смотреть самостоятельно; для практики пришлось искать задачи отдельно.\",\n      \"timestamp\": \"2026-10-02T12:00:00Z\",\n      \"senderName\": \"Алексей\"\n    }\n  ]\n}",
          "fixedMessenger": true
        },
        {
          "say": "<h3>Что выбрать для проверки</h3><p>Начните с практикума: участник подтверждает разбор ошибок. Видеокурс оставьте запасным вариантом для самостоятельного обучения.</p><p>Отзывы не подтверждают текущую программу, цену или набор. У организаторов стоит спросить про проверку заданий и уровень курса.</p>",
          "sources": [
            {
              "id": "48211",
              "chatId": "601",
              "chat": "Аналитики · сообщество",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "text": "В практикуме есть разбор ошибок. На продвинутые темы не рассчитывайте.",
              "senderName": "Дарья"
            },
            {
              "id": "67211",
              "chatId": "701",
              "chat": "Команда · обучение",
              "messenger": "max",
              "date": "2026-10-02T12:00:00Z",
              "text": "Видеокурс удобно смотреть самостоятельно; для практики пришлось искать задачи отдельно.",
              "senderName": "Алексей"
            }
          ]
        }
      ]
    },
    {
      "id": "moderation",
      "title": "Управление группой",
      "hint": "chats moderate --dry-run",
      "steps": [
        {
          "ask": "Используй tg cli, я администратор группы «Сообщество». Покажи нарушения её правил и план действий. Пока ничего не удаляй."
        },
        {
          "tool": "tg chats list --search \"Сообщество\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"301\",\n      \"title\": \"Сообщество\",\n      \"kind\": \"group\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg chats rules show 301",
          "out": "{\n  \"items\": [],\n  \"rules\": {\n    \"links\": \"delete\",\n    \"consent.delete\": \"ask\"\n  }\n}"
        },
        {
          "tool": "tg messages list 301 --limit 20",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"chatId\": \"301\",\n      \"chat\": \"Сообщество\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"Помогаем небольшим командам запустить сайт и настроить рекламу. Портфолио и условия: https://example.com/services\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Алексей\"\n    },\n    {\n      \"id\": \"48211\",\n      \"chatId\": \"301\",\n      \"chat\": \"Сообщество\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"На этой неделе можем взять ещё два проекта. Если вашему бизнесу нужны заявки, посмотрите наши пакеты: https://example.com/pricing\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Алексей\"\n    },\n    {\n      \"id\": \"48212\",\n      \"chatId\": \"301\",\n      \"chat\": \"Сообщество\",\n      \"date\": \"2026-10-02T14:00:00Z\",\n      \"text\": \"Будет ли запись встречи?\",\n      \"timestamp\": \"2026-10-02T14:00:00Z\",\n      \"senderName\": \"Дарья\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg chats moderate 301 --dry-run --max-actions 2",
          "out": "{\n  \"items\": [\n    {\n      \"messageId\": \"48210\",\n      \"action\": \"delete\",\n      \"outcome\": \"planned\"\n    },\n    {\n      \"messageId\": \"48211\",\n      \"action\": \"delete\",\n      \"outcome\": \"planned\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>План на проверку</h3><p>Два рекламных сообщения нарушают сохранённое правило о ссылках. Предлагается удалить только их.</p><p>Вопрос про запись встречи не нарушает правила. Участников не удаляем. Это предварительный просмотр — действий ещё не было.</p>",
          "sources": [
            {
              "id": "48210",
              "chatId": "301",
              "chat": "Сообщество",
              "date": "2026-10-02T14:00:00Z",
              "text": "Помогаем небольшим командам запустить сайт и настроить рекламу. Портфолио и условия: https://example.com/services",
              "senderName": "Алексей"
            },
            {
              "id": "48211",
              "chatId": "301",
              "chat": "Сообщество",
              "date": "2026-10-02T14:00:00Z",
              "text": "На этой неделе можем взять ещё два проекта. Если вашему бизнесу нужны заявки, посмотрите наши пакеты: https://example.com/pricing",
              "senderName": "Алексей"
            }
          ]
        },
        {
          "ask": "Удали только эти два рекламных сообщения для всех. Вопрос про запись и участников не трогай."
        },
        {
          "tool": "tg messages delete 301 48210 48211 --for-everyone --allow-dangerous",
          "out": "{\n  \"items\": [],\n  \"deleted\": [\n    \"48210\",\n    \"48211\"\n  ]\n}"
        },
        {
          "say": "<h3>Два сообщения удалены</h3><p>Удалены только выбранные сообщения. Вопрос про запись и все участники остались. Другие действия из плана не запускались.</p>",
          "sources": [
            {
              "id": "48211",
              "chatId": "301",
              "chat": "Сообщество",
              "date": "2026-10-02T14:00:00Z",
              "text": "На этой неделе можем взять ещё два проекта. Если вашему бизнесу нужны заявки, посмотрите наши пакеты: https://example.com/pricing",
              "messenger": "tg",
              "senderName": "Алексей"
            },
            {
              "id": "48212",
              "chatId": "301",
              "chat": "Сообщество",
              "date": "2026-10-02T14:00:00Z",
              "text": "Будет ли запись встречи?",
              "messenger": "tg",
              "senderName": "Дарья"
            }
          ]
        }
      ]
    },
    {
      "title": "Утренняя сводка",
      "hint": "tg inbox → tg review",
      "steps": [
        {
          "ask": "Используй tg cli, покажи, где ждут моего ответа и какие новости из подписок стоит прочитать."
        },
        {
          "tool": "tg inbox",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Марко\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Согласуй бюджет до 11:00, иначе подрядчик не начнёт.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    },\n    {\n      \"title\": \"Анна\",\n      \"messages\": [\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Встречу перенесли на 19:30. Подтверди, пожалуйста.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    },\n    {\n      \"title\": \"Мама\",\n      \"messages\": [\n        {\n          \"id\": \"8812\",\n          \"senderName\": \"Мама\",\n          \"text\": \"Голосовое, 0:42\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --chat \"Новости технологий\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Новости технологий\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Обновился инструмент для кода.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Опубликован разбор нового подхода к поиску.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Сегодня нужно вам</h3><ul><li><b>До 11:00 — Марко:</b> подтвердить бюджет, чтобы команда продолжила работу.</li><li><b>Вечером — Анна:</b> встречу перенесли на 19:30, ждёт подтверждения.</li><li><b>Без срока — мама:</b> голосовое, 0:42.</li></ul><h3>Новости из подписок</h3><ul><li><b>Инструменты для кода:</b> обновление рабочего процесса.</li><li><b>Поиск:</b> практический разбор с примерами.</li></ul><p><small>Подробности и исходные сообщения доступны по каждому пункту. Могу сузить новости до рабочих тем.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Марко",
              "text": "Согласуй бюджет до 11:00, иначе подрядчик не начнёт.",
              "chat": "Марко",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48211",
              "senderName": "Анна",
              "text": "Встречу перенесли на 19:30. Подтверди, пожалуйста.",
              "chat": "Анна",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "8812",
              "senderName": "Мама",
              "text": "Голосовое, 0:42",
              "chat": "Мама",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Обновился инструмент для кода.",
              "chat": "Новости технологий",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            }
          ]
        },
        {
          "ask": "Расшифруй голосовое мамы и скажи, что нужно сделать сегодня."
        },
        {
          "tool": "tg messages transcribe \"Мама\" 8812",
          "out": "{\n  \"messageId\": \"8812\",\n  \"text\": \"Завтра запись к врачу. Подтверди, пожалуйста, сегодня, что сможешь меня отвезти.\",\n  \"timestamp\": \"2026-10-02T09:00:00Z\",\n  \"senderName\": \"Мама\"\n}"
        },
        {
          "say": "<h3>Мама ждёт ответа сегодня</h3><p>Завтра приём у врача; нужно подтвердить, сможете ли вы её отвезти. Голосовое расшифровано, ответ пока не отправлен.</p>",
          "sources": [
            {
              "id": "8812",
              "text": "Завтра запись к врачу. Подтверди, пожалуйста, сегодня, что сможешь меня отвезти.",
              "chat": "Мама",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "senderName": "Мама"
            }
          ]
        },
        {
          "ask": "Что первым сделать за ближайшие 15 минут?"
        },
        {
          "tool": "tg messages context \"Марко\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Нужно согласовать бюджет до 11:00, иначе подрядчик не начнёт.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Первые 15 минут</h3><ol><li><b>Сначала бюджет:</b> открыть запрос Марко и принять решение — он блокирует подрядчика.</li><li><b>Затем встреча:</b> подтвердить Анне 19:30.</li><li><b>После этого:</b> подтвердить маме, сможете ли вы отвезти её завтра.</li></ol><p><small>Новости оставил отдельным списком на потом: срочных действий по ним нет.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Нужно согласовать бюджет до 11:00, иначе подрядчик не начнёт.",
              "chat": "Марко",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "48211",
              "senderName": "Анна",
              "text": "Встречу перенесли на 19:30. Подтверди, пожалуйста.",
              "chat": "Анна",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z"
            },
            {
              "id": "8812",
              "text": "Завтра запись к врачу. Подтверди, пожалуйста, сегодня, что сможешь меня отвезти.",
              "chat": "Мама",
              "messenger": "tg",
              "date": "2026-10-02T09:00:00Z",
              "senderName": "Мама"
            }
          ]
        }
      ],
      "id": "inbox"
    },
    {
      "title": "Договорённости и ответы",
      "hint": "tg review --unanswered",
      "steps": [
        {
          "ask": "Используй tg cli, найди, кому я должен ответить, что обещал и от кого жду результата."
        },
        {
          "tool": "tg review --since-time 7d --all --unanswered",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Марко: подтвердите бюджет.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Клиент: когда доставка?\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --since-time 7d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Вы: пришлю счёт Анне до пятницы.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Том: макет отдам в среду.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Том\",\n          \"text\": \"Клиент: пятница подходит.\",\n          \"timestamp\": \"2026-10-02T09:00:00Z\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Вы должны</h3><ul><li><b>Анна:</b> счёт до пятницы — сегодня.</li><li><b>Марко:</b> решение по бюджету.</li><li><b>Клиент:</b> подтверждение доставки.</li></ul><h3>Ждёте от других</h3><p><b>Том:</b> макет обещан к среде. Проверю другие чаты перед напоминанием.</p><h3>Можно закрыть сейчас</h3><p>Дата доставки уже согласована. Для бюджета нужно ваше решение; его не буду придумывать.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Вы: пришлю счёт Анне до пятницы.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Марко",
              "text": "Том: макет отдам в среду.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Том",
              "text": "Клиент: пятница подходит.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Найди чат с Томом и проверь, не прислал ли он макет. Подготовь ответы клиенту, Анне и Тому."
        },
        {
          "tool": "tg chats list --search \"Том\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"503\",\n      \"title\": \"Том\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages list 503 --limit 30",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Том\",\n      \"text\": \"Вот первый вариант макета. Финал после ваших комментариев.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"макет\" --chat 503",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Том\",\n      \"text\": \"Вот первый вариант макета. Финал после ваших комментариев.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Клиенту</h3><blockquote><p>Доставка остаётся на пятницу, как согласовали. Если есть ограничения по времени, подскажите, пожалуйста.</p></blockquote><h3>Анне</h3><blockquote><p>Анна, привет! Счёт пришлю сегодня, как договорились.</p></blockquote><h3>Тому</h3><blockquote><p>Том, спасибо за первый вариант! Подскажи, когда сможешь прислать финал после комментариев?</p></blockquote><p><small>Макет уже есть в личке, поэтому напоминание «ты ничего не прислал» было бы неверным. Все три ответа — черновики.</small></p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Том",
              "text": "Вот первый вариант макета. Финал после ваших комментариев.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Том",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Отправь Тому этот черновик про финал макета. Остальные ответы пока не отправляй."
        },
        {
          "tool": "tg messages send 503 \"Том, спасибо за первый вариант! Подскажи, когда сможешь прислать финал после комментариев?\"",
          "out": "{\n  \"chatId\": \"503\",\n  \"messageId\": \"48221\",\n  \"status\": \"sent\"\n}"
        },
        {
          "say": "<h3>Тому отправлено</h3><p>Уточнил срок финального макета в найденном личном чате. Ответы клиенту и Анне остались черновиками. Решение по бюджету остаётся за вами.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Марко",
              "text": "Том: макет отдам в среду.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Том",
              "text": "Клиент: пятница подходит.",
              "chat": "Atlas",
              "date": "2026-10-02T09:00:00Z",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Том",
              "text": "Вот первый вариант макета. Финал после ваших комментариев.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Том",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "commitments"
    },
    {
      "title": "Напоминания и отправка",
      "hint": "tg messages send --at-time",
      "steps": [
        {
          "ask": "Используй tg cli, напомни мне через два часа проверить счёт, а через шесть — закрыть открытые вопросы."
        },
        {
          "tool": "tg messages send me \"Проверить счёт\" --at-time 2h",
          "out": "{\n  \"chatId\": \"me\",\n  \"status\": \"scheduled\",\n  \"sendId\": \"schedule-1\"\n}"
        },
        {
          "tool": "tg messages send me \"Закрыть открытые вопросы\" --at-time 6h",
          "out": "{\n  \"chatId\": \"me\",\n  \"status\": \"scheduled\",\n  \"sendId\": \"schedule-2\"\n}"
        },
        {
          "say": "<h3>Два напоминания в «Избранном»</h3><p>Через два часа — проверить счёт. Через шесть — вернуться к открытым вопросам. Telegram отправит их по расписанию, даже если ноутбук выключен.</p>",
          "sources": []
        },
        {
          "ask": "Через час попроси Анну прислать финальные тексты, а Тома — статус оплаты. Лично каждому."
        },
        {
          "tool": "tg messages send \"Анна\" \"Привет! Пришли, пожалуйста, финальные тексты.\" --at-time 1h",
          "out": "{\n  \"status\": \"scheduled\"\n}"
        },
        {
          "tool": "tg messages send \"Том\" \"Привет! Пришли, пожалуйста, статус проверки оплаты.\" --at-time 1h",
          "out": "{\n  \"status\": \"scheduled\"\n}"
        },
        {
          "say": "<h3>Личные сообщения запланированы</h3><p>Через час Анна получит просьбу прислать тексты, Том — статус оплаты. Два сообщения участникам и два напоминания вам готовы.</p>",
          "sources": []
        }
      ],
      "id": "schedule"
    },
    {
      "title": "Все документы по теме",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Используй tg cli, найди актуальный договор, счета и презентацию по Atlas. Проверь проектные группы и личную переписку."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · команда\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · дизайн\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"договор OR счёт OR презентация\" --chat \"Atlas · команда\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Презентация Atlas v2.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Марко\",\n      \"text\": \"Счёт за первый этап.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    },\n    {\n      \"id\": \"48212\",\n      \"senderName\": \"Том\",\n      \"text\": \"Договор — предварительная версия.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>В проектной группе</h3><ul><li><b>Презентация:</b> версия v2.</li><li><b>Счёт:</b> за первый этап.</li><li><b>Договор:</b> предварительная версия.</li></ul><h3>Перед сборкой комплекта</h3><p>Нужно проверить личку Анны и группу дизайна — там могли остаться более новые файлы.</p>",
          "sources": [
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Презентация Atlas v2.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · команда",
              "messenger": "tg"
            },
            {
              "id": "48211",
              "senderName": "Марко",
              "text": "Счёт за первый этап.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · команда",
              "messenger": "tg"
            },
            {
              "id": "48212",
              "senderName": "Том",
              "text": "Договор — предварительная версия.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · команда",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Посмотри личку Анны и дизайн. Оставь последние версии, но не теряй старые."
        },
        {
          "tool": "tg chats list --search \"Анна\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"501\",\n      \"title\": \"Анна\",\n      \"kind\": \"private\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"договор\" --chat 501",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Финальный договор по Atlas. Исправлены условия оплаты.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"презентация\" --chat \"Atlas · дизайн\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Презентация Atlas v3, обновила макеты.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Актуальный комплект</h3><table><thead><tr><th>Документ</th><th>Версия</th><th>Где найден</th></tr></thead><tbody><tr><td>Договор</td><td>Финальный</td><td>Личка Анны</td></tr><tr><td>Счёт</td><td>Первый этап</td><td>Atlas · команда</td></tr><tr><td>Презентация</td><td>v3</td><td>Atlas · дизайн</td></tr></tbody></table><h3>История версий</h3><p>Предварительный договор и презентация v2 сохранены отдельными пунктами. Ничего не удаляю.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Марко",
              "text": "Счёт за первый этап.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · команда",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Финальный договор по Atlas. Исправлены условия оплаты.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Анна",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Презентация Atlas v3, обновила макеты.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · дизайн",
              "messenger": "tg"
            }
          ]
        },
        {
          "ask": "Проверь оставшиеся счета и скачай актуальные файлы в папку Atlas. Ничего не отправляй."
        },
        {
          "tool": "tg messages search \"счёт\" --chat 501",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48213\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Счёт за второй этап пока не выставляли.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages download 501 48210 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/contract-final.pdf\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg messages download 101 48211 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/invoice-phase-1.pdf\"\n    }\n  ]\n}"
        },
        {
          "tool": "tg messages download 102 48210 --output-dir ./Atlas",
          "out": "{\n  \"files\": [\n    {\n      \"path\": \"Atlas/presentation-v3.pdf\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>В папке Atlas</h3><ul><li>contract-final.pdf — финальный договор.</li><li>invoice-phase-1.pdf — счёт за первый этап.</li><li>presentation-v3.pdf — актуальная презентация.</li></ul><p>Счёт за второй этап ещё не выставлен. Старые версии оставлены в истории. Файлы скачаны, клиенту ничего не отправлено.</p>",
          "sources": [
            {
              "id": "48211",
              "senderName": "Марко",
              "text": "Счёт за первый этап.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · команда",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Финальный договор по Atlas. Исправлены условия оплаты.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Анна",
              "messenger": "tg"
            },
            {
              "id": "48210",
              "senderName": "Анна",
              "text": "Презентация Atlas v3, обновила макеты.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "Atlas · дизайн",
              "messenger": "tg"
            }
          ]
        }
      ],
      "id": "files"
    },
    {
      "title": "Бот для клиентов",
      "hint": "tg bot messages list → tg bot messages send",
      "steps": [
        {
          "ask": "Используй tg cli, проверь полученные ботом sales вопросы Анны по заказу и подготовь ответы."
        },
        {
          "tool": "tg bot list",
          "out": "{\n  \"items\": [\n    {\n      \"name\": \"sales\",\n      \"configured\": true\n    }\n  ]\n}"
        },
        {
          "tool": "tg sales bot messages list 501 --limit 10",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"text\": \"Доставка согласована на пятницу. Адрес подтверждён.\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"sales\"\n    },\n    {\n      \"id\": \"48211\",\n      \"text\": \"Когда доставка? Можно перенести на завтра?\",\n      \"timestamp\": \"2026-10-02T09:00:00Z\",\n      \"senderName\": \"Анна\"\n    }\n  ],\n  \"source\": \"local\"\n}"
        },
        {
          "say": "<h3>Черновик Анне</h3><p>Доставка согласована на пятницу, адрес подтверждён. Возможность переноса на завтра уточню у команды и вернусь с ответом.</p><h3>Нужно ваше решение</h3><p>Клиент просит изменить дату. Не обещаю перенос: в полученных ботом сообщениях его не подтверждали. Ответ пока не отправлен.</p>",
          "sources": [
            {
              "id": "48210",
              "text": "Доставка согласована на пятницу. Адрес подтверждён.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Анна",
              "messenger": "tg",
              "senderName": "sales"
            },
            {
              "id": "48211",
              "text": "Когда доставка? Можно перенести на завтра?",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Анна",
              "messenger": "tg",
              "senderName": "Анна"
            }
          ]
        },
        {
          "ask": "Отправь этот ответ от sales. Перенос уточню сам."
        },
        {
          "tool": "tg sales bot messages send 501 \"Доставка согласована на пятницу, адрес подтверждён. Возможность переноса на завтра уточню у команды и вернусь с ответом.\"",
          "out": "{\n  \"chatId\": \"501\",\n  \"messageId\": \"48212\",\n  \"status\": \"sent\"\n}"
        },
        {
          "say": "<h3>Анна получила ответ</h3><p>Подтверждена согласованная дата; перенос остался на вашем контроле. Использованы только сообщения, ранее полученные ботом на этом компьютере.</p>",
          "sources": [
            {
              "id": "48210",
              "text": "Доставка согласована на пятницу. Адрес подтверждён.",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Анна",
              "messenger": "tg",
              "senderName": "sales"
            },
            {
              "id": "48211",
              "text": "Когда доставка? Можно перенести на завтра?",
              "date": "2026-10-02T09:00:00Z",
              "chat": "sales · Анна",
              "messenger": "tg",
              "senderName": "Анна"
            }
          ]
        }
      ],
      "id": "bot"
    }
  ]
};
