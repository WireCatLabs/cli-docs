"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "fumadocs-ui/components/ui/tabs"
import { ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import { Fragment, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  type DesktopFile,
  type DesktopRelease,
  detectOs,
  fetchReleases,
  type Platform,
  releasesPage,
} from "@/lib/desktop-releases"
import { downloadWords, sourceLinks } from "@/lib/download"

const platforms: Platform[] = ["macos", "windows", "linux"]

function rich(text: string): ReactNode {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, index) => {
    const key = `${index}-${part}`
    if (part.startsWith("`")) return <code key={key}>{part.slice(1, -1)}</code>
    if (part.startsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>
    return <Fragment key={key}>{part}</Fragment>
  })
}

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="animated-text-link text-link" href={href} target="_blank" rel="noopener noreferrer">
      <span className="link-label">{children}</span>
      <ArrowRight aria-hidden="true" />
    </a>
  )
}

export function DownloadView({ lang, initial }: { lang: string; initial: DesktopRelease[] }) {
  const words = downloadWords(lang)
  const links = sourceLinks(lang)
  const [releases, setReleases] = useState(initial)
  const [firstLaunch, setFirstLaunch] = useState<string>("macos")
  const main = useRef<HTMLElement>(null)

  const returnToHash = useRef<Platform | null>(null)

  // The inline script runs only on a full page load; after an in-site link it never runs.
  useLayoutEffect(() => {
    const wrapper = main.current?.closest<HTMLElement>(".wirecat-download")
    if (!wrapper) return
    if (!wrapper.dataset.os) wrapper.dataset.os = detectOs(navigator)
    const os = wrapper.dataset.os as Platform
    // A link to #windows or #linux has already opened its own tab.
    if (os === "macos" || !platforms.includes(os) || platforms.includes(location.hash.slice(1) as Platform)) return
    returnToHash.current = os
    setFirstLaunch(os)
  }, [])

  // The browser has already scrolled to #updates over the server's macOS panel; a taller panel would push it away.
  useLayoutEffect(() => {
    if (returnToHash.current !== firstLaunch) return
    returnToHash.current = null
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
  }, [firstLaunch])

  useEffect(() => {
    const controller = new AbortController()
    fetchReleases({ signal: controller.signal }).then((fresh) => {
      if (fresh?.length) setReleases(fresh)
    })
    return () => controller.abort()
  }, [])

  const size = (bytes: number) =>
    new Intl.NumberFormat(lang, { style: "unit", unit: "megabyte", maximumFractionDigits: 1 }).format(bytes / 1e6)
  const date = (iso: string) =>
    new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso))
  const [latest, ...earlier] = releases
  const filesFor = (release: DesktopRelease, platform: Platform) =>
    release.files.filter((file) => file.platform === platform)
  const fileName = (format: DesktopFile["format"]) =>
    latest?.files.find((file) => file.format === format)?.name ?? `*.${format}`

  const meta = (release: DesktopRelease, file?: DesktopFile) => (
    <p className="download-meta">
      {words.version(release.version)}
      {file ? ` · ${size(file.size)}` : ""} · {words.released(date(release.date))} ·{" "}
      <External href={release.notes}>{words.notes}</External>
    </p>
  )

  const fileLink = (file: DesktopFile) => (
    <a className="download-file animated-text-link" href={file.url} key={file.name}>
      <Download aria-hidden="true" />
      <span className="link-label">{words.formats[file.format].label}</span>
      <span className="download-file-note">
        {words.formats[file.format].note} · {size(file.size)}
      </span>
    </a>
  )

  const primary = (platform: Platform) => {
    if (!latest) return null
    const [main, ...more] = filesFor(latest, platform)
    if (!main) return null
    return (
      <div className="download-primary" data-platform={platform} key={platform}>
        <a className="button download-button" href={main.url}>
          <Download aria-hidden="true" />
          {words.downloadFor[platform]}
        </a>
        <p className="download-format">
          {words.formats[main.format].label} · {words.formats[main.format].note}
        </p>
        {meta(latest, main)}
        {more.length > 0 && (
          <div className="download-more">
            <p>{words.linuxMore}</p>
            {more.map(fileLink)}
          </div>
        )}
      </div>
    )
  }

  return (
    <main id="main" className="wrap download-page" ref={main}>
      <header className="download-intro">
        <h1>{words.title}</h1>
        <p className="intro">{words.intro}</p>
        <p className="download-free">{words.free}</p>
      </header>

      <section className="download-latest" aria-label={words.title}>
        {latest ? (
          <>
            {platforms.map(primary)}
            <div className="download-choice">
              <p className="download-mobile">{words.mobile}</p>
              <p className="download-choose">{words.choose}</p>
              <div className="download-grid">
                {platforms.map((platform) => (
                  <section className="download-card" key={platform} aria-label={words.platforms[platform]}>
                    <h2>{words.platforms[platform]}</h2>
                    {filesFor(latest, platform).map(fileLink)}
                  </section>
                ))}
              </div>
              {meta(latest)}
            </div>
          </>
        ) : (
          <div className="download-failed">
            <p>{words.failed}</p>
            <a className="button" href={releasesPage} target="_blank" rel="noopener noreferrer">
              {words.openReleases}
            </a>
          </div>
        )}
      </section>

      {latest && (
        <section className="download-other" aria-labelledby="other-systems">
          <h2 id="other-systems">{words.otherSystems}</h2>
          {platforms.map((platform) => (
            <div className="download-row" data-platform={platform} key={platform}>
              <h3>{words.platforms[platform]}</h3>
              <div>{filesFor(latest, platform).map(fileLink)}</div>
            </div>
          ))}
        </section>
      )}

      <section className="download-section" aria-labelledby="earlier-versions">
        <h2 id="earlier-versions">{words.earlierTitle}</h2>
        {earlier.length > 0 ? (
          <details className="download-earlier">
            <summary>{words.earlier(earlier.length)}</summary>
            {earlier.map((release) => (
              <div className="download-release" key={release.version}>
                {meta(release)}
                <div>{release.files.map(fileLink)}</div>
              </div>
            ))}
          </details>
        ) : (
          <p>{words.earlierEmpty}</p>
        )}
        <External href={releasesPage}>{words.allReleases}</External>
      </section>

      <section id="first-launch" className="download-section" aria-labelledby="first-launch-title">
        <h2 id="first-launch-title">{words.unsigned.title}</h2>
        <p>{words.unsigned.intro}</p>
        <Tabs className="download-tabs" value={firstLaunch} onValueChange={(value) => setFirstLaunch(String(value))}>
          <TabsList className="download-tablist" activateOnFocus aria-labelledby="first-launch-title">
            {platforms.map((platform) => (
              <TabsTrigger className="download-tab" value={platform} key={platform}>
                {words.platforms[platform]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent className="download-panel" value="macos" id="macos" keepMounted>
            <ol>
              {words.unsigned.macos.steps.map((step) => (
                <li key={step}>{rich(step)}</li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent className="download-panel" value="windows" id="windows" keepMounted>
            <ol>
              {words.unsigned.windows.steps.map((step) => (
                <li key={step}>{rich(step)}</li>
              ))}
            </ol>
            <External href={links.smartScreen}>{words.unsigned.windows.source}</External>
            <p>{rich(words.unsigned.windows.smartAppControl)}</p>
            <External href={links.smartAppControl}>{words.unsigned.windows.smartAppSource}</External>
          </TabsContent>
          <TabsContent className="download-panel" value="linux" id="linux" keepMounted>
            <ol>
              {words.linux.appimage.map((step) => (
                <li key={step}>{rich(step.replace("{appimage}", fileName("appimage")))}</li>
              ))}
            </ol>
            <p>{rich(words.linux.fuse)}</p>
            <External href={links.fuse}>{words.linux.fuseSource}</External>
            <p>{rich(words.linux.deb.replace("{deb}", fileName("deb")))}</p>
            <p>{rich(words.linux.rpm.replace("{rpm}", fileName("rpm")))}</p>
          </TabsContent>
        </Tabs>
      </section>

      <section id="updates" className="download-section" aria-labelledby="updates-title">
        <h2 id="updates-title">{words.updates.title}</h2>
        <p>{rich(words.updates.auto)}</p>
        <p>{rich(words.updates.packages)}</p>
      </section>

      <section id="uninstall" className="download-section" aria-labelledby="uninstall-title">
        <h2 id="uninstall-title">{words.uninstall.title}</h2>
        <ul>
          {[words.uninstall.macos, words.uninstall.windows, words.uninstall.appimage, words.uninstall.packages].map(
            (line) => (
              <li key={line}>{rich(line)}</li>
            ),
          )}
        </ul>
        <p>{rich(words.uninstall.tools)}</p>
      </section>

      <nav className="download-section download-next" aria-label={words.next.title}>
        <Link className="animated-text-link text-link" href={`/${lang}/docs/desktop`}>
          <span className="link-label">{words.next.docs}</span>
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link className="animated-text-link text-link" href={`/${lang}/docs/installation`}>
          <span className="link-label">{words.next.terminal}</span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </nav>
    </main>
  )
}
