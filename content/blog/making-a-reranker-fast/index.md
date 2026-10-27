---
title: Making a reranker fast on a laptop, in four acts
description: Batching a quantized reranker changed its answers, not its speed. A native runtime made it 2× faster, not 10×. Shipping that runtime took no new npm packages, and on Windows the library we needed was only inside an npm tarball.
date: 2026-10-27
tags: [search, benchmarks, cli]
cover: ./cover.jpg
coverAlt: "A laptop showing 4.6 s and 3.2 s bars, a stopwatch, and five small computers labelled linux x64, linux arm64, macos arm64, windows x64 and windows arm64, each with a green light"
draft: true
---

Our CLIs search a messenger archive on the owner's own machine. `search messages --discover` finds
candidates by meaning and by words, then a small reranker model (mMARCO, 8-bit) reads the top 50 and
orders them. When the reranker became the default, `--discover` went from 1.9 s to 5.1 s on a real
archive. These are the four things we did about it, and what each one taught us.

## Act one: batching changed the answers, not the speed

The obvious fix is to score the 50 pairs in batches: one model run for many pairs instead of one run per
pair. In WebAssembly it saved at most about 15%, and only with pairs sorted by length. Mixed lengths were
slower, because every pair is padded to the longest one and the padding costs as much as the text.

Worse, the scores moved. The same pair scored 0.04 alone, 0.48 when padded to 200 tokens, and 0.34 next
to one other pair. The 8-bit model probably sets its range from the whole input of each run, so the
neighbours in a batch change a pair's score. A ranking that depends on which hits share a batch is not
a ranking. We kept one pair per run.

| Scoring 50 mixed pairs | Time | Largest score change |
| --- | ---: | ---: |
| One by one | 1.54 s | — |
| Batches of 5, sorted by length | 1.33 s | 1.01 |
| One batch of 50 | 2.37 s | 0.85 |

## Act two: native was 2× faster, not 10×

Next we ran the same models through ONNX Runtime's native library instead of its WebAssembly build. A
short-text benchmark promised 4–10×. On the real archive, `--discover` went from 4.58 s to 3.20 s, with
a direct answer in the top five for 6 of 6 known questions on both runtimes.

The gap is the input length. Real reranker inputs carry the chat, the author, the date and the message
being replied to: a median of 153 tokens, and one in ten longer than 762. The synthetic set's median was
48. Per pair, native was 2–2.5× faster. Benchmarks on short text overstate the gain for long text.

A later fix cut the replied-to message to 300 characters (that story is its own post). With both
changes, the released CLI ran `--discover` in 2.91 s natively against 4.10 s through WebAssembly.

## Act three: no new packages

The usual way to ship a native library to npm users is one package per platform. We did not want five
new packages to publish, or a bigger install for people who never download a model.

The npm package `onnxruntime-node` has two parts per platform: a 0.4 MB connector
(`onnxruntime_binding.node`) and the library itself. The connector looks for the library in its own
folder. So the connectors ride inside a package we already publish, and the library is downloaded with
the models, from Microsoft's official release archive, checked against a pinned sha256 hash. A search
never downloads anything; the library arrives only when the user runs `models download`. If it is
missing or does not load, the models run through WebAssembly as before. On 450 pairs the scores matched
the npm package's own library exactly.

## Act four: the Windows library was only inside an npm tarball

The same trick failed on Windows. The Windows connector imports one function from `onnxruntime.dll` by
number, not by name: ordinal 4, the setup function for DirectML, Windows' GPU layer. Microsoft's release
DLL is the plain build, without that function, so the connector refused to load it.

The DirectML build of version 1.30.0 is not in Microsoft's release archive, and its NuGet package stops
at an older version. We found it in one place: inside `onnxruntime-node`'s own 113.5 MB npm tarball. So on
Windows, `models download` fetches that tarball once, keeps the one DLL, and checks it against its own
pinned hash. The DirectML part loads only if it is used.

Then we checked it for real. A new CI workflow downloads the library and runs two tiny test models
natively on Linux x64 and arm64, macOS on Apple silicon, Windows x64 and Windows arm64. It also checks
that Alpine Linux, which has no build, is offered nothing and stays on WebAssembly. All six pass; the
Windows jobs take 1.5–2 minutes.

## What we would tell someone doing the same

- Measure on your real input lengths. Short synthetic text made the native runtime look up to five times
  better than it was.
- Do not batch a dynamically quantized model if its scores must be comparable across pairs.
- A native library can be downloaded on demand, pinned by hash, with WebAssembly as the fallback. You
  may not need a package per platform.
- Check the library on every system in CI. Reading the package listing is not the same as loading it.

## Notes

The measurements, the setup and the scripts are public:
[reranker speed](https://github.com/WireCatLabs/cli-testing/blob/main/performance/search/rerank-speed/README.md).
Real messages were used only as totals; the questions and the per-question rows stay private.
