---
title: "WireCat on local models: what runs where, how to set it up and what it costs"
description: What WireCat is, which of its features need an AI model, how to move all of them to a model on your own computer and what that costs in speed and memory. With numbers from our measurements and the places where data still goes out.
date: 2026-11-10
tags: [ai-agents, search, benchmarks]
author: viacheslav-ptsarev
draft: false
---

Agents like Claude Code or Codex write code well, but they don't know what you agreed with a contractor last week, because that lives in Telegram, in your mail and in a call recording. I build [WireCat](https://wirecat.dev), a set of open source tools that give the agent access to all of that, and an app where you connect all of it without a terminal.

Since private messages go through WireCat, the question of where they go is one of the main ones for us (I wrote why [in the post about privacy](/en/blog/privacy-and-ai-agents)). Recently I made it possible to run WireCat fully on local models, and along the way I found a few places where data went out when it shouldn't have.

## How WireCat works

Each tool connects one source, Telegram, WhatsApp, MAX, mail, notes, Zoom, Google Drive and so on, and keeps a copy of the data in a database on your computer. Messengers connect with your own account, so the agent sees the same as you. You keep your own agent, WireCat has no model of its own.

Search over this database has 2 layers. Search by words finds messages even when a word is spelled a bit differently. Search by meaning runs on embeddings (number fingerprints of what a text means) and finds a message when you ask in other words. Both run on your computer. WireCat downloads the model for meaning by itself, right now it's EmbeddingGemma 300M. I compared several free models, and on our data it came out best, even though it's one of the smallest.

And the time is fine too. Memo (the tool for notes, mail and memory) indexed a test set of 10,000 records on my laptop in about 2.5 minutes. That was still on the previous model, e5-small, with Gemma it takes 4-7 minutes. For comparison, Mem0 on its free plan processed 6,500 records in 19 hours, though that's its queue on the server, not the model's speed.

## Which features need a model

Search is the base, but around it there are a lot of features that need an AI model. Here are all of them, and where each one runs by default:

| Feature | What it does | By default | Can be local |
| --- | --- | --- | --- |
| Search by meaning and by pictures | finds records and pictures by meaning | on your computer | already |
| Meeting transcription | turns a call recording into text | on your computer | already |
| Voice messages | turns a voice message into text | on your computer if the model is downloaded, otherwise the messenger | yes, the --local flag |
| Picture recognition | reads the text on pictures you added to memory | off | yes, Ollama or your own server |
| Reading for facts | pulls facts, decisions and tasks out of a document | your agent | yes, Ollama or the AI model |
| Search harder | reorders the top 30 search results when you press the button | off | yes, by address |
| Rewrite records for better search | adds other words to notes and emails so they get found | off | yes, by address |
| Chat linking, reply drafts, text in attachments | what the name says | off | yes, through the AI model |
| Digests and the mail agent | writes a digest every morning, sorts new mail | the agent you chose | depends on the agent |
| Your agent | everything else | its model | depends on the agent |

Everything that's off, you turn on yourself, and the settings show where each feature sends data.

## How I looked for where data leaks

I went through every feature where WireCat calls a model, there were 13 of them, and for each one I wrote down what goes out and whether it can stay on your machine.

The worst one was my own mistake. Rewriting records, Search harder, chat linking and a couple more features happily accepted an http:// address on another computer. So if you keep Ollama on a home server and entered its address, your notes and emails went over the network without encryption. The AI model setting already blocked this, but for some reason the others didn't. Now there's one rule, plain http only to this computer, to another one only https.

Also, a local model required a key. To connect LM Studio or llama.cpp on your machine, you had to enter some API key, even though no key is needed there. A small thing, but at that moment a person thinks, if there's a key, it must be the cloud. I removed it.

With voice messages, by default the messenger itself made the text, for example Telegram if you have Premium. I changed the order, now the downloaded model goes first, and the messenger only if there's no model.

And one conflict I still haven't solved. Digests and mail sorting are done by the coding agent you chose in the settings. We start Claude Code and Codex for these jobs without your own settings, on purpose. A digest reads other people's emails, and they may contain text that tries to make the agent do something. So Claude Code gets only WireCat's commands, and Codex runs in a sandbox with no network, and your settings, which could widen this, are not read. Because of that, the local model you set in Codex's settings doesn't reach the digests either. I had to choose between security and privacy, and for now I chose security. OpenCode, in theory, reads its own settings, so it should work with it, but I haven't checked that yet.

Then there's Ollama. Not all of its models are local, some, the ones with cloud in their name, run on Ollama's servers, and its web search goes out too. So you can honestly install Ollama on your machine and still send everything to the cloud.

## How to set it up

There's a step by step guide on the site, [Run WireCat on local models](/en/docs/desktop/local-models). In short:

1. Install Ollama (or LM Studio, or any other server with an OpenAI-style API) and download a model. For pictures you need a model that can see them, for example llava. Ollama's cloud models are turned off with one line in Ollama's settings.
2. In WireCat Desktop, in Settings, AI model, choose Ollama on this computer. No key needed.
3. In Reading for facts, choose this model or Ollama.
4. If you want, point Search harder and rewriting records at it too, both let you enter your own server's address.
5. Transcribe voice messages with --local.
6. Run your own agent on a local model. Ollama can start Codex, Claude Code, OpenCode and a couple of others with one command, ollama launch. Anthropic, though, doesn't officially support Claude Code on other models, and for Cursor and Gemini CLI I didn't find such a setting in their docs.
7. Turn on Only this computer.

The last step is the main one here. It's one switch, and after it WireCat tools refuse to call a model at an address that isn't localhost, 127.x.x.x or [::1], and they refuse before sending, not after. An agent can turn it on, but only you can turn it off. Under it there's a list of features marked with where each one sends data now, so you can see what's left to fix.

But there are a few places the switch doesn't cover, and you have to watch them yourself. That's your agent, digests with Claude Code or Codex, and reading pictures through the agent (a separate setting that sends a picture to Claude Code or Codex, better set it to Never).

## What it costs

A local model is free, but it eats time and memory. I measured on my laptop, AMD Ryzen AI 9 HX 470, 30 GB of memory, no graphics card, and other agents were running on it at the same time, so the numbers are noisy.

You see it best on Search harder. I ran 2 sets, our synthetic v3 (10,444 short records, 46 questions) and a piece of LifeBench (synthetic data from one person's phone over a year, 59 questions). The number is the share of the right records in the top ten. All rows reorder the same results, which 2 small Haiku calls had already pulled in before, so this compares the reordering itself, not the whole search:

| Reordered with | v3 | LifeBench | Time per question | Memory | Price per question |
| --- | ---: | ---: | ---: | ---: | ---: |
| Nothing | 0.94 | 0.47 | 0 | | 0 |
| jina-reranker-v2, a small local model | 0.94 | 0.48 | 1.4 s / 9 s | 5.7 GB together with the whole test | 0 |
| qwen3.5:9b in Ollama, on the CPU | 0.94 | didn't run | 25 s | 7.7 GB the model itself | 0 |
| Claude Haiku 5.5, cloud | 0.94 | 0.55 | about 1 s | | about $0.0004 |

On v3 the local qwen did the same as Haiku, but in 25 seconds per question instead of one. It never got to LifeBench. I had to stop the run on the questions asked in other words (it got through 2 of 17), because the model took 7.7 GB, and together with the tasks next to it the computer ran out of memory. That's why Search harder now waits up to 60 seconds for a local model and 5 for a cloud one.

Small reordering models like jina are faster, but on their own they lose the questions asked in other words and add +0.01 at most. So for search I'd keep local what's already there, and connect a model where half a minute isn't a problem.

With rewriting records it's the other way round, the cloud is cheap but gets everything. Through gpt-4o-mini the whole test set, 9,840 records, cost about $0.49, and with EmbeddingGemma the questions asked in other words were found noticeably more often, 0.94 in the top ten instead of 0.78. But that's all your notes and emails sent to OpenAI. Locally it's free, but on the CPU it will take hours, not minutes (I didn't measure this, only estimated it from the speed above).

For agents, Ollama asks for a context of at least 64,000 tokens, and the model has to be able to call tools. A small model on a laptop answers slowly and makes more mistakes in commands than a cloud one. So for an agent on a local model I'd really want a graphics card.

## What I didn't check

- Quality in Russian. All the measurements above are on English synthetic data.
- A graphics card. All local numbers are on the CPU.
- qwen3.5:9b reordering on LifeBench and on most of the questions asked in other words.
- Rewriting records with a local model in full, only an estimate.
- Agents on a local model against WireCat on real tasks.
- Whether zoom pulls Zoom's own cloud transcripts.

And the numbers are noisy. One question in a set of 17 moves the result by 0.06, and Haiku on a repeat run slid from 1.00 to 0.94 by itself.

In short, search in WireCat is already local and free. Everything beyond it can be moved to your own model, but that costs time and memory, and a few places you have to watch yourself.

Step by step guide: [Run WireCat on local models](/en/docs/desktop/local-models). The measurements with data and scripts are in [cli-testing](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/knowledge-graph-memory/search-lab). You can download WireCat Desktop [on the site](/en/docs/desktop).

If you set it up and something doesn't work, write in the Help topic in Telegram or in #help on Discord, I'll help. And if you run the same thing on a graphics card, I'd be glad to see the numbers.
