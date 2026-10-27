---
name: blog-tags
description: Choose tags for a wirecat.dev blog post from the tag registry, or add a tag when none fits. Use when writing, translating or reviewing a post in cli-docs content/blog.
---

Tags exist only in `content/blog/tags.json`. A post lists tag **ids** in its front matter
(`tags: [ai-agents, cli]`); every language version of a post uses the same ids.

1. Run `pnpm blog:tags` in the cli-docs checkout. It prints every id, how many posts use it, its
   label, description and aliases.
2. Choose 2 to 4 ids whose descriptions match what the post is mostly about. Prefer a tag that
   already has posts over a narrower new one.
3. Write the id, never an alias or a label. The build fails on an unknown id and on an alias; the
   error names the id to use.
4. Add a tag only when none of the descriptions fits. First search the labels and aliases for your
   word and its synonyms. Then add one entry to `tags.json` in the same pull request as the post:
   - `id`: lowercase words joined by hyphens, the plain common name (`search`, not `search-stuff`).
   - `label` and a one-line `description` in English, Russian and Spanish.
   - `aliases`: the other spellings a writer might reach for (plural, abbreviation, product name).
   An alias or a label may belong to one tag only; the build fails otherwise.
5. Run `pnpm exec vitest run scripts/blog-tags.test.ts` to check the registry and every post.

Never rename or delete an id that posts use: tag pages are public URLs (`/{lang}/blog/tags/{id}`).
Merge two tags by keeping one id and moving the other id into its `aliases`, then update the posts.
