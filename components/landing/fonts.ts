import { Anybody, Fira_Sans_Extra_Condensed, JetBrains_Mono, Onest } from "next/font/google"

const anybody = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anybody", display: "swap" })
// Anybody has no Cyrillic, so Russian headings use one face for both scripts instead of mixing two.
const firaCondensed = Fira_Sans_Extra_Condensed({
  subsets: ["latin", "cyrillic"],
  weight: ["800", "900"],
  variable: "--font-fira-condensed",
  display: "swap",
  preload: false,
})
const onest = Onest({ subsets: ["latin", "cyrillic"], variable: "--font-onest", display: "swap" })
const jetbrains = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains", display: "swap" })

export const fontVariables = [anybody, firaCondensed, onest, jetbrains].map((font) => font.variable).join(" ")
