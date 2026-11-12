# Blog covers

Every post has a 1600×900 JPEG cover next to it (`content/blog/<slug>/cover.jpg`) and a `coverAlt` in each
language's frontmatter.

## Release posts: the card

A dark card with the WireCat mark, «Desktop», the version and a dark app screenshot, one per language
(`cover.jpg`, `cover.ru.jpg`, `cover.es.jpg`). [release-card.html](release-card.html) is the card;
[render.mjs](render.mjs) fills it, screenshots it with Playwright and writes JPEG quality 82.

```sh
node design/blog-covers/render.mjs wirecat-desktop-0-7 0.7 box 226,60,1179,656 \
  design/desktop-screenshots/png/wirecat-contacts-dark-{lang}-1440x900.png
```

- The screenshot path has `{lang}`; take the dark theme. [desktop-screenshots](../desktop-screenshots/MANIFEST.md)
  has showcase shots with made-up data.
- The crop is `left,top,width,height` in the screenshot's pixels. Cut the sidebar off, and keep MAX out of the en and
  es crops (MAX is shown only to Russian visitors).
- `box`: a framed screenshot centred on the right, for a wide strip. `bleed`: a big screenshot that runs off the
  right and bottom edges, for a whole page.

## Articles: a generated picture

Articles use an image from OpenAI `gpt-image-2` (1536×1024, quality high), cropped to 16:9, resized to 1600×900,
JPEG quality 82–86. The prompt is in the commit that adds the cover. What worked:

- show the post's idea as objects (a comparison, a measurement), not a generic office or stack of paper;
- dark charcoal background with a faint violet tint, like the site;
- «no readable words, letters or numbers, no logos, no people»: the model draws broken text otherwise.
