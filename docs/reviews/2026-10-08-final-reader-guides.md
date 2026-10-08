# Final attachment-reader release guide review

The final release pins are MAX v0.35.0 and Telegram v0.36.0. They build on the prior
[reviewed tool-guide update](2026-10-08-reviewed-tool-guides.md), whose existing translations
were preserved. MAX release source: b1aafc1372715a8ebde0b157e232929969ebd6e2, SDK186.
Telegram source:3a77a2e66a038a29be77e46284226efe0fbbd499, SDK187.
Both trusted release workflows, npm versions, exact tags and SLSA provenance were verified.

Changed attachment tables now distinguish local UTF-16/legacy encoding detection and
ODT/ODS/XLSX/PPTX/EPUB readers from scans, agent OCR and explicit bulk API OCR.
They preserve optional PDF/DOCX engines, formula/image limitations, expansion bounds,
protected agent text, voice transcription and external-model setup links.

Administrator-report translations preserve selected responders, explicit reply requirements,
unknown joining dates, coverage/freshness limitations, evidence budgets and saved selections.
Native reads/writes, quiz/folder/SMS/job changes are reflected in usage and generated references.
Retired source errata are removed only where the release already corrected the source;
the reviewed login walkthrough is retained and includes the explicit SMS option.

All117 existing translation overlays match the exact released source structure, code blocks,
inline literals and link destinations. Executable examples remain source-identical.
Changed prose was reviewed against the released additions before fingerprints advanced.
Native-language generated reference labels and existing translations remain intact.
Every release link and image points at the corresponding reviewed tag.

Validation: reviewed-release sync and localization pass; lint and209 unit tests pass;
production export, generated HTML/Markdown links and SEO pass. Browser checks and fresh
PR CI are recorded with this refresh. No paid translation/model API or live messenger action ran.
Remote attachment byte delivery is separate post-release implementation work; these pins
do not claim that the new SDK-only feature is already in the published consumer versions.
