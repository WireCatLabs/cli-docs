import { describe, expect, it } from "vitest"
import { wordsFor } from "../lib/words"

describe("agent installation requests", () => {
  for (const lang of ["en", "ru", "es"]) {
    it.each(["tg", "max"])(`${lang}: gives a short, platform-neutral setup request for %s`, (tool) => {
      const prompt = wordsFor(lang).onboarding.prompt(tool, `@wirecat/${tool}-cli`)
      expect(prompt).toContain(`npm install -g @wirecat/${tool}-cli`)
      expect(prompt).toContain(`${tool} setup --help`)
      expect(prompt).toContain(`${tool} setup`)
      expect(prompt).toContain(`${tool} doctor`)
      expect(prompt).toContain("22.16+")
      expect(prompt.split("\n")).toHaveLength(5)
      expect(prompt.split("\n").at(-1)).toContain("skill")
      expect(prompt.length).toBeLessThan(550)
      for (const noise of ["PATH", "Windows", "npm.cmd", "--agent", "--version", "https://", "install.ps1"])
        expect(prompt).not.toContain(noise)
    })
  }
})
