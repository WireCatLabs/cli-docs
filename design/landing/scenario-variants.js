// Seven selected landing scenarios. Full scenario bank: docs/LANDING_SCENARIOS.md.
window.WireScenarioVariants = {
  "en": [
    {
      "title": "Context for a call",
      "hint": "tg chats list → tg review",
      "steps": [
        {
          "ask": "Use tg CLI. We have an Atlas call tomorrow. Summarise the decisions, what's holding up the launch, and the questions I should ask."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · team\",\n      \"kind\": \"group\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · design\",\n      \"kind\": \"group\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg review --chat \"Atlas · team\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · team\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"We’re launching on Friday.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Anna needs the final copy by Thursday.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Tom needs staging access.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Decisions so far</h3><ul><li><b>Launch:</b> Friday. The scope of the first release is agreed.</li><li><b>Copy:</b> Anna needs the final version by Thursday.</li></ul><h3>Blocking the launch</h3><p><b>Tom:</b> needs staging access to test payments.</p><h3>For the call</h3><p>Agree who will provide access and when testing will be finished. I also found the design group — I can check it and your direct messages with the people involved.</p>"
        },
        {
          "ask": "Check the design group and my DMs with Tom too. He may have sent the results there."
        },
        {
          "tool": "tg review --chat \"Atlas · design\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · design\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"The design is ready. We’re still waiting for the final copy.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg messages search \"Atlas\" --chat \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Test payments work. I still need access to production.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Context from other chats</h3><ul><li><b>Design:</b> the layout is ready; final copy is the last dependency.</li><li><b>Tom, in your DMs:</b> test payments work. He still needs access to production.</li></ul><h3>The remaining risk</h3><p>Payment testing is partly done — only the production check is blocked. Focus the call on that, rather than starting from scratch.</p>"
        },
        {
          "ask": "Make a 20-minute agenda covering risks, owners and deadlines. Don't send anything."
        },
        {
          "tool": "tg messages context \"Tom\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Test payments are working.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Tom\",\n      \"text\": \"I need access to production.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>20-minute agenda</h3><ol><li><b>0–7 min:</b> production access — who will grant it, and when can Tom finish testing?</li><li><b>7–12 min:</b> final copy — who will get it to Anna by Thursday?</li><li><b>12–17 min:</b> if we run out of time, do we reduce scope or move the launch?</li><li><b>17–20 min:</b> record an owner and deadline for each action.</li></ol><p><small>Draft ready, based on the project group, design group and your DMs with Tom. Nothing has been sent.</small></p>"
        }
      ]
    },
    {
      "title": "Morning briefing",
      "hint": "tg inbox → tg review",
      "steps": [
        {
          "ask": "Use tg CLI. Good morning. What needs my attention, and which news from the channels I follow is worth reading?"
        },
        {
          "tool": "tg inbox",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Marco: please approve the budget before 11:00.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Anna: the meeting has moved to 19:30.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Mum: a 42-second voice note.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --chat \"Tech news\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Tech news\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"The coding tool has been updated.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"A practical guide to a new search approach is out.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Needs your attention today</h3><ul><li><b>Before 11:00 — Marco:</b> approve the budget so the team can continue.</li><li><b>This evening — Anna:</b> the meeting moved to 19:30; she needs your confirmation.</li><li><b>No deadline — Mum:</b> a 42-second voice note.</li></ul><h3>From your news channels</h3><ul><li><b>Coding tools:</b> an update to the development workflow.</li><li><b>Search:</b> a practical guide with examples.</li></ul><p><small>I can show the details and original messages for each item, or filter the news to work-related topics.</small></p>"
        },
        {
          "ask": "Add the AI news channel, merge duplicates, and keep only what's useful to our team."
        },
        {
          "tool": "tg review --chat \"AI news\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"AI news\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Coverage of the same coding tool update.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"New AI model: capabilities announced.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>For the development team</h3><ol><li><b>Tool update:</b> merged the duplicate coverage from two channels and kept both sources.</li><li><b>Search guide:</b> practical examples we could use in our project.</li></ol><h3>Can wait</h3><p>The new model announcement describes its capabilities, but we haven’t tested it on our project yet.</p>"
        },
        {
          "ask": "What should I tackle first in the next 15 minutes?"
        },
        {
          "tool": "tg messages context \"Marco\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Marco\",\n      \"text\": \"The budget needs approval before 11:00 or the contractor can’t start.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Your first 15 minutes</h3><ol><li><b>Budget first:</b> open Marco’s request and make a decision — the contractor is waiting on it.</li><li><b>Then the meeting:</b> confirm 19:30 with Anna.</li><li><b>After that:</b> listen to the voice note or ask for a transcript.</li></ol><p><small>I’ve kept the news in a separate list for later. None of it needs immediate action.</small></p>"
        }
      ]
    },
    {
      "title": "Unanswered questions",
      "hint": "tg review --unanswered",
      "steps": [
        {
          "ask": "Use tg CLI. Check all my chats: who needs a reply, what have I promised, and what are we waiting on from others? Draft the replies."
        },
        {
          "tool": "tg review --since-time 7d --all --unanswered",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Marco: please confirm the budget.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Customer: when is delivery?\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --since-time 7d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"You: I’ll send Anna the invoice by Friday.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Tom: I’ll send the design on Wednesday.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Customer: Friday works for me.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>On your list</h3><ul><li><b>Anna:</b> an invoice by Friday — that’s today.</li><li><b>Marco:</b> a budget decision.</li><li><b>Customer:</b> delivery confirmation.</li></ul><h3>Waiting on others</h3><p><b>Tom:</b> promised the design by Wednesday. I’ll check the other chats before drafting a reminder.</p><h3>Ready to resolve</h3><p>The delivery date is already agreed. The budget needs your decision; I won’t assume it’s approved.</p>"
        },
        {
          "ask": "Check Tom's DMs and draft three replies: delivery for the customer, the invoice for Anna, and the design for Tom."
        },
        {
          "tool": "tg messages search \"design\" --chat \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Here’s the first design draft. I’ll finalise it after your feedback.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>To the customer</h3><blockquote><p>Delivery is still set for Friday, as agreed. Please let me know if there’s a particular time that works best for you.</p></blockquote><h3>To Anna</h3><blockquote><p>Hi Anna! I’ll send the invoice today, as agreed.</p></blockquote><h3>To Tom</h3><blockquote><p>Tom, thanks for the first draft! When can you send the final version with our feedback incorporated?</p></blockquote><p><small>Tom already sent a draft in your DMs, so saying he hasn’t sent anything would be wrong. All three replies are drafts.</small></p>"
        },
        {
          "ask": "Show me the budget discussion first. Don't send anything yet."
        },
        {
          "tool": "tg messages context \"Marco\" 48210 --before-n 3 --after-n 3",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Marco\",\n      \"text\": \"We need approval for the additional analytics work.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"The contractor hasn’t confirmed the price yet.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>What needs a decision</h3><p><b>Additional analytics work:</b> the scope was discussed, but there’s no final quote.</p><h3>Suggested next step</h3><blockquote><p>Marco, please send the contractor’s final estimate, including the cost and impact on the deadline. I’ll confirm the budget once I have that.</p></blockquote><p><small>The budget remains unapproved until you have the estimate. The draft replies are saved in this conversation. Nothing has been sent.</small></p>"
        }
      ]
    },
    {
      "title": "Reminders and scheduled messages",
      "hint": "tg messages send --at-time",
      "steps": [
        {
          "ask": "Use tg CLI. We have an Atlas call on Monday at 10:00. Remind me an hour before, then at 18:00 to check whether the open questions are resolved. Use Madrid time."
        },
        {
          "tool": "tg messages send me \"Atlas call at 10:00: open the agenda\" --at-time 2026-10-05T09:00+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"901\",\n    \"text\": \"Atlas call at 10:00: open the agenda\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:00:00+02:00\",\n  \"sendId\": \"reminder-901\"\n}"
        },
        {
          "tool": "tg messages send me \"Atlas: review decisions, owners and deadlines after the call\" --at-time 2026-10-05T18:00+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"902\",\n    \"text\": \"Atlas: review decisions, owners and deadlines after the call\"\n  },\n  \"scheduledFor\": \"2026-10-05T18:00:00+02:00\",\n  \"sendId\": \"reminder-902\"\n}"
        },
        {
          "say": "<h3>Your reminders</h3><table><thead><tr><th>Time</th><th>Reminder</th></tr></thead><tbody><tr><td>09:00</td><td>Open the agenda an hour before the call</td></tr><tr><td>18:00</td><td>Review decisions and open questions</td></tr></tbody></table><p><small>Monday, 5 October, Madrid time. Both messages are scheduled in Saved Messages.</small></p>"
        },
        {
          "ask": "At 09:30, ask Anna to bring the final copy. At 09:45, ask Tom for an update on payment testing. Send each a direct message."
        },
        {
          "tool": "tg messages send \"Anna\" \"Hi! Please bring the final copy to the Atlas call at 10:00\" --at-time 2026-10-05T09:30+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"903\",\n    \"text\": \"Hi! Please bring the final copy to the Atlas call at 10:00\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:30:00+02:00\",\n  \"sendId\": \"reminder-903\"\n}"
        },
        {
          "tool": "tg messages send \"Tom\" \"Hi! Please prepare a payment testing update for the Atlas call at 10:00\" --at-time 2026-10-05T09:45+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"904\",\n    \"text\": \"Hi! Please prepare a payment testing update for the Atlas call at 10:00\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:45:00+02:00\",\n  \"sendId\": \"reminder-904\"\n}"
        },
        {
          "say": "<h3>Direct messages to the participants</h3><ul><li><b>Anna, 09:30:</b> a request to bring the final copy.</li><li><b>Tom, 09:45:</b> a request for a payment testing update.</li></ul><h3>All scheduled</h3><p>Four messages at different times: two for you and one for each participant. Telegram will deliver them on schedule, even if your laptop is off.</p>"
        }
      ]
    },
    {
      "title": "Recommended contact",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Use tg CLI. I need an accountant for my business who handles international payments. Someone recommended one in a freelance or business chat — find the contact."
        },
        {
          "tool": "tg chats list --search \"Freelance\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"301\",\n      \"title\": \"Freelance · community\"\n    },\n    {\n      \"id\": \"302\",\n      \"title\": \"Freelance · taxes\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"accountant\" --chat \"Freelance · community\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Sofia: I recommend Elena. She works with self-employed clients and international payments.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Found a relevant recommendation</h3><p><b>Sofia recommended Elena:</b> she works with self-employed clients and international payments. The message includes her contact details.</p><h3>Where else to look</h3><p>I also found “Freelance · taxes”. I can check the feedback there and look for recommendations in a business chat.</p><p><small>Elena’s fees and current availability are still unknown.</small></p>"
        },
        {
          "ask": "Check the tax and business chats. I need someone who handles euros and dollars and takes care of all the bookkeeping."
        },
        {
          "tool": "tg messages search \"Elena\" --chat \"Freelance · taxes\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Elena handles all my bookkeeping. She’s helped with foreign-currency payments too.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg chats list --search \"Business\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"303\",\n      \"title\": \"Business · recommendations\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>What the discussions confirm</h3><ul><li><b>Full bookkeeping service:</b> someone in the tax chat mentions it.</li><li><b>Foreign-currency payments:</b> there’s positive feedback.</li></ul><h3>Still to check</h3><p>Euros and dollars aren’t mentioned specifically. I found “Business · recommendations” — I’ll check it for another candidate.</p>"
        },
        {
          "ask": "Compare her with another option and draft an introductory message. Don't send it."
        },
        {
          "tool": "tg messages search \"accountant\" --chat \"Business · recommendations\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"I recommend Olga for one-off tax advice.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Who to contact first</h3><ul><li><b>Elena:</b> the closer match — self-employed clients, foreign-currency payments and full bookkeeping.</li><li><b>Olga:</b> recommended for one-off tax advice; ongoing support isn’t confirmed.</li></ul><h3>Draft to Elena</h3><blockquote><p>Hello Elena! Sofia recommended you in the Freelance chat. I’m self-employed, receive payments in euros and dollars, and need someone to handle my bookkeeping. Are you taking on new clients, and what are your fees and terms?</p></blockquote><p><small>Contact details found. Recommendations from chat members still need to be checked with Elena herself. Nothing has been sent.</small></p>"
        }
      ]
    },
    {
      "title": "All documents on a topic",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Use tg CLI. Find all the Atlas documents: the contract, invoices and presentation. They may be in the project group or in DMs."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · team\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · design\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"contract OR invoice OR presentation\" --chat \"Atlas · team\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Atlas presentation v2.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"Invoice for the first phase.\"\n    },\n    {\n      \"id\": \"48212\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Contract — initial draft.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>In the project group</h3><ul><li><b>Presentation:</b> version v2.</li><li><b>Invoice:</b> for the first phase.</li><li><b>Contract:</b> an initial draft.</li></ul><h3>Before putting the set together</h3><p>I should check Anna’s DMs and the design group for newer files.</p>"
        },
        {
          "ask": "Check Anna's DMs and the design group. Use the latest versions, but keep the old ones too."
        },
        {
          "tool": "tg messages search \"contract\" --chat \"Anna\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Final Atlas contract. Payment terms updated.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"presentation\" --chat \"Atlas · design\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Atlas presentation v3, with updated designs.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Latest versions</h3><table><thead><tr><th>Document</th><th>Version</th><th>Found in</th></tr></thead><tbody><tr><td>Contract</td><td>Final</td><td>Anna’s DMs</td></tr><tr><td>Invoice</td><td>First phase</td><td>Atlas · team</td></tr><tr><td>Presentation</td><td>v3</td><td>Atlas · design</td></tr></tbody></table><h3>Version history</h3><p>The contract draft and presentation v2 are listed separately. Nothing is being deleted.</p>"
        },
        {
          "ask": "Check for any other invoices and make a list of what to send to the customer."
        },
        {
          "tool": "tg messages search \"invoice\" --chat \"Anna\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"The second-phase invoice hasn’t been issued yet.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Ready for the customer</h3><ol><li>The final contract from Anna.</li><li>The invoice for the first phase.</li><li>Presentation v3 from the design group.</li></ol><h3>Not included</h3><p>The second-phase invoice hasn’t been issued yet. Older versions remain in the history but aren’t part of the current set.</p><p><small>The list is ready. To send the files, select the attachments and confirm the recipient.</small></p>"
        }
      ]
    },
    {
      "title": "Customer support bot",
      "hint": "tg bot list → tg bot mcp",
      "steps": [
        {
          "ask": "Use tg CLI. I want a customer bot that uses order history to answer questions and passes anything that needs a decision to me. Let's start with one customer."
        },
        {
          "tool": "tg bot list",
          "out": "{\n  \"items\": [\n    {\n      \"name\": \"sales\",\n      \"configured\": true\n    }\n  ]\n}"
        },
        {
          "tool": "tg sales bot recipients list",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"501\",\n      \"name\": \"Anna · customer\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>One-customer pilot</h3><ul><li><b>Bot:</b> sales.</li><li><b>Recipient:</b> Anna — already on the list of allowed chats.</li><li><b>Context:</b> only the available history of her order.</li></ul><h3>Reply rules</h3><p>Draft answers based on order history. Bring changes to dates, prices or compensation to you first. If information is missing, ask rather than guess.</p>"
        },
        {
          "ask": "Show me two examples: when is delivery, and can it be moved to tomorrow?"
        },
        {
          "tool": "tg messages search \"delivery\" --chat \"Anna · customer\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Delivery is agreed for Friday.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"The customer confirmed the address.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>When is delivery?</h3><blockquote><p>We agreed on Friday in our conversation. Your address is confirmed.</p></blockquote><h3>Can it be moved to tomorrow?</h3><blockquote><p>I’ll check with the team whether delivery tomorrow is possible and get back to you with confirmation.</p></blockquote><h3>For your review</h3><p>A request to change the delivery date. The bot won’t promise a new date until the team confirms it.</p>"
        },
        {
          "ask": "Require approval for every reply. And show me how to review its actions later."
        },
        {
          "tool": "tg sales config set permissions.messages.send ask --bot",
          "out": "{\n  \"setting\": \"permissions.messages.send\",\n  \"value\": \"ask\",\n  \"bot\": true\n}"
        },
        {
          "tool": "tg sales bot mcp config --confirm-send",
          "out": "{\n  \"mcpServers\": {\n    \"sales\": {\n      \"command\": \"tg\",\n      \"args\": [\n        \"sales\",\n        \"bot\",\n        \"mcp\",\n        \"--confirm-send\"\n      ]\n    }\n  }\n}"
        },
        {
          "say": "<h3>Approval before sending</h3><p>The settings and MCP configuration are ready for reviewing replies before they’re sent. The pilot remains limited to one allowed customer.</p><h3>Action history</h3><p>Review send attempts and recorded command runs, including their status, time and recipient ID.</p><p><small>Next, connect the configuration to your agent and test the first question in the pilot.</small></p>"
        }
      ]
    }
  ],
  "es": [
    {
      "title": "Contexto para una llamada",
      "hint": "tg chats list → tg review",
      "steps": [
        {
          "ask": "Usa tg CLI. Mañana tenemos una llamada sobre Atlas. Resume lo que hemos decidido, qué está frenando el lanzamiento y qué preguntas debería hacer."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · equipo\",\n      \"kind\": \"group\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · diseño\",\n      \"kind\": \"group\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg review --chat \"Atlas · equipo\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · equipo\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Lanzamos el viernes.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Anna necesita los textos finales para el jueves.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Tom necesita acceso al entorno de pruebas.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Lo que ya está decidido</h3><ul><li><b>Lanzamiento:</b> el viernes. El alcance de la primera versión está definido.</li><li><b>Textos:</b> Anna necesita la versión final para el jueves.</li></ul><h3>Qué bloquea el lanzamiento</h3><p><b>Tom:</b> necesita acceso al entorno de pruebas para comprobar los pagos.</p><h3>Para la llamada</h3><p>Acordar quién dará acceso y cuándo terminarán las pruebas. También he encontrado el grupo de diseño: puedo revisarlo junto con tus conversaciones privadas con los participantes.</p>"
        },
        {
          "ask": "Revisa también el grupo de diseño y mi conversación privada con Tom. Puede que haya enviado los resultados por ahí."
        },
        {
          "tool": "tg review --chat \"Atlas · diseño\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas · diseño\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"La maqueta está lista. Aún faltan los textos finales.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg messages search \"Atlas\" --chat \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Los pagos de prueba funcionan. Todavía necesito acceso a producción.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Contexto de otros chats</h3><ul><li><b>Diseño:</b> la maqueta está lista; solo faltan los textos finales.</li><li><b>Tom, por privado:</b> los pagos de prueba funcionan. Lo que le falta es acceso al entorno de producción.</li></ul><h3>El riesgo pendiente</h3><p>Las pruebas de pago están parcialmente hechas: solo queda la comprobación en producción. Conviene centrar la llamada en eso, sin empezar de cero.</p>"
        },
        {
          "ask": "Prepara una agenda de 20 minutos con riesgos, responsables y plazos. No envíes nada."
        },
        {
          "tool": "tg messages context \"Tom\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Los pagos de prueba funcionan.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Necesito acceso a producción.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Agenda de 20 minutos</h3><ol><li><b>0–7 min:</b> acceso a producción: quién lo dará y cuándo podrá Tom terminar las pruebas.</li><li><b>7–12 min:</b> textos finales: quién se los entregará a Anna para el jueves.</li><li><b>12–17 min:</b> si no llegamos a tiempo, ¿reducimos el alcance o aplazamos el lanzamiento?</li><li><b>17–20 min:</b> dejar un responsable y un plazo para cada tarea.</li></ol><p><small>Borrador listo a partir del grupo del proyecto, el de diseño y tu conversación privada con Tom. No se ha enviado nada.</small></p>"
        }
      ]
    },
    {
      "title": "Resumen de la mañana",
      "hint": "tg inbox → tg review",
      "steps": [
        {
          "ask": "Usa tg CLI. Buenos días. ¿Qué necesita mi atención y qué noticias de los canales que sigo merece la pena leer?"
        },
        {
          "tool": "tg inbox",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Marco: aprueba el presupuesto antes de las 11:00.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Anna: la reunión pasa a las 19:30.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Mamá: un audio de 42 segundos.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --chat \"Noticias de tecnología\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Noticias de tecnología\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"La herramienta de desarrollo se ha actualizado.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Han publicado una guía sobre un nuevo enfoque de búsqueda.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Para hoy</h3><ul><li><b>Antes de las 11:00 — Marco:</b> aprobar el presupuesto para que el equipo pueda continuar.</li><li><b>Esta tarde — Anna:</b> la reunión pasa a las 19:30; espera tu confirmación.</li><li><b>Sin plazo — mamá:</b> un audio de 42 segundos.</li></ul><h3>Noticias de tus canales</h3><ul><li><b>Herramientas de desarrollo:</b> una actualización del flujo de trabajo.</li><li><b>Búsqueda:</b> una guía práctica con ejemplos.</li></ul><p><small>Puedo mostrar los detalles y los mensajes originales de cada punto, o limitar las noticias a temas de trabajo.</small></p>"
        },
        {
          "ask": "Añade el canal de noticias de IA, agrupa las noticias repetidas y deja solo lo que sea útil para nuestro equipo."
        },
        {
          "tool": "tg review --chat \"Noticias de IA\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Noticias de IA\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"La misma actualización de la herramienta de desarrollo.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Nueva IA: anuncio de sus capacidades.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Para el equipo de desarrollo</h3><ol><li><b>Actualización de la herramienta:</b> he agrupado la noticia de los dos canales y conservado ambas fuentes.</li><li><b>Guía de búsqueda:</b> ejemplos prácticos que podemos aplicar a nuestro proyecto.</li></ol><h3>Puede esperar</h3><p>El anuncio de la nueva IA describe sus capacidades, pero todavía no la hemos probado en nuestro proyecto.</p>"
        },
        {
          "ask": "¿Por dónde empiezo en los próximos 15 minutos?"
        },
        {
          "tool": "tg messages context \"Marco\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Marco\",\n      \"text\": \"Hay que aprobar el presupuesto antes de las 11:00 para que el proveedor pueda empezar.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Tus primeros 15 minutos</h3><ol><li><b>Primero, el presupuesto:</b> abre la petición de Marco y decide; el proveedor está esperando tu aprobación.</li><li><b>Después, la reunión:</b> confirma las 19:30 con Anna.</li><li><b>Luego:</b> escucha el audio o pide una transcripción.</li></ol><p><small>Las noticias quedan en una lista aparte para más tarde. Ninguna requiere actuar ahora.</small></p>"
        }
      ]
    },
    {
      "title": "Preguntas sin respuesta",
      "hint": "tg review --unanswered",
      "steps": [
        {
          "ask": "Usa tg CLI. Revisa todos mis chats: a quién debo responder, qué he prometido y qué estamos esperando de otras personas. Prepara borradores."
        },
        {
          "tool": "tg review --since-time 7d --all --unanswered",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Marco: confirma el presupuesto, por favor.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Cliente: ¿cuándo llega el pedido?\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --since-time 7d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Anna\",\n          \"text\": \"Tú: enviaré la factura a Anna para el viernes.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Marco\",\n          \"text\": \"Tom: enviaré la maqueta el miércoles.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Tom\",\n          \"text\": \"Cliente: el viernes me va bien.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Tus pendientes</h3><ul><li><b>Anna:</b> la factura para el viernes, que es hoy.</li><li><b>Marco:</b> una decisión sobre el presupuesto.</li><li><b>Cliente:</b> confirmar la entrega.</li></ul><h3>Lo que esperas de otros</h3><p><b>Tom:</b> prometió la maqueta para el miércoles. Revisaré los demás chats antes de preparar un recordatorio.</p><h3>Se puede resolver ya</h3><p>La fecha de entrega ya está acordada. El presupuesto necesita tu decisión; no daré por hecho que está aprobado.</p>"
        },
        {
          "ask": "Revisa mi conversación privada con Tom y prepara tres respuestas: al cliente sobre la entrega, a Anna sobre la factura y a Tom sobre la maqueta."
        },
        {
          "tool": "tg messages search \"maqueta\" --chat \"Tom\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Aquí está la primera versión de la maqueta. La cerraré después de vuestros comentarios.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Al cliente</h3><blockquote><p>La entrega sigue prevista para el viernes, como acordamos. Si necesitas una franja horaria concreta, dímelo, por favor.</p></blockquote><h3>A Anna</h3><blockquote><p>¡Hola, Anna! Te enviaré la factura hoy, como acordamos.</p></blockquote><h3>A Tom</h3><blockquote><p>¡Gracias por la primera versión, Tom! ¿Cuándo podrás enviar la versión final con nuestros comentarios incorporados?</p></blockquote><p><small>Tom ya envió una primera versión por privado, así que sería incorrecto decirle que no ha enviado nada. Las tres respuestas son borradores.</small></p>"
        },
        {
          "ask": "Enséñame primero la conversación sobre el presupuesto. No envíes nada todavía."
        },
        {
          "tool": "tg messages context \"Marco\" 48210 --before-n 3 --after-n 3",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Marco\",\n      \"text\": \"Hay que aprobar el trabajo adicional de analítica.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"El proveedor aún no ha confirmado el precio.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Qué hay que decidir</h3><p><b>Trabajo adicional de analítica:</b> se ha hablado del alcance, pero aún no hay un precio final.</p><h3>Siguiente paso propuesto</h3><blockquote><p>Marco, envíame la estimación final del proveedor, con el coste y el impacto en el plazo. Después confirmaré el presupuesto.</p></blockquote><p><small>El presupuesto sigue pendiente hasta que tengas la estimación. Los borradores quedan en esta conversación. No se ha enviado nada.</small></p>"
        }
      ]
    },
    {
      "title": "Recordatorios y mensajes programados",
      "hint": "tg messages send --at-time",
      "steps": [
        {
          "ask": "Usa tg CLI. El lunes a las 10:00 tenemos una llamada sobre Atlas. Recuérdamelo una hora antes y, a las 18:00, recuérdame comprobar si hemos resuelto los temas pendientes. Todo en horario de Madrid."
        },
        {
          "tool": "tg messages send me \"Llamada sobre Atlas a las 10:00: abre la agenda\" --at-time 2026-10-05T09:00+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"901\",\n    \"text\": \"Llamada sobre Atlas a las 10:00: abre la agenda\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:00:00+02:00\",\n  \"sendId\": \"reminder-901\"\n}"
        },
        {
          "tool": "tg messages send me \"Atlas: revisa las decisiones, los responsables y los plazos después de la llamada\" --at-time 2026-10-05T18:00+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"902\",\n    \"text\": \"Atlas: revisa las decisiones, los responsables y los plazos después de la llamada\"\n  },\n  \"scheduledFor\": \"2026-10-05T18:00:00+02:00\",\n  \"sendId\": \"reminder-902\"\n}"
        },
        {
          "say": "<h3>Tus recordatorios</h3><table><thead><tr><th>Hora</th><th>Recordatorio</th></tr></thead><tbody><tr><td>09:00</td><td>Abrir la agenda una hora antes de la llamada</td></tr><tr><td>18:00</td><td>Revisar las decisiones y los temas pendientes</td></tr></tbody></table><p><small>Lunes, 5 de octubre, horario de Madrid. Ambos mensajes están programados en Mensajes guardados.</small></p>"
        },
        {
          "ask": "A las 09:30, pide a Anna que traiga los textos finales. A las 09:45, pide a Tom el estado de las pruebas de pago. Escríbeles por separado, por privado."
        },
        {
          "tool": "tg messages send \"Anna\" \"¡Hola! Trae los textos finales a la llamada sobre Atlas de las 10:00, por favor\" --at-time 2026-10-05T09:30+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"903\",\n    \"text\": \"¡Hola! Trae los textos finales a la llamada sobre Atlas de las 10:00, por favor\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:30:00+02:00\",\n  \"sendId\": \"reminder-903\"\n}"
        },
        {
          "tool": "tg messages send \"Tom\" \"¡Hola! Prepara el estado de las pruebas de pago para la llamada sobre Atlas de las 10:00, por favor\" --at-time 2026-10-05T09:45+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"904\",\n    \"text\": \"¡Hola! Prepara el estado de las pruebas de pago para la llamada sobre Atlas de las 10:00, por favor\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:45:00+02:00\",\n  \"sendId\": \"reminder-904\"\n}"
        },
        {
          "say": "<h3>Mensajes privados a los participantes</h3><ul><li><b>Anna, 09:30:</b> una petición para que traiga los textos finales.</li><li><b>Tom, 09:45:</b> una petición para que prepare el estado de las pruebas de pago.</li></ul><h3>Todo programado</h3><p>Cuatro mensajes a distintas horas: dos para ti y uno para cada participante. Telegram los enviará según lo programado, aunque el portátil esté apagado.</p>"
        }
      ]
    },
    {
      "title": "Contacto recomendado",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Usa tg CLI. Necesito una asesoría contable para autónomos que gestione pagos internacionales. Alguien recomendó una en un chat de freelance o de negocios. Encuentra el contacto."
        },
        {
          "tool": "tg chats list --search \"Freelance\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"301\",\n      \"title\": \"Freelance · comunidad\"\n    },\n    {\n      \"id\": \"302\",\n      \"title\": \"Freelance · impuestos\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"asesoría\" --chat \"Freelance · comunidad\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Sofía: recomiendo a Elena. Trabaja con autónomos y pagos internacionales.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>He encontrado una recomendación que encaja</h3><p><b>Sofía recomienda a Elena:</b> trabaja con autónomos y pagos internacionales. El mensaje incluye sus datos de contacto.</p><h3>Dónde más buscar</h3><p>También he encontrado «Freelance · impuestos». Puedo revisar las opiniones allí y buscar recomendaciones en un chat de negocios.</p><p><small>Aún no sabemos las tarifas de Elena ni si acepta nuevos clientes.</small></p>"
        },
        {
          "ask": "Revisa los chats de impuestos y negocios. Necesito que gestione euros y dólares y se encargue de toda la contabilidad."
        },
        {
          "tool": "tg messages search \"Elena\" --chat \"Freelance · impuestos\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Elena me lleva toda la contabilidad. También me ha ayudado con los pagos en divisas.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg chats list --search \"Negocios\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"303\",\n      \"title\": \"Negocios · recomendaciones\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Lo que confirman las conversaciones</h3><ul><li><b>Servicio contable completo:</b> un participante del chat de impuestos lo menciona.</li><li><b>Pagos en divisas:</b> hay una opinión positiva.</li></ul><h3>Lo que falta por confirmar</h3><p>No se mencionan euros y dólares por separado. He encontrado «Negocios · recomendaciones»: buscaré otra opción allí.</p>"
        },
        {
          "ask": "Compárala con otra opción y prepara un primer mensaje. No lo envíes."
        },
        {
          "tool": "tg messages search \"asesoría\" --chat \"Negocios · recomendaciones\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Recomiendo a Olga para consultas fiscales puntuales.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>A quién contactar primero</h3><ul><li><b>Elena:</b> encaja mejor: autónomos, pagos en divisas y servicio contable completo.</li><li><b>Olga:</b> la recomiendan para consultas fiscales puntuales; no consta que ofrezca un servicio continuado.</li></ul><h3>Borrador para Elena</h3><blockquote><p>¡Hola, Elena! Sofía te recomendó en el chat de Freelance. Soy autónomo, recibo pagos en euros y dólares y busco a alguien que lleve toda mi contabilidad. ¿Aceptas nuevos clientes? ¿Cuáles son tus tarifas y condiciones?</p></blockquote><p><small>Contacto encontrado. Las recomendaciones del chat no sustituyen la confirmación de las condiciones con Elena. No se ha enviado nada.</small></p>"
        }
      ]
    },
    {
      "title": "Todos los documentos de un tema",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Usa tg CLI. Reúne todos los documentos de Atlas: el contrato, las facturas y la presentación. Pueden estar en el grupo del proyecto o en conversaciones privadas."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · equipo\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · diseño\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"contrato OR factura OR presentación\" --chat \"Atlas · equipo\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Presentación de Atlas v2.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"Factura de la primera fase.\"\n    },\n    {\n      \"id\": \"48212\",\n      \"senderName\": \"Tom\",\n      \"text\": \"Contrato: versión preliminar.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>En el grupo del proyecto</h3><ul><li><b>Presentación:</b> versión v2.</li><li><b>Factura:</b> de la primera fase.</li><li><b>Contrato:</b> una versión preliminar.</li></ul><h3>Antes de reunir el conjunto</h3><p>Hay que revisar tu conversación privada con Anna y el grupo de diseño por si hay archivos más recientes.</p>"
        },
        {
          "ask": "Revisa mi conversación con Anna y el grupo de diseño. Quédate con las últimas versiones, pero conserva también las anteriores."
        },
        {
          "tool": "tg messages search \"contrato\" --chat \"Anna\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Contrato final de Atlas. Condiciones de pago actualizadas.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"presentación\" --chat \"Atlas · diseño\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"Presentación de Atlas v3, con las maquetas actualizadas.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Últimas versiones</h3><table><thead><tr><th>Documento</th><th>Versión</th><th>Dónde está</th></tr></thead><tbody><tr><td>Contrato</td><td>Final</td><td>Conversación con Anna</td></tr><tr><td>Factura</td><td>Primera fase</td><td>Atlas · equipo</td></tr><tr><td>Presentación</td><td>v3</td><td>Atlas · diseño</td></tr></tbody></table><h3>Historial de versiones</h3><p>El contrato preliminar y la presentación v2 están en una lista aparte. No se elimina nada.</p>"
        },
        {
          "ask": "Comprueba si hay más facturas y prepara una lista de lo que hay que enviar al cliente."
        },
        {
          "tool": "tg messages search \"factura\" --chat \"Anna\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"La factura de la segunda fase aún no se ha emitido.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Listo para el cliente</h3><ol><li>El contrato final de Anna.</li><li>La factura de la primera fase.</li><li>La presentación v3 del grupo de diseño.</li></ol><h3>No se incluye</h3><p>La factura de la segunda fase todavía no se ha emitido. Las versiones anteriores siguen en el historial, pero no forman parte del conjunto actual.</p><p><small>Ya tienes la lista. Para enviar los archivos, hay que seleccionar los adjuntos y confirmar el destinatario.</small></p>"
        }
      ]
    },
    {
      "title": "Bot de atención al cliente",
      "hint": "tg bot list → tg bot mcp",
      "steps": [
        {
          "ask": "Usa tg CLI. Quiero un bot para clientes que responda teniendo en cuenta el historial del pedido y me pase los casos que necesiten una decisión. Empecemos con un solo cliente."
        },
        {
          "tool": "tg bot list",
          "out": "{\n  \"items\": [\n    {\n      \"name\": \"sales\",\n      \"configured\": true\n    }\n  ]\n}"
        },
        {
          "tool": "tg sales bot recipients list",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"501\",\n      \"name\": \"Anna · cliente\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>Prueba con un cliente</h3><ul><li><b>Bot:</b> sales.</li><li><b>Destinataria:</b> Anna, que ya está en la lista de chats permitidos.</li><li><b>Contexto:</b> solo el historial disponible de su pedido.</li></ul><h3>Reglas para responder</h3><p>Preparar borradores basados en el historial. Consultarte primero los cambios de fechas, precios o compensaciones. Si faltan datos, preguntar en lugar de suponer.</p>"
        },
        {
          "ask": "Muéstrame dos ejemplos: cuándo llega el pedido y si se puede adelantar a mañana."
        },
        {
          "tool": "tg messages search \"entrega\" --chat \"Anna · cliente\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Anna\",\n      \"text\": \"La entrega está acordada para el viernes.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Marco\",\n      \"text\": \"El cliente ha confirmado la dirección.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>¿Cuándo llega el pedido?</h3><blockquote><p>Acordamos la entrega para el viernes en nuestra conversación. La dirección está confirmada.</p></blockquote><h3>¿Se puede adelantar a mañana?</h3><blockquote><p>Consultaré con el equipo si es posible entregarlo mañana y te responderé cuando lo confirme.</p></blockquote><h3>Para que lo revises</h3><p>Una petición de cambio de fecha. El bot no promete una nueva fecha hasta que el equipo la confirme.</p>"
        },
        {
          "ask": "Configura la aprobación de cada respuesta. Y enséñame cómo revisar sus acciones después."
        },
        {
          "tool": "tg sales config set permissions.messages.send ask --bot",
          "out": "{\n  \"setting\": \"permissions.messages.send\",\n  \"value\": \"ask\",\n  \"bot\": true\n}"
        },
        {
          "tool": "tg sales bot mcp config --confirm-send",
          "out": "{\n  \"mcpServers\": {\n    \"sales\": {\n      \"command\": \"tg\",\n      \"args\": [\n        \"sales\",\n        \"bot\",\n        \"mcp\",\n        \"--confirm-send\"\n      ]\n    }\n  }\n}"
        },
        {
          "say": "<h3>Aprobación antes de enviar</h3><p>Los ajustes y la configuración MCP están preparados para revisar cada respuesta antes de enviarla. La prueba sigue limitada a un único cliente permitido.</p><h3>Historial de acciones</h3><p>Puedes revisar los intentos de envío y las ejecuciones registradas, con su estado, hora e ID del destinatario.</p><p><small>El siguiente paso es conectar la configuración a tu agente y probar la primera pregunta.</small></p>"
        }
      ]
    }
  ],
  "ru": [
    {
      "title": "Контекст к созвону",
      "hint": "tg chats list → tg review",
      "steps": [
        {
          "ask": "Используй tg CLI. Завтра созвон по Atlas. Собери, что решили, что тормозит запуск и какие вопросы мне нужно задать."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · команда\",\n      \"kind\": \"group\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · дизайн\",\n      \"kind\": \"group\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg review --chat \"Atlas · команда\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Запускаем в пятницу.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Анна ждёт финальные тексты до четверга.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Том\",\n          \"text\": \"Тому нужен доступ к стенду.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Уже решили</h3><ul><li><b>Запуск:</b> пятница, объём первой версии зафиксирован.</li><li><b>Тексты:</b> Анне нужна финальная версия до четверга.</li></ul><h3>Блокирует запуск</h3><p><b>Том:</b> ждёт доступ к стенду для проверки оплаты.</p><h3>К созвону</h3><p>Назначить ответственного за доступ и срок проверки. Нашёл также группу дизайна — могу проверить её и личные договорённости участников.</p>"
        },
        {
          "ask": "Посмотри ещё дизайн и мою личку с Томом. Он мог прислать результат туда."
        },
        {
          "tool": "tg review --chat \"Atlas · дизайн\" --since-time 7d",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Макет готов. Финальные тексты ещё ждём.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg messages search \"Atlas\" --chat \"Том\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Проверил тестовую оплату. Для боевого стенда всё ещё нужен доступ.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Контекст из других чатов</h3><ul><li><b>Дизайн:</b> макет готов; тексты остаются последней зависимостью.</li><li><b>Том, личная переписка:</b> тестовую оплату проверил. Доступ нужен именно к боевому стенду.</li></ul><h3>Уточнённый риск</h3><p>Не вся проверка оплаты заблокирована — осталась проверка в боевой среде. На созвоне стоит обсуждать её, а не начинать с нуля.</p>"
        },
        {
          "ask": "Сделай повестку на 20 минут: риски, ответственные и сроки. Ничего не отправляй."
        },
        {
          "tool": "tg messages context \"Том\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Тестовая оплата проходит.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Марко\",\n      \"text\": \"Нужен доступ к боевому стенду.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Повестка на 20 минут</h3><ol><li><b>0–7:</b> боевой стенд — кто выдаёт доступ и когда Том завершит проверку.</li><li><b>7–12:</b> финальные тексты — кто передаёт Анне до четверга.</li><li><b>12–17:</b> если не успеваем — сокращаем объём или переносим запуск?</li><li><b>17–20:</b> зафиксировать владельца и срок каждого решения.</li></ol><p><small>Черновик готов. Учтены проектная группа, дизайн и личная переписка с Томом. Ничего не отправлено.</small></p>"
        }
      ]
    },
    {
      "title": "Утренняя сводка",
      "hint": "tg inbox → tg review",
      "steps": [
        {
          "ask": "Используй tg CLI. Доброе утро. Что требует моего внимания и какие новости из подписок стоит прочитать?"
        },
        {
          "tool": "tg inbox",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Марко: согласуй бюджет до 11:00.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Анна: встреча перенесена на 19:30.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Том\",\n          \"text\": \"Мама: голосовое на 42 секунды.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --chat \"Новости технологий\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Обновился инструмент для кода.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Опубликован разбор нового подхода к поиску.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Сегодня нужно вам</h3><ul><li><b>До 11:00 — Марко:</b> подтвердить бюджет, чтобы команда продолжила работу.</li><li><b>Вечером — Анна:</b> встречу перенесли на 19:30, ждёт подтверждения.</li><li><b>Без срока — мама:</b> голосовое, 0:42.</li></ul><h3>Новости из подписок</h3><ul><li><b>Инструменты для кода:</b> обновление рабочего процесса.</li><li><b>Поиск:</b> практический разбор с примерами.</li></ul><p><small>Подробности и исходные сообщения доступны по каждому пункту. Могу сузить новости до рабочих тем.</small></p>"
        },
        {
          "ask": "Добавь канал про ИИ, объедини повторы и оставь только полезное для нашей команды."
        },
        {
          "tool": "tg review --chat \"Новости ИИ\" --since-time 1d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"То же обновление инструмента для кода.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Новая модель: анонс возможностей.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Для команды разработчиков</h3><ol><li><b>Обновление инструмента:</b> повтор из двух каналов объединил; сохранил оба источника.</li><li><b>Разбор поиска:</b> практический материал, можно применить к нашей задаче.</li></ol><h3>Можно отложить</h3><p>Анонс модели: пока есть заявления о возможностях, но нет проверки на нашем проекте.</p>"
        },
        {
          "ask": "Что первым сделать за ближайшие 15 минут?"
        },
        {
          "tool": "tg messages context \"Марко\" 48210 --before-n 2 --after-n 2",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Нужно согласовать бюджет до 11:00, иначе подрядчик не начнёт.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Первые 15 минут</h3><ol><li><b>Сначала бюджет:</b> открыть запрос Марко и принять решение — он блокирует подрядчика.</li><li><b>Затем встреча:</b> подтвердить Анне 19:30.</li><li><b>После этого:</b> прослушать голосовое или попросить расшифровку.</li></ol><p><small>Новости оставил отдельным списком на потом: срочных действий по ним нет.</small></p>"
        }
      ]
    },
    {
      "title": "Вопросы без ответа",
      "hint": "tg review --unanswered",
      "steps": [
        {
          "ask": "Используй tg CLI. Посмотри все чаты: кому я должен ответить, что обещал и от кого мы сами ждём результата. Подготовь черновики."
        },
        {
          "tool": "tg review --since-time 7d --all --unanswered",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Марко: подтвердите бюджет.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Клиент: когда доставка?\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "tool": "tg review --since-time 7d --all",
          "out": "{\n  \"chats\": [\n    {\n      \"title\": \"Atlas\",\n      \"messages\": [\n        {\n          \"id\": \"48210\",\n          \"senderName\": \"Анна\",\n          \"text\": \"Вы: пришлю счёт Анне до пятницы.\"\n        },\n        {\n          \"id\": \"48211\",\n          \"senderName\": \"Марко\",\n          \"text\": \"Том: макет отдам в среду.\"\n        },\n        {\n          \"id\": \"48212\",\n          \"senderName\": \"Том\",\n          \"text\": \"Клиент: пятница подходит.\"\n        }\n      ],\n      \"more\": false\n    }\n  ],\n  \"skipped\": [],\n  \"partial\": false\n}"
        },
        {
          "say": "<h3>Вы должны</h3><ul><li><b>Анна:</b> счёт до пятницы — сегодня.</li><li><b>Марко:</b> решение по бюджету.</li><li><b>Клиент:</b> подтверждение доставки.</li></ul><h3>Ждёте от других</h3><p><b>Том:</b> макет обещан к среде. Проверю другие чаты перед напоминанием.</p><h3>Можно закрыть сейчас</h3><p>Дата доставки уже согласована. Для бюджета нужно ваше решение; его не буду придумывать.</p>"
        },
        {
          "ask": "Проверь личку Тома и сделай драфты: клиенту про доставку, Анне про счёт, Тому про макет."
        },
        {
          "tool": "tg messages search \"макет\" --chat \"Том\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Вот первый вариант макета. Финал после ваших комментариев.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Клиенту</h3><blockquote><p>Доставка остаётся на пятницу, как согласовали. Если есть ограничения по времени, подскажите, пожалуйста.</p></blockquote><h3>Анне</h3><blockquote><p>Анна, привет! Счёт пришлю сегодня, как договорились.</p></blockquote><h3>Тому</h3><blockquote><p>Том, спасибо за первый вариант! Подскажи, когда сможешь прислать финал после комментариев?</p></blockquote><p><small>Макет уже есть в личке, поэтому напоминание «ты ничего не прислал» было бы неверным. Все три ответа — черновики.</small></p>"
        },
        {
          "ask": "Покажи сначала бюджет и больше ничего пока не отправляй."
        },
        {
          "tool": "tg messages context \"Марко\" 48210 --before-n 3 --after-n 3",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Нужно согласовать дополнительные работы по аналитике.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Марко\",\n      \"text\": \"Цена ещё не подтверждена подрядчиком.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Что нужно решить</h3><p><b>Дополнительная аналитика:</b> обсуждали объём, но финальной цены нет.</p><h3>Предлагаемый следующий шаг</h3><blockquote><p>Марко, пришли финальную оценку подрядчика: стоимость и влияние на срок. После этого подтвержу бюджет.</p></blockquote><p><small>Без оценки не считаю бюджет согласованным. Подготовленные ответы сохранены в диалоге; отправки не было.</small></p>"
        }
      ]
    },
    {
      "title": "Напоминания и отправка",
      "hint": "tg messages send --at-time",
      "steps": [
        {
          "ask": "Используй tg CLI. В понедельник в 10 созвон по Atlas. Напомни мне за час, а в 18:00 — проверить, закрыли ли вопросы. Всё по Мадриду."
        },
        {
          "tool": "tg messages send me \"В 10:00 созвон по Atlas: открой повестку\" --at-time 2026-10-05T09:00+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"901\",\n    \"text\": \"В 10:00 созвон по Atlas: открой повестку\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:00:00+02:00\",\n  \"sendId\": \"reminder-901\"\n}"
        },
        {
          "tool": "tg messages send me \"Atlas: проверь решения, ответственных и сроки после созвона\" --at-time 2026-10-05T18:00+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"902\",\n    \"text\": \"Atlas: проверь решения, ответственных и сроки после созвона\"\n  },\n  \"scheduledFor\": \"2026-10-05T18:00:00+02:00\",\n  \"sendId\": \"reminder-902\"\n}"
        },
        {
          "say": "<h3>Ваши напоминания</h3><table><thead><tr><th>Когда</th><th>Что</th></tr></thead><tbody><tr><td>09:00</td><td>Открыть повестку за час до созвона</td></tr><tr><td>18:00</td><td>Проверить решения и открытые вопросы</td></tr></tbody></table><p><small>Понедельник, 5 октября. Время Мадрида. Оба сообщения запланированы в «Избранное».</small></p>"
        },
        {
          "ask": "Анне отправь в 9:30 просьбу принести финальные тексты. Тому в 9:45 — статус проверки оплаты. Лично каждому."
        },
        {
          "tool": "tg messages send \"Анна\" \"Привет! К созвону в 10:00 по Atlas принеси, пожалуйста, финальные тексты\" --at-time 2026-10-05T09:30+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"903\",\n    \"text\": \"Привет! К созвону в 10:00 по Atlas принеси, пожалуйста, финальные тексты\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:30:00+02:00\",\n  \"sendId\": \"reminder-903\"\n}"
        },
        {
          "tool": "tg messages send \"Том\" \"Привет! К созвону в 10:00 по Atlas подготовь, пожалуйста, статус проверки оплаты\" --at-time 2026-10-05T09:45+02:00",
          "out": "{\n  \"message\": {\n    \"id\": \"904\",\n    \"text\": \"Привет! К созвону в 10:00 по Atlas подготовь, пожалуйста, статус проверки оплаты\"\n  },\n  \"scheduledFor\": \"2026-10-05T09:45:00+02:00\",\n  \"sendId\": \"reminder-904\"\n}"
        },
        {
          "say": "<h3>Личные сообщения участникам</h3><ul><li><b>Анна, 09:30:</b> просьба принести финальные тексты.</li><li><b>Том, 09:45:</b> просьба подготовить статус проверки оплаты.</li></ul><h3>Итого</h3><p>Четыре сообщения в разное время: два вам и по одному каждому участнику. Telegram отправит их по расписанию, даже если ноутбук будет выключен.</p>"
        }
      ]
    },
    {
      "title": "Рекомендованный контакт",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Используй tg CLI. Мне нужен бухгалтер для ИП с международными платежами. Кто-то советовал человека в чатах про фриланс или бизнес — найди контакт."
        },
        {
          "tool": "tg chats list --search \"Фриланс\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"301\",\n      \"title\": \"Фриланс · сообщество\"\n    },\n    {\n      \"id\": \"302\",\n      \"title\": \"Фриланс · налоги\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"бухгалтер\" --chat \"Фриланс · сообщество\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"София: рекомендую Елену, работает с ИП и международными платежами.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Нашёл подходящую рекомендацию</h3><p><b>София → Елена:</b> ИП и международные платежи. В сообщении есть контакт.</p><h3>Где ещё проверить</h3><p>Нашёл отдельный чат «Фриланс · налоги». Могу сверить отзывы там и поискать рекомендации в бизнес-чате.</p><p><small>Цена и текущая доступность Елены пока неизвестны.</small></p>"
        },
        {
          "ask": "Проверь налоги и бизнес. Мне важны евро, доллары и ведение под ключ."
        },
        {
          "tool": "tg messages search \"Елена\" --chat \"Фриланс · налоги\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Елена ведёт ИП под ключ. С валютными платежами помогала.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg chats list --search \"Бизнес\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"303\",\n      \"title\": \"Бизнес · рекомендации\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Что подтвердилось в обсуждениях</h3><ul><li><b>Ведение под ключ:</b> участник налогового чата это упоминает.</li><li><b>Валютные платежи:</b> есть положительный отзыв.</li></ul><h3>Ещё нужно уточнить</h3><p>Евро и доллары отдельно не названы. Нашёл «Бизнес · рекомендации» — проверю, нет ли там другого кандидата.</p>"
        },
        {
          "ask": "Сравни с альтернативой и подготовь первое сообщение, не отправляй."
        },
        {
          "tool": "tg messages search \"бухгалтер\" --chat \"Бизнес · рекомендации\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Рекомендую Ольгу для разовых консультаций по налогам.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Кого выбрать для первого контакта</h3><ul><li><b>Елена:</b> ближе к задаче — ИП, валютные платежи, ведение под ключ.</li><li><b>Ольга:</b> рекомендована для разовых консультаций; постоянное сопровождение не подтверждено.</li></ul><h3>Черновик Елене</h3><blockquote><p>Елена, здравствуйте! София рекомендовала вас в чате «Фриланс». Я работаю как ИП, получаю платежи в евро и долларах и ищу ведение под ключ. Берёте ли новых клиентов и какие условия?</p></blockquote><p><small>Контакт найден. Отзывы участников не заменяют подтверждение условий самой Еленой. Ничего не отправлено.</small></p>"
        }
      ]
    },
    {
      "title": "Все документы по теме",
      "hint": "tg chats list → tg messages search",
      "steps": [
        {
          "ask": "Используй tg CLI. Собери все документы по Atlas: договор, счета и презентацию. Их могли присылать в проектную группу или в личку."
        },
        {
          "tool": "tg chats list --search \"Atlas\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"101\",\n      \"title\": \"Atlas · команда\"\n    },\n    {\n      \"id\": \"102\",\n      \"title\": \"Atlas · дизайн\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"договор OR счёт OR презентация\" --chat \"Atlas · команда\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Презентация Atlas v2.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Марко\",\n      \"text\": \"Счёт за первый этап.\"\n    },\n    {\n      \"id\": \"48212\",\n      \"senderName\": \"Том\",\n      \"text\": \"Договор — предварительная версия.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>В проектной группе</h3><ul><li><b>Презентация:</b> версия v2.</li><li><b>Счёт:</b> за первый этап.</li><li><b>Договор:</b> предварительная версия.</li></ul><h3>Перед сборкой комплекта</h3><p>Нужно проверить личку Анны и группу дизайна — там могли остаться более новые файлы.</p>"
        },
        {
          "ask": "Посмотри личку Анны и дизайн. Оставь последние версии, но не теряй старые."
        },
        {
          "tool": "tg messages search \"договор\" --chat \"Анна\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Финальный договор по Atlas. Исправлены условия оплаты.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "tool": "tg messages search \"презентация\" --chat \"Atlas · дизайн\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Презентация Atlas v3, обновила макеты.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Актуальный комплект</h3><table><thead><tr><th>Документ</th><th>Версия</th><th>Где найден</th></tr></thead><tbody><tr><td>Договор</td><td>Финальный</td><td>Личка Анны</td></tr><tr><td>Счёт</td><td>Первый этап</td><td>Atlas · команда</td></tr><tr><td>Презентация</td><td>v3</td><td>Atlas · дизайн</td></tr></tbody></table><h3>История версий</h3><p>Предварительный договор и презентация v2 сохранены отдельными пунктами. Ничего не удаляю.</p>"
        },
        {
          "ask": "Проверь, есть ли ещё счета, и составь список для отправки клиенту."
        },
        {
          "tool": "tg messages search \"счёт\" --chat \"Анна\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Счёт за второй этап пока не выставляли.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Можно подготовить клиенту</h3><ol><li>Финальный договор от Анны.</li><li>Счёт за первый этап.</li><li>Презентацию v3 из группы дизайна.</li></ol><h3>Не включаю</h3><p>Счёт за второй этап: его ещё не выставляли. Старые версии оставлены в истории, но в актуальный комплект не входят.</p><p><small>Список готов. Для отправки нужно выбрать найденные вложения и подтвердить получателя.</small></p>"
        }
      ]
    },
    {
      "title": "Бот для клиентов",
      "hint": "tg bot list → tg bot mcp",
      "steps": [
        {
          "ask": "Используй tg CLI. Хочу бота для клиентов: учитывать историю заказа, отвечать на вопросы, а спорные случаи передавать мне. Начнём с одного клиента."
        },
        {
          "tool": "tg bot list",
          "out": "{\n  \"items\": [\n    {\n      \"name\": \"sales\",\n      \"configured\": true\n    }\n  ]\n}"
        },
        {
          "tool": "tg sales bot recipients list",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"501\",\n      \"name\": \"Анна · клиент\"\n    }\n  ]\n}"
        },
        {
          "say": "<h3>Пилот на одном клиенте</h3><ul><li><b>Бот:</b> sales.</li><li><b>Получатель:</b> Анна — уже в списке разрешённых чатов.</li><li><b>Контекст:</b> только доступная история её заказа.</li></ul><h3>Правила</h3><p>Вопросы по истории — черновик ответа. Изменение сроков, цены и компенсации — сначала вам. Если данных нет, уточнение вместо догадки.</p>"
        },
        {
          "ask": "Покажи на двух вопросах: когда доставка и можно ли перенести её на завтра."
        },
        {
          "tool": "tg messages search \"доставка\" --chat \"Анна · клиент\"",
          "out": "{\n  \"items\": [\n    {\n      \"id\": \"48210\",\n      \"senderName\": \"Анна\",\n      \"text\": \"Доставка согласована на пятницу.\"\n    },\n    {\n      \"id\": \"48211\",\n      \"senderName\": \"Марко\",\n      \"text\": \"Адрес клиент подтвердил.\"\n    }\n  ],\n  \"hasMore\": false\n}"
        },
        {
          "say": "<h3>Когда доставка?</h3><blockquote><p>В переписке согласовали доставку на пятницу. Адрес подтверждён.</p></blockquote><h3>Можно перенести на завтра?</h3><blockquote><p>Уточню у команды, возможен ли перенос на завтра, и вернусь с подтверждением.</p></blockquote><h3>Вам на проверку</h3><p>Запрос на изменение даты. Бот не обещает перенос, пока команда его не подтвердит.</p>"
        },
        {
          "ask": "Настрой подтверждение каждого ответа. И покажи, как потом проверить его действия."
        },
        {
          "tool": "tg sales config set permissions.messages.send ask --bot",
          "out": "{\n  \"setting\": \"permissions.messages.send\",\n  \"value\": \"ask\",\n  \"bot\": true\n}"
        },
        {
          "tool": "tg sales bot mcp config --confirm-send",
          "out": "{\n  \"mcpServers\": {\n    \"sales\": {\n      \"command\": \"tg\",\n      \"args\": [\n        \"sales\",\n        \"bot\",\n        \"mcp\",\n        \"--confirm-send\"\n      ]\n    }\n  }\n}"
        },
        {
          "say": "<h3>Подтверждение отправки</h3><p>Настройки и конфигурация MCP подготовлены для проверки ответов перед отправкой. Пилот остаётся на одном разрешённом клиенте.</p><h3>История действий</h3><p>Можно смотреть журнал попыток отправки и записанные запуски: статусы, время и ID получателя.</p><p><small>Следующий шаг — подключить конфигурацию к агенту и проверить первый вопрос в пилоте.</small></p>"
        }
      ]
    }
  ]
};
