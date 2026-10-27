---
title: The reranker never saw the message it was scoring
description: On real chats, one reply in seven had a parent long enough to push the hit out of the reranker's window. Cutting the parent to 300 characters fixed it and saved 40% of the work.
date: 2026-10-27
tags: [search, benchmarks]
cover: ./cover.jpg
coverAlt: "A printed chat under a black reading mask labelled 512 tokens: the window shows only one long message under a loupe, while a green note with the short reply sits half hidden below the mask"
draft: true
---

`search messages --discover` is meaning search over a messenger archive. It finds candidates by meaning
and by words, then a small model, the reranker, reads the top 50 and puts them in order. The reranker
reads a question and one passage at a time and gives the pair a score.

A chat message alone is often too short to judge. "Yes, send it Friday" means nothing without the message
it answers. So each passage was built like this: the chat, the author and the date, then the message
being replied to, then the hit itself. The model reads at most 512 tokens, and the input was cut to fit.

## The window ended before the hit

The parent came first and the hit came last. When the parent was long, the cut took the end of the
input, and the end was the hit.

On one real chat, 18 of the 119 pairs that had a parent were like that: the parent alone was longer than
the window. For those pairs the reranker scored the message being replied to. It never saw the message
that was found.

Nothing looked broken. The answers to the known questions were still near the top, because the parent
and the reply are usually about the same thing. The bug showed up only when we counted tokens per pair.

## Why the test set did not catch it

Our synthetic evaluation set has replies and parents too, but its longest pair is under 256 tokens, and
its median is 38. Real pairs have a median of 153 tokens, and one in ten is longer than 762. A test set
made of short, tidy messages cannot fail this way.

## Nine ways to cut the input

We ran the six questions we know the answers to on that chat, with nine forms of the input; six are
shown below, the other three combine them. We counted the questions that keep a direct answer in the top
five, and the CPU time per call.

| Input | Direct answer in top 5 | CPU per call |
| --- | ---: | ---: |
| Parent, then hit, cut at 512 tokens (before) | 6 of 6 | 27.1 s |
| Cut at 256 tokens | 6 of 6 | 16.3 s |
| Cut at 128 tokens | 6 of 6 | 12.9 s |
| Hit, then parent | 6 of 6 | 22.6 s |
| **Parent cut to 300 characters, then hit** | **6 of 6** | **16.0 s** |
| No parent at all | 5 of 6 | 14.9 s |

Dropping the parent lost an answer, so the context matters. A shorter token cap also kept the answers,
but it still cuts from the end, so a long enough parent can push the hit out again. Cutting only the
parent, to 300 characters, kept every answer, made sure the hit is always inside the window, kept the
most relevant hits in the top fives (26 of 30), and cost about 40% less CPU.

## What changed

Core now cuts the replied-to message to 300 characters before it builds the pair. The reranker always
reads the hit, with enough of the parent to know what it answers.

Six questions on one chat is a small sample. The point is less the exact number than the shape of the
failure: a model input that is cut from the end, with the important part placed last.

## Notes

- The measurements, the setup and the scripts:
  [reranker speed, "Reranker input"](https://github.com/WireCatLabs/cli-testing/blob/main/performance/search/rerank-speed/README.md#reranker-input-how-much-of-the-replied-to-message).
- Real messages were used only as totals; the questions and the per-question rows stay private.
