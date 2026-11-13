---
title: "Privacy and AI agents: where your data goes while the agent works"
description: When privacy really matters, where data leaks while you work with AI agents and what you can do about it. With real leaks and how we handle this in WireCat.
date: 2026-11-05
tags: [security, ai-agents]
cover: ./cover.jpg
coverAlt: "A stack of handwritten letters tied with string and two notebooks under a glass bell jar on a dark desk, a small brass key next to it. Outside the jar, loose letters and chat message cards are scattered toward the dark edges, caught on red threads."
author: viacheslav-ptsarev
draft: false
---

Everyone is talking about privacy now, especially after the recent leaks. [People's conversations with ChatGPT and Claude are sold in a commercial database](https://www.theregister.com/2026/03/03/chatbot_data_harvesting_personal_info/), and a researcher found patient data in it that medical staff had pasted into a chatbot. [VPN extensions for Chrome, the ones that promised privacy of all things, collected AI chats from 8 million people](https://www.malwarebytes.com/blog/news/2025/12/chrome-extension-slurps-up-ai-chats-after-users-installed-it-for-privacy) and handed them to a data broker. And [one chatbot app left about 300 million messages open to anyone](https://www.foxnews.com/tech/millions-ai-chat-messages-exposed-app-data-leak.print) (that's a researcher's estimate), just because someone set up Firebase badly.

I build [WireCat](https://wirecat.dev). It's open source tools that give an AI agent access to your messages in Telegram, WhatsApp and MAX, to your mail, notes, meetings and CRM, so it can tell you what you agreed with a client or what you promised a colleague. So the agent gets exactly the stuff that should not leak, and not only yours, but also the messages of people who write to you. That's why in WireCat we think about privacy all the time. From the start all the data stays on your computer, and you decide what goes where. Below I put together when privacy really matters, where data leaks while you work with an agent and what you can do about it.

## When privacy really matters

I don't think everyone needs to leave cloud models right now. I write code with Claude Code myself, and for most tasks the cloud is faster and smarter than anything a laptop can run. But there are cases when it's worth thinking about this in advance:

- **Your messages hold other people's words.** I think this one is the most underrated. A client sent a contract, a friend told you about their health, and none of them agreed that someone's model would read it. You give your own code to the agent yourself, but with messages you partly decide for other people too. WhatsApp, by the way, [added a chat setting in spring 2025 that stops its messages from being used with AI](https://blog.whatsapp.com/introducing-advanced-chat-privacy).
- **Professional secrecy.** The American Bar Association writes that [a lawyer must get the client's explicit consent before putting their data into an AI](https://www.jdsupra.com/legalnews/aba-weighs-in-on-generative-ai-use-in-3097638) that learns from it. In the Netherlands [the regulator received data breach notices after a clinic employee pasted patients' medical data into a chatbot](https://www.dutchitchannel.nl/news/466398/ap-gebruik-ai-chatbot-kan-leiden-tot-datalekken).
- **NDAs and work data.** The classic one is [Samsung, which in 2023 banned generative AI in one of its divisions](https://www.csoonline.com/article/3695170/samsung-bans-staff-ai-use-over-data-leak-concerns.html) after engineers uploaded internal code to ChatGPT.
- **You just don't want to.** Also a fine reason.

## Where data leaks while you work with an agent

People usually think of one place, the model sees my request. But there are more, and not all of them are obvious:

1. **The agent's model.** Everything the agent read, it sends to its model. If the model is in the cloud, it goes to the provider. You can't call that a leak, but from there it all depends on the provider's rules.
2. **Storage and training at the provider.** At Anthropic, on Free, Pro and Max, since autumn 2025 [your data goes into training if the setting is on, and then it's kept for 5 years, and if it's off, for 30 days](https://www.anthropic.com/news/updates-to-our-consumer-terms). This covers Claude Code on these plans too. [Google keeps Gemini chats that went to human review for up to 3 years](https://support.google.com/gemini/answer/13594961), even if you deleted your history. And OpenAI in 2025, by a court order in the NYT case, [had to keep all chats, including deleted ones](https://engadget.com/ai/openai-no-longer-has-to-preserve-all-of-its-chatgpt-data-with-some-exceptions-192422093.html), and later [the court ordered it to hand the NYT about 20 million chats](https://news.bloomberglaw.com/ip-law/openai-must-turn-over-20-million-chatgpt-logs-judge-affirms), though anonymized. API and business plans have softer rules, but you need to check that for your plan.
3. **The share button.** In summer 2025 [thousands of shared ChatGPT chats ended up in Google](https://fortune.com/2025/08/05/openai-google-search-chat-history/), and [for Grok there were more than 370,000](https://9to5mac.com/2025/08/20/370k-grok-ai-chats-made-public-without-user-consent/), with medical questions and even a password.
4. **Someone else's text that gives the agent orders (prompt injection).** The agent reads an email or a message, there's an instruction in it, and the agent follows it. This has already happened. Through a public issue on GitHub, [an agent with the official GitHub MCP leaked data from private repositories](https://invariantlabs.ai/blog/mcp-github-vulnerability), and [one email made Microsoft 365 Copilot send data out without a single click](https://www.securityweek.com/echoleak-ai-attack-enabled-theft-of-sensitive-data-via-microsoft-365-copilot/). [Simon Willison called this the lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/). If an agent has your private data, reads someone else's text and can send something out, it can be made to leak your data. An agent with access to your messages falls under this right away.
5. **The tools themselves.** An MCP server or an extension is also code that sees your data. In September 2025 a [fake MCP server for email was found in npm, it quietly added the attacker as a BCC on every email](https://www.theregister.com/2025/09/29/postmark_mcp_server_code_hijacked/), and it had around 1,500 downloads a week.
6. **Models inside the tools.** Besides your agent, tools sometimes have their own models, for reading pictures, transcribing voice messages, more careful search. Each such model is one more place where text goes, and usually nobody thinks about them.
7. **Local that isn't quite local.** For example, in Ollama some models run on Ollama's servers, not on your machine. Or you keep a model on a home server, the tool talks to it over plain http, and your messages travel over the network without encryption.
8. **The copy on disk.** If a tool keeps your messages on your machine, anyone who sits down at your computer under your user can read them. Disk encryption and a screen lock help here, not the tool's settings.

The list isn't complete, I collected what I found while building WireCat.

## What to do about it

Some of these don't depend on you, but you can do a lot yourself:

- Turn off training on your data at the provider, and for sensitive things use the API or a business plan, where storage rules are stricter.
- Don't press share on chats with anything personal.
- Give the agent as few rights as possible. Let it read, but send messages only with your confirmation.
- Look at which MCP servers and extensions you install, and who made them.
- For the most sensitive things, run the model on your own machine. It's slower, but the text goes nowhere.
- Turn on disk encryption.

## How this works in WireCat

From the start we assumed the agent would read other people's messages, and so other people's instructions too.

- **Your data stays with you.** Each tool keeps a copy of your messages in a database on your computer, and search over it, by words and by meaning, runs on models that WireCat downloads to your machine. So you can find what you need with no cloud at all.
- **Everything that needs a cloud model is off by default.** Search by meaning and meeting transcription run locally, while reading pictures, reply drafts and more careful search are things you turn on, and the settings show where each feature sends data.
- **One switch, Only this computer.** When it's on, WireCat tools refuse to talk to a model on another computer before anything is sent. An agent can turn it on, but only you can turn it off.
- **Other people's text is marked as data.** The tools give messages to the agent as material to read, not as instructions. This isn't a guarantee, the agent can still get it wrong, so you can limit the right to send, down to specific recipients and a number of messages per hour.
- **Background agents with limits.** Digests and the mail agent read other people's emails without you, so Claude Code gets only WireCat's commands for them, and Codex runs in a sandbox with no network (its commands can't be limited, so WireCat warns you about that before you turn it on). Your own agent settings, which could widen this, are not read.

The last point, by the way, gets in the way of privacy. Since your agent settings are not read, the local model you set there doesn't reach the digests either. I had to choose, and for now I chose security.

How to run WireCat fully on local models, with numbers on what it costs in speed and memory, I wrote up [in a separate post](/en/blog/local-models-and-private-messages).

If you're thinking about privacy for your team or your clients and want to talk it through, write in the Help topic in Telegram or in #help on Discord. And if you know cases I missed, I'd be glad to hear them.
