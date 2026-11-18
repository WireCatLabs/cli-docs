---
title: How I made a reranker faster on my own machine
description: When I turned the reranker on by default, WireCat's meaning search went from 1.9 to 5.1 seconds. Batching barely helped and changed the scores, native ONNX Runtime made scoring 2x faster, not 10x, and the Windows DLL I needed was only inside an npm tarball.
date: 2026-11-18
tags: [search, benchmarks, cli]
cover: ./cover.jpg
coverAlt: "A stack of 50 printed messages banded as top 50, one read under a loupe, 5 laid out in order with the first marked green, a stopwatch at 3.2 seconds"
author: viacheslav-ptsarev
series: laptop-search
glance:
  - value: "4.6 s → 3.2 s"
    label: "--discover on a real archive, WebAssembly and native"
    href: "#native-made-scoring-2x-faster-not-10x"
  - value: "≤ 15%"
    label: "the most batching saved, and the scores moved"
    href: "#batching-saved-15-and-moved-the-scores"
  - value: "113.5 MB"
    label: "the npm tarball I take one Windows DLL out of"
    href: "#on-windows-the-dll-had-to-come-out-of-an-npm-tarball"
  - value: "5 + Alpine"
    label: "systems where CI runs the models natively, Alpine stays on WebAssembly"
    href: "#on-windows-the-dll-had-to-come-out-of-an-npm-tarball"
draft: false
---

When I turned the reranker on by default in WireCat search, `search messages --discover` on my archive went from 1.9 to 5.1 seconds. I tried the 2 obvious things: batching, and native ONNX Runtime instead of WebAssembly. Batching barely helped and changed the scores on top of that, and native made scoring 2x faster, while my estimate said 4-10x. And on Windows the DLL I needed was only inside a 113.5 MB npm tarball, so I had to take it out of there.

`--discover` finds candidates by meaning and by words, then a small mMARCO model (8-bit) reads the top 50 and puts them in order, that's the reranker. It all runs locally on the user's machine, no cloud.

## Batching saved 15% and moved the scores

First I tried not running the model 50 times, one pair (question and message) at a time, but giving it pairs in batches. In WebAssembly that saved 15% at most, and only with the pairs sorted by length. With pairs of different lengths in one batch it got even slower, because every pair is padded to the longest one and the padding costs as much as real text.

And the scores changed. The same pair got 0.04 on its own, 0.48 padded to 200 tokens and 0.34 next to one other pair. I think the 8-bit model sets its value range from the whole input of each run (dynamic quantization), so the neighbours in a batch move the score. That's a guess, I didn't dig deeper. But even if the cause is something else, the order of results would depend on which messages happened to share a batch, so I kept one pair per run.

| 50 pairs of different lengths | Time | Largest score change |
| --- | ---: | ---: |
| One by one | 1.54 s | |
| Batches of 5, sorted by length | 1.33 s | 1.01 |
| Batches of 5, in arrival order | 2.12 s | 0.78 |
| One batch of 50 | 2.37 s | 0.85 |

The text in this run is synthetic, scores are in logits. The fastest option also moves the scores more than the others in the table, and batches of 25 moved them by up to 1.34. I measured only in WebAssembly, whether native batches behave the same I didn't check.

## Native made scoring 2x faster, not 10x

Next I ran the same models through ONNX Runtime's native library instead of WebAssembly. I expected 4-10x, because the Python version scored 50 short synthetic pairs in 0.2 seconds, while WebAssembly took 0.9-1.7 on my side. But I was comparing different runtimes from different runs. When I ran Node with the native library and WebAssembly on the same pairs, it was 0.25-0.30 seconds against 0.60, so 2-2.4x.

On a real archive it came out the same. The reranker reads more than the message, it also gets the chat, the author and the message it replies to, so the median was 153 tokens against 48 in the synthetic set, and every tenth pair was longer than 762. Per pair native is 2-2.5x faster, but the whole `--discover` went from 4.58 to 3.20 seconds (median of 18 calls), so 30%. The rest is loading the models and tokenizers (17 MB of JSON, the same in both runtimes), garbage collection and the search itself.

The answers stayed the same. On my 6 known questions the direct answer was in the top 5 either way, and 29 of the 30 top-5 hits matched. Near-ties sometimes swap places, because the runtimes score the same pair slightly differently. The starting point here is 4.58, not 5.1, because it's another build and another load on the machine, so a comparison with 5.1 is only rough.

I also noticed that the reranker sometimes never saw the hit at all. I measured this separately, on one chat. There, in 18 of 119 pairs with a reply, the message it replied to took all 512 of the model's tokens. I cut it to 300 characters, I'll write about that separately. With both changes `--discover` in max 0.81.0 took 2.91 seconds natively and 4.10 through WebAssembly.

## Shipping native without new packages

The usual way to ship a native library through npm is a separate package per platform. I didn't want more packages and a bigger install for people who never download models. `onnxruntime-node` itself is 288 MB unpacked, because it has the libraries of every system in it.

For each platform it has 2 parts: a 0.3-0.4 MB binding and the library. The binding looks for the library in its own folder, and I used that - the bindings went into `@wirecat/cli-core-onnx`, which is published anyway, and the library is downloaded with the models from Microsoft's official release and checked against a pinned sha256. Search never downloads anything, the library shows up only after `models download`, and if it's missing or doesn't load, everything runs through WebAssembly as before. I checked the scores on 450 pairs, with the library from Microsoft's release they matched the npm one bit for bit.

## On Windows the DLL had to come out of an npm tarball

On Windows that trick didn't work. The Windows binding takes a function from `onnxruntime.dll` not by name but by number 4, and that's the DirectML function (DirectML is the Windows layer for the graphics card). Microsoft's release has the plain CPU build without it, and Windows answered the load with just "The operating system cannot run %1", not a word about what's missing.

The only place I found the DirectML build of 1.30.0 was inside `onnxruntime-node`'s own npm tarball, which is 113.5 MB. NuGet has it too, but only up to 1.24.4. So on Windows `models download` fetches that tarball once, takes one DLL out of it and checks it against a pinned sha256. DirectML.dll itself loads only when needed, so the CPU path works without it. A bit hacky, sure, but no new packages.

Before this, CI ran only a tiny test model through the npm package, and nothing checked `models download` and what actually runs for the user after it. Now a separate workflow downloads the library and runs 2 tiny test models natively on 5 systems: Linux and Windows on x64 and arm64, plus macOS on Apple silicon. On Alpine, which has no build, it checks that native isn't even offered and everything goes through WebAssembly. Intel Macs stay on WebAssembly too, the package has no library for them (and CI doesn't cover them either).

## What I'd do differently

- I'd compare runtimes on the same pairs and at the real input length. My 4-10x came from comparing different runs.
- I wouldn't batch a quantized model if the scores of different pairs have to be compared with each other.
- A native library can be downloaded on demand, with a pinned hash and WebAssembly for when it doesn't load. I never needed a package per platform.
- Files being in a package doesn't mean the library loads. For me that's now checked by CI, which really runs a model on each of the 5 systems.

## What I didn't measure

- Native speed on Windows, macOS and Linux arm64. CI checks that it works there, but doesn't time it.
- The MCP server, where the models are already loaded and only scoring gets faster.
- A model without quantization (fp32), which shouldn't depend on its batch neighbours but is bigger and slower.

The synthetic runs, their setup and scripts are in [cli-testing](https://github.com/WireCatLabs/cli-testing/blob/main/performance/search/rerank-speed/README.md), you can repeat them. From my real archive there are only totals, the questions and per-question rows stay private. If native came out faster for you on long texts, tell me what you measured on and I'll compare with my numbers.
