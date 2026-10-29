import { describe, expect, it } from "vitest"
import { wordsFor } from "../lib/words"

describe("agent installation requests", () => {
  for (const lang of ["en", "ru", "es"]) {
    it.each(["tg", "max"])(`${lang}: gives a short, platform-neutral setup request for %s`, (tool) => {
      const prompt = wordsFor(lang).onboarding.prompt(tool, `@wirecat/${tool}-cli`)
      expect(prompt).toContain(`npm install -g @wirecat/${tool}-cli`)
      expect(prompt).toContain(`${tool} setup --help`)
      expect(prompt).toContain(`${tool} personal setup`)
      expect(prompt).toContain(`${tool} personal doctor`)
      expect(prompt).toContain(tool === "tg" ? "22.19+" : "22.16+")
      expect(prompt.split("\n")).toHaveLength(5)
      expect(prompt.split("\n").at(-1)).toContain("skill")
      expect(prompt.length).toBeLessThan(550)
      for (const noise of ["PATH", "Windows", "npm.cmd", "--agent", "--version", "https://", "install.ps1"])
        expect(prompt).not.toContain(noise)
    })

    it.each([
      ["drive", "drive personal session start"],
      ["memo", "memo doctor"],
      ["zm", "zm personal session start"],
    ])(`${lang}: asks %s only for commands it has`, (tool, first) => {
      const prompt = wordsFor(lang).onboarding.prompt(tool, `@wirecat/${tool}-cli`)
      expect(prompt).toContain(first)
      expect(prompt).not.toContain(`${tool} setup`)
      if (tool === "drive") expect(prompt).not.toMatch(/drive (doctor|skill)/)
    })
  }
})
