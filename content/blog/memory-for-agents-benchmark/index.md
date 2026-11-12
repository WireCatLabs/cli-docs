---
title: I benchmarked memory for AI agents, and plain files did just as well
description: "Third-party memory engines, WireCat Memo and a plain folder of files on the same questions. What the agent answers, which record it cites and what it costs, plus the public LifeBench."
date: 2026-11-12
tags: [ai-agents, benchmarks, search]
author: viacheslav-ptsarev
draft: false
---

There are a lot of memory tools for AI agents now, and almost every one promises your agent will finally stop forgetting things. I took a few popular ones, put the same agent on top of each and asked the same questions. I looked at what the agent answers, which record it cites and how much it costs.

Here's who took part:

- [Mem0](https://mem0.ai) - a cloud service, a model pulls facts out of your messages and keeps those instead of the messages.
- [Supermemory](https://supermemory.ai) - also cloud, it chunks documents for search and a model builds a graph of facts on top. Search goes over both.
- [Honcho](https://honcho.dev) - open source, it draws conclusions about each person in the conversation in the background and stores those.
- [Hindsight](https://github.com/vectorize-io/hindsight) - open source, a model pulls out facts, people and how they connect, and search runs by meaning, by keywords, over the graph and by time all at once.
- WireCat Memo - ours, runs locally, keeps the records as they are and searches by keywords and by meaning.
- And a plain folder of files that the agent searches on its own with ordinary shell commands.

Two agents, both open source - [OpenClaw](https://openclaw.ai) and [Hermes](https://github.com/NousResearch/hermes-agent) from Nous Research.

That's what I was running in early November. I'm building WireCat as local context about a person for any agent (chats, mail, notes, meetings), so for me this isn't an academic question - does our Memo make sense at all, or is a folder of files enough for an agent.

Turns out plain files were no worse. On the hardest version of my set OpenClaw with Memo answered 50 questions out of 50 and cited the right record in 46, and with files it was also 50 out of 50 with 47 citations. Memo came out a bit cheaper ($1.92 vs $2.19), but that's 1 run. The engines that store a model's summary instead of the records themselves lose either the facts or the source.

On my set the agent runs on Claude Sonnet 5.5 everywhere, I only changed the memory. All the data is synthetic, a made-up team with made-up projects.

## First try: Memo found almost nothing

I started with a small set, 2,000 records about 10 projects - messages, emails, notes and so on. Most of it is noise, and each project has a few records that matter, for example a deadline set in a chat and then moved in an email. 50 questions, 5 per project, and 10 of them about a budget that isn't in the records, where the right answer is "unknown". A script checks the answers against an answer key, no AI judge.

Right away I saw that Memo's keyword search found nothing for a question typed as a normal sentence, 50 empty results out of 50. It wanted every word of the question in one record, and obviously there's no record that has "what", "is", "current" and the project name all at once. With semantic search the right record made the top 10 in only 30% of the questions. Plus mail and notes came back interleaved, one from each in turn, and semantic search never returned a single email. OpenClaw, Supermemory and Mem0 handled the same questions fine.

The agent with Memo still answered 50 out of 50, because Sonnet rewrote the question into keywords itself. So on 2,000 short records a strong model does fine without us, and with WireCat it cost about 1.8 times more than with plain files.

I fixed the search (the question as typed, one shared list across all sources, mail by meaning), but the cost didn't go down, it actually went up. The funny part is that most of the money went to the instructions, not to search. The skill the agent reads before working with memo was 22 KB, about 8,100 tokens, and the agent read the whole thing before every question. I cut it to 3 KB, and the agent gets the rest on request (it never asked, by the way).

| Agent | Cost of 50 answers before | After | Correct before / after |
| --- | ---: | ---: | ---: |
| OpenClaw + WireCat | $2.73 | $1.45 | 50 / 50 |
| Hermes + WireCat | $2.07 | $0.98 | 50 / 50 |

OpenClaw reports its own cost, for Hermes it's counted from tokens, so compare within a row, not across agents. That's about what plain files cost ($1.33 and $0.88 on the same questions), but the gap is within the noise of one run, so I'm not going to say "cheaper than files" here.

## 10,000 records, and why Supermemory got 16 out of 50

On 2,000 records everyone answers everything, so next I made a heavier set: 10,000 records, the same 10 projects plus 2 look-alikes to confuse things. Every date moves 2-4 times, meeting recaps bring back the old date, and the names are similar (Ari Vale and Ari Vail, Amber Kite and Amber Kitchen). Mem0 got 6,500 records out of 10,000, the free plan wasn't enough for all of them, but every record with an answer made it into that part.

First just search, without an agent. Memo with keyword plus semantic search put the right record first in 72% of the questions and in the top 5 for all 40 questions that have such a record. Supermemory got 20% and 70%, Mem0 10% and 53%. Plus loading time: Memo indexed everything locally in about 2.5 minutes (with the e5-small model), Supermemory took about 14 hours to build its memory, Mem0 took 19 hours for its 6,500 records. These are free plans, I didn't check whether paid ones are faster.

Then I ran the agents on the same 50 questions:

| Memory | OpenClaw | Hermes |
| --- | ---: | ---: |
| Plain files | 50 | 49 |
| WireCat Memo | 50 | 45 |
| Mem0 (6,500 records) | 42 | 35 |
| Supermemory | 16 | 16 |

For Hermes with WireCat 4 of the 5 misses are the right answer plus a note in brackets, and the check is exact, so they count as wrong. Supermemory's 16 is actually worse than it looks, 10 of them are the budget questions where the right answer is "unknown", everyone gets those. So on the other 40 questions it's 6 correct.

I think this shows the main problem with memory that stores a model's summary instead of the records. Out of 10,051 documents Supermemory kept 1,585 memories, and the agent plugins search only those. The agents didn't find the project owner in any of the 10 questions, though for 6 of them the owner never changed, so it's not only about dates. Looks like they just aren't among the memories (that's my conclusion, I didn't verify it). And Supermemory's own search over documents found every owner in the top 10, the agent just never sees that search.

By the way, the first OpenClaw run with Mem0 never reached Mem0 at all. OpenClaw's built-in memory, marked as disabled, still held the tool names memory_search and memory_get, the plugin's tools got dropped, and the name conflict warning went only to stderr. The agent dutifully searched an empty index and answered "unknown" to every project question. Anyone who installs this plugin on the same OpenClaw version will get the same thing.

## Money, calendar and reworded questions

Then I made the questions harder. The third version has 10,444 records and 50 questions of 21 types, now with a price after a revision, partial payments, a meeting that was cancelled and then put back, and so on. And I rewrote 18 questions so they don't share a single phrase with the record ("rented servers" instead of "hosting agreement").

I ran each agent and memory pair once. Hermes's cost is counted from tokens, OpenClaw reports its own:

| Setup | Correct out of 50 | With the right source | Cost of 50 answers |
| --- | ---: | ---: | ---: |
| OpenClaw + WireCat Memo | 50 | 46 | $1.92 |
| OpenClaw, files | 50 | 47 | $2.19 |
| OpenClaw + Honcho | 50 | 4 | $2.29 |
| Hermes + Honcho | 50 | 4 | ~$3.19 |
| Hermes + WireCat Memo | 49 | 30 | ~$1.49 |
| Hermes, files | 49 | 35 | ~$2.41 |
| OpenClaw + Hindsight | 43 | 34 | $2.34 |
| Hermes + Hindsight | 37 | 8 | ~$4.56 |
| OpenClaw + Supermemory | 19 | 4 | $1.71 |
| Hermes + Supermemory | 18 | 4 | ~$3.70 |

Honcho answers everything, but its conclusions don't keep the record's name, so the agent can only cite a source where the answer is "unknown".

Hindsight scored 4 out of 50 in the first runs, because the agents never got to the memory. Hermes wants one specific old version of the Hindsight client and just doesn't see the newer one I had installed. And the OpenClaw plugin refused to work in a session with no message source. The table shows the second runs.

This time Mem0 didn't run at all, it returned HTTP 429 on every request, I think the free plan's monthly limit ran out. And I never got Cognee built: 3 graph builds in a row failed, and the last one, after an hour and a bit, said its store had hit a 32 GiB limit, while its folder held about 0.5 GB.

I screwed up here too. At first every agent "missed" the same 2 questions. The answers were right, the key was wrong: the generator sometimes wrote a duplicate story for another project, so one subject ended up with 2 stories. I fixed the key, the generator now fails on this, and all numbers above use the fixed key.

Separately I looked at search without an agent on 17 of the rewritten questions, the ones that have a source record (the share of questions with the right record in the top 10). Once the words don't match, keyword search drops from 0.91 to 0.14. Memo started the day at 0.48, Honcho 0.76, Supermemory 0.88, but that's its search over documents, not what its agents see. And the same e5-small model that sits in Memo scored 0.71 on its own (at full precision though, in Memo it's quantized to 8 bits), i.e. most of the loss wasn't in the model, it was in how Memo ranks and merges results.

And then another bug popped up, again in my benchmark. The loading script gave every email in Memo the sender "Synthetic Sender" and the record number instead of a subject. Memo puts the sender and subject into the vector along with the text, so the same line sat in every email, while the other engines got clean text. So I was measuring my own product with a handicap I'd given it myself. The agent runs in the table above, by the way, still used the old email headers.

Here's how it changed step by step, on the same 17 questions:

| What changed | In the top 10 |
| --- | ---: |
| Memo at the start of the day | 0.48 |
| every email gets its own sender and subject (benchmark fix) | 0.53 |
| shared search no longer takes turns between sources | 0.62 |
| keyword-only hits get a comparable score, so exact matches don't get lost | 0.59 |
| email text without the sender line in front | 0.65 |
| the EmbeddingGemma 300M model inside Memo | 0.79 |
| plus rewriting records with a model at write time (turned on separately) | 0.94 |

The step from 0.62 to 0.59 made it worse, and I kept it anyway, otherwise exact word matches sank to the bottom. The rows come from different builds, so these are steps, not one clean series. The last step has downsides. gpt-4o-mini rewrites the records, so they go to OpenAI (about $0.60 per 10,000 records), and a question in the record's own words finds it first less often (0.41 instead of 0.54), though top 5 and top 10 don't get worse.

EmbeddingGemma is now the default model. It indexes 5 times slower than e5-small, and its license is the Gemma Terms, not MIT, you accept them when downloading it. But none of the bigger free models I tried beat it, bge-m3 at best tied.

## LifeBench: someone else's benchmark instead of mine

I made up my own set, and I can't publish a benchmark on my real chats, plus they aren't representative, so I went looking for existing benchmarks and found [LifeBench 2.0](https://github.com/1754955896/LifeBench). It's 1 year of a person's life, phone data (texts, calendar, photos and so on), 10 made-up people and 3,380 questions in total, and for every question you know which records hold the answer. A pretty relevant dataset.

First I put the same OpenClaw with Sonnet on it, 46 questions about one person. Memo 93%, files 96%. A 1-question difference on that volume means nothing, but files were also 16% cheaper and 30% faster at the median, and the files agent never called memory search once, it just ran shell commands over 4,986 small files with a date in each. Plus Memo has a long tail: one question with no answer ate 176 tool calls, 4 minutes and $0.46 before the agent gave up. I think on years of real mail the files trick will stop working, but here it did.

When the agent can search as much as it wants, weak search doesn't show, so next I did it the LifeBench leaderboard way: one Memo search, the first 20 records go into 1 model call, DeepSeek-V4-Flash answers, deepseek-chat judges with LifeBench's own prompt. 2 people, 700 questions, search sees only records dated before the question.

| System (DeepSeek-V4-Flash answers) | Micro | Macro (mean of 9 types) |
| --- | ---: | ---: |
| Answer from the right records (ceiling) | 97.6 | 96.5 |
| Memo + EmbeddingGemma | 77.7 | 74.5 |
| Memo + e5-small | 75.3 | 72.0 |
| Hindsight (published, all 10 people) | 72.0 | 66.6 |
| Mem0 (published, all 10 people) | 61.5 | 55.0 |

My ceiling came out at 97.6 against the published 97.3, so the setup itself reproduces. But you can't compare this directly with the leaderboard. I have 2 people out of 10, and the store holds the whole year from the start (only search is limited by date, while the leaderboard loads records day by day), plus small differences in the record format and the judge prompt. And Memo here is still an older build, before the latest search fixes.

And one thing I don't really like. Hindsight is ahead on precisely the questions where a fact changed over time, 85.1 vs 79.8. So on the very topic this whole post is about, it's better for now.

Separately I measured the noise, on 70 questions per person for each model. Same question, same 20 records in the same order, temperature 0, answer and judge again - 49 verdicts out of 280 change, about 1 in 6. Only 39 answers out of 280 matched word for word. The changes go both ways and cancel out, so the total over hundreds of questions holds within about 1 point, but a single verdict means nothing.

Picking the embedding model shows this well. On the first 46 questions (still with 40 records in context back then) Gemma lost to e5-small, 37 vs 39, and on all 700 it won, 78% vs 74% on the whole-year run (p = 0.045, borderline). The win is probably real but small, and you can't pick a model on 46 questions.

By the way, in one question where the files agent was marked wrong, the mistake seems to be in the key itself, the agent found a faster 10 km run in the records than the one listed as the personal best.

## What I didn't measure

- **Mem0 on the third version of questions, and Cognee.** Mem0 hit 429, Cognee didn't build. I measured Graphiti by search only, no agent.
- **More than one agent run.** Cost differences of tens of cents between setups are most likely within noise.
- **Tuning other engines.** Competitors ran on almost default settings (in OpenClaw I turned off auto-capture and auto-recall in the memory plugins so the store didn't change between questions, and Hermes with Mem0 still wrote to memory every turn), while I was fixing and releasing my own Memo during the test.
- **All of LifeBench.** 2 people out of 10, English only, not loaded day by day.
- **Real data and Russian.** All records are made up. I compared models on Russian separately, that's another story.
- **Weak and local models as the agent.** On my set a strong model (Sonnet) answered everywhere, and with it a folder of files answers almost everything.

Overall, at this size an agent finds the answer with files too, the difference is how much it costs and whether it can show where the answer came from. And that's where memory that stores a summary instead of the original record loses.

Next I want to write about a couple more things from these tests. First, rewriting records with a model at load time - it took search on reworded questions from 0.79 to 0.94, but it has a cost, and not only in money. Second, why a bigger embedding model isn't better: the 300M EmbeddingGemma beat everything I tried, including models twice its size. And most of all I want to finally run the test on a hundred thousand records over several years, where I think files will start to fall behind. We'll see if I'm right.

All the data, scripts and tables are in the public [cli-testing](https://github.com/WireCatLabs/cli-testing) repo: [memory for agents](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/knowledge-graph-memory) and [LifeBench](https://github.com/WireCatLabs/cli-testing/tree/main/performance/agents/lifebench). WireCat itself is at [wirecat.dev](https://wirecat.dev). If your numbers on your own data are different, tell me, I really want to understand where my benchmark lies.
