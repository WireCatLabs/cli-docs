import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import Link from "next/link"
import { InstallTool } from "@/components/install-tool"
import { Screenshot } from "@/components/screenshot"
import { CopyText } from "@/components/text-snippet"
import type { Tool } from "@/lib/shared"
import { toolInstallationGuide } from "@/lib/tool-installation"

export function installationReferenceTitle(lang: string) {
  return toolInstallationGuide("tg", lang).reference
}

export function ToolInstallationIntro({ tool, lang }: { tool: Tool; lang: string }) {
  const guide = toolInstallationGuide(tool.name, lang)
  return (
    <>
      <p>{guide.intro}</p>
      <h2 id="agent-installation">{guide.title}</h2>
      {guide.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id}>
          <h3 id={section.id}>{section.title}</h3>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.command && <CopyText lang={lang} text={section.command} />}
          {section.request && (
            <div className="not-prose my-5">
              <InstallTool tool={tool} lang={lang} request={section.request} />
            </div>
          )}
          {section.steps && (
            <ol>
              {section.steps.map((step) => (
                <li key={step.text}>
                  {step.text}
                  {step.screenshots.map((image) => (
                    <Screenshot key={image.target} {...image} lang={lang} />
                  ))}
                </li>
              ))}
            </ol>
          )}
          {section.fallback && (
            <div data-installation-login-help>
              <Accordions>
                <Accordion title={section.fallback.title}>
                  {section.fallback.command && <CopyText lang={lang} text={section.fallback.command} />}
                  {section.fallback.steps.length > 0 && (
                    <ol>
                      {section.fallback.steps.map((step) => (
                        <li key={step.text}>
                          {step.text}
                          {step.screenshots.map((image) => (
                            <Screenshot key={image.target} {...image} lang={lang} />
                          ))}
                        </li>
                      ))}
                    </ol>
                  )}
                  {section.fallback.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </Accordion>
              </Accordions>
            </div>
          )}
          {section.recovery && (
            <ul>
              {section.recovery.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.links.map((link) => (
            <p key={link.href}>
              <Link href={link.href}>{link.label} →</Link>
            </p>
          ))}
        </section>
      ))}
      <h2 id="installation-reference">{guide.reference}</h2>
    </>
  )
}
