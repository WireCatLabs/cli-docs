import { describe, expect, it } from "vitest"
import { wordsFor } from "../lib/words"

describe("agent installation requests", () => {
  for (const lang of ["en", "ru", "es"]) {
    it.each(["tg", "max"])(`${lang}: prepares %s through npm and verifies PATH/skill before login`, (tool) => {
      const guide = "https://wirecat.dev/llms.mdx/docs/installation/content.md"
      const prompt = wordsFor(lang).onboarding.prompt(tool, `@leemour/${tool}-cli`, guide)
      expect(prompt).toContain(`npm install -g @leemour/${tool}-cli`)
      expect(prompt).toContain("npm.cmd prefix -g")
      expect(prompt).toContain(`${tool} skill install --for all`)
      expect(prompt).toContain(`${tool} skill show`)
      expect(prompt).toContain(`${tool} --version`)
      expect(prompt).toContain(guide)
      expect(prompt).not.toContain("install.ps1")
      expect(prompt).not.toContain("Invoke-RestMethod")
    })
  }
})
