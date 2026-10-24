import { expect, test } from "@playwright/test"

const titles = { en: "Meetings", ru: "Встречи", es: "Reuniones" }
const startTitles = { en: "Zoom — start here", ru: "Zoom — начало работы", es: "Zoom — empieza aquí" }
const ownershipRecovery = {
  en: "lost or changed writer ownership",
  ru: "процесс потерял блокировку",
  es: "perdió el bloqueo de escritura",
}
for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: batch reads retain independent answers and budget limits in HTML and Markdown`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zm/search`)
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/search/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    for (const literal of [
      "zm personal batch requests.json --json",
      "cat requests.json | zm personal batch - --jsonl",
      "not_run",
      "meta.complete",
      "--max-read-bytes",
      "--max-output-bytes",
    ]) {
      await expect(page.locator("main")).toContainText(literal)
      expect(markdown).toContain(literal)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: archive recovery retains lost-ownership guidance in HTML and Markdown`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/zm/archive#locks-and-recovery`)
    await expect(page.locator("main #locks-and-recovery")).toHaveCount(1)
    await expect(page.locator("main")).toContainText(ownershipRecovery[lang])
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/archive/content.md`)
    expect(response.ok()).toBe(true)
    expect(await response.text()).toContain(ownershipRecovery[lang])
  })

  test(`${lang}: Zoom sits beside Drive and opens its setup guide`, async ({ page }) => {
    await page.goto(`/${lang}/docs/zm`)
    await expect(page.getByRole("heading", { level: 1, name: startTitles[lang], exact: true })).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/zm/installation"]`).first()).toBeVisible()
    const links = await page
      .locator("#nd-sidebar a[href]")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))
    const roots = links.filter((href) => new RegExp(`^/${lang}/docs/(tg|max|drive|zm|memo)/?$`).test(href ?? ""))
    const drive = roots.indexOf(`/${lang}/docs/drive`)
    expect(drive).toBeGreaterThan(-1)
    expect(roots[drive + 1]).toBe(`/${lang}/docs/zm`)
    await expect(page.locator(`#nd-sidebar a[href="/${lang}/docs/zoom"]`)).toHaveText(titles[lang])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: contextual search filters remain readable on mobile and in Markdown`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zm/search`)
    await expect(page.locator("main")).toContainText("--identity-id")
    await expect(page.locator("main")).toContainText("--person-id")
    await expect(page.locator("main")).toContainText("--project")
    await expect(page.locator("main")).toContainText("--expected-fingerprint")
    await expect(page.locator("main #search-stored-meetings")).toHaveCount(1)
    await expect(page.locator(`main a[href="/${lang}/docs/memo/usage"]`).first()).toBeVisible()
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}zm/search/content.md`)
    expect(markdown.ok()).toBe(true)
    const text = await markdown.text()
    expect(text).toContain('zm personal search meetings "launch" --identity-id 12 --project RES')
    expect(text).toContain("zm_write")
    expect(text).toContain("zm personal meetings passage meeting:3/15/20/4 --before-n 3 --after-n 4 --format markdown")
    expect(text).toContain("--scan-limit")
    expect(text).toContain("page.has_more")
    expect(text).toContain("`item.next`")
    expect(text).toContain("`offset_ms`")
    expect(text).toContain("`selection`")
    expect(text).toContain("`identity_id`")
    expect(text).not.toContain("`identityId`")
    expect(text).toContain(
      "zm personal meetings projects evidence RES 'identity_id:12 started_at:[2026-09-14 TO 2026-10-14]'",
    )
    await expect(page.locator("main")).toContainText("zm personal meetings projects evidence RES")
    expect(text).toContain("`item.page.next_cursor`")
    expect(text).toContain("meeting_project_evidence")
    expect(text).toContain('association: "unconfirmed-word-evidence"')
    expect(text).toContain('archive_completeness: "unknown"')
    expect(text).toContain("UTC")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: Meetings keeps its address and readable cross-source workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zoom`)
    await expect(page.getByRole("heading", { level: 1, name: titles[lang], exact: true })).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/zm/search"]`)).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/drive"]`)).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/memo"]`)).toBeVisible()
    await expect(page.locator("main")).toContainText('zm personal search meetings "launch decision"')
    await expect(page.locator("main")).toContainText("zm personal meetings passage meeting:3/15/20/4")
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}zoom/content.md`)
    expect(markdown.ok()).toBe(true)
    const text = await markdown.text()
    expect(text).toContain("Research Example")
    expect(text).toContain("zm personal meetings transcript 1 --json")
    expect(text).toContain("zm personal meetings scheduled --limit 20 --json")
    expect(text).toContain("zm personal meetings projects scan meeting:1/2 --cues 20 --json")
    await expect(page.locator("main")).toContainText("zm personal meetings scheduled --limit 20 --json")
    await expect(page.locator(`main a[href="/${lang}/docs/zm/usage#find-a-scheduled-meeting-series"]`)).toBeVisible()
    expect(text).toContain("zm personal meetings prepare <series-id> --json")
    expect(text).toContain('zm personal search meetings "launch decision" --json')
    expect(text).toContain("zm personal meetings passage meeting:3/15/20/4")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: preparation keeps its cited scope and gaps in HTML and Markdown`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zm/usage#prepare-for-an-upcoming-meeting`)
    const main = page.locator("main")
    await expect(main.locator("#prepare-for-an-upcoming-meeting")).toHaveCount(1)
    await expect(main).toContainText("zm personal meetings prepare 123456789 --json")
    await expect(main).toContainText("verified_next")
    await expect(main).toContainText("--history-since-time")
    const relatedFields = [
      "related.items",
      "related.anchors",
      "shared_person",
      "shared_project",
      "related.has_more",
      "related.output_limited",
      "notes.items",
      "notes.coverage.has_more",
      "notes.coverage.output_limited",
      "source_evidence: not-revalidated",
      "knowledge.items",
      "knowledge.coverage.has_more",
      "knowledge.coverage.output_limited",
      "fact_evidence: not-revalidated",
      "other_sources: not-queried",
    ]
    for (const field of relatedFields) await expect(main).toContainText(field)
    await expect(
      main.locator(`a[href="/${lang}/docs/zm/zoom-app#add-archive-or-management-access"]`).first(),
    ).toBeVisible()
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/usage/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain("zm personal meetings prepare 123456789 --json")
    expect(markdown).toContain("`item.upcoming.candidate`")
    expect(markdown).toContain("`verified_next`")
    expect(markdown).toContain("`meta.complete=false`")
    expect(markdown).toContain("meeting:read:meeting")
    expect(markdown).toContain("--context-limit")
    for (const field of relatedFields) expect(markdown).toContain(field)
    expect(markdown).toContain("--output-dir")
    expect(markdown).not.toContain("--destination")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })

  test(`${lang}: Zoom installation links its app and retains command examples in Markdown`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${lang}/docs/zm/installation`)
    await expect(page.locator("main")).toContainText("npm install -g @wirecat/zoom-cli")
    await expect(page.locator(`main a[href="/${lang}/docs/zm/zoom-app"]`).first()).toBeVisible()
    const prefix = lang === "en" ? "" : `${lang}/`
    const markdown = await request.get(`/llms.mdx/docs/${prefix}zm/installation/content.md`)
    expect(markdown.ok()).toBe(true)
    expect(await markdown.text()).toContain("zm config set zoom.client_id <public-client-id>")
    expect(await markdown.text()).toContain("zm personal session start")
  })
}

for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: installation explains app choices, credentials and completed login`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/zm/installation`)
    const main = page.locator("main")
    await expect(main).toContainText("Public Client ID")
    await expect(main).toContainText(
      {
        en: "There is no credentials file to download",
        ru: "Файл учётных данных не нужен",
        es: "No hay archivo de credenciales",
      }[lang],
    )
    await expect(main).toContainText("WireCat")
    await expect(main).toContainText("logged_in: true")
    await expect(main).toContainText("code=…&state=…")
    await expect(page.locator(`main a[href="/${lang}/docs/zm/zoom-app#create-your-own-app"]`)).toBeVisible()
    await expect(main).toContainText("OAuth Redirect URL")
    await expect(main).toContainText("OAuth Allow Lists")
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/installation/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain("zm config set zoom.client_id <public-client-id>")
    expect(markdown).toContain("zm config set source api")
    expect(markdown).toContain("zm personal session status --json")
    expect(markdown).toContain("code=…&state=…")
    expect(markdown).toContain("https://wirecat.dev/zoom-callback")
    expect(markdown).toContain("npm.cmd install -g @wirecat/zoom-cli")
    expect(markdown).toContain("zm.cmd doctor")
    expect(markdown).toContain("Use zm CLI")
    await expect(main.locator("#check-your-first-result")).toHaveCount(1)
    await expect(main.locator(".docs-prompt").first()).toBeVisible()
  })

  test(`${lang}: app guide has manual creation and existing app reuse with explicit scope setup`, async ({ page }) => {
    await page.goto(`/${lang}/docs/zm/zoom-app`)
    const main = page.locator("main")
    const choices = main.locator("ul").first()
    await expect(choices.locator("a")).toHaveText(
      {
        en: ["Use an app you already created", "Create your own app"],
        ru: ["Используйте уже созданное приложение", "Создайте своё приложение"],
        es: ["Usa una app que ya creaste", "Crea tu propia app"],
      }[lang],
    )
    for (const anchor of ["use-an-app-you-already-created", "create-your-own-app"]) {
      await choices.locator(`a[href="#${anchor}"]`).click()
      await expect(page).toHaveURL(new RegExp(`#${anchor}$`))
      await expect(main.locator(`[id="${anchor}"]`)).toHaveCount(1)
    }
    await expect(main).toContainText("General app")
    await expect(main).toContainText("User-managed")
    await expect(main).toContainText("Use Public Client OAuth")
    await expect(main).toContainText("Developer")
    await expect(main).toContainText("Created apps")
    await expect(main).toContainText("Local Test")
    await expect(main).toContainText("Add Scopes")
    await expect(main).toContainText(
      {
        en: "The manifest does not include scopes",
        ru: "Манифест не содержит разрешений",
        es: "El manifiesto no incluye permisos",
      }[lang],
    )
    await expect(main).toContainText("meeting:read:list_past_participants")
    await expect(main.locator("#before-your-first-zm-pull")).toHaveCount(1)
    await expect(page.locator(`main a[href="/${lang}/docs/zm/installation#first-run"]`).first()).toBeVisible()
    await expect(page.locator(`main a[href="/${lang}/docs/zm/sessions#finish-the-browser-callback"]`)).toBeVisible()
    await expect(main.locator('a[href="https://marketplace.zoom.us/"]').first()).toBeVisible()
  })

  test(`${lang}: sessions exposes stalled approval recovery on mobile and in Markdown`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zm/sessions#finish-the-browser-callback`)
    const main = page.locator("main")
    await expect(main).toContainText("code=…&state=…")
    await expect(main).toContainText("logged_in: true")
    await expect(main).toContainText("Enter")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/sessions/content.md`)
    expect(response.ok()).toBe(true)
    expect(await response.text()).toContain("code=…&state=…")
  })

  test(`${lang}: semantic guide retains its older anchor and current search in Markdown`, async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${lang}/docs/zm/topic-search#explicit-meeting-vectors`)
    await expect(page.locator("main #explicit-meeting-vectors")).toHaveCount(1)
    await expect(page.locator("main")).toContainText("--cursor <next_cursor>")
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/topic-search/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    expect(markdown).toContain('zm personal search meetings "example plan" --model example-model')
    expect(markdown).toContain("OPENAI_API_KEY")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  })
}

for (const lang of ["en", "ru", "es"] as const) {
  for (const guide of ["usage"]) {
    test(`${lang}/${guide}: standard answers retain metadata and detailed reports`, async ({ page, request }) => {
      if (guide === "usage") await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(`/${lang}/docs/zm/${guide}`)
      const main = page.locator("main")
      await expect(main).toContainText("meta.run_id")
      await expect(main).toContainText("meta.duration_ms")
      await expect(main).toContainText("item")
      const prefix = lang === "en" ? "" : `${lang}/`
      const response = await request.get(`/llms.mdx/docs/${prefix}zm/${guide}/content.md`)
      expect(response.ok()).toBe(true)
      const markdown = await response.text()
      expect(markdown).toContain("`meta.run_id`")
      expect(markdown).toContain("`meta.duration_ms`")
      expect(markdown).toContain("`items`")
      if (guide === "usage") {
        expect(markdown).toContain('`{"type":"item","data":...}`')
        expect(markdown).toContain('`{"type":"end","complete":true,"page":...}`')
        expect(markdown).toContain("`meta.complete`")
        expect(markdown).toContain("`effects.remote`")
        expect(markdown).toContain("`effects.local`")
        expect(markdown).toContain("`next_cursor`")
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
        expect(markdown).toContain("`offset_ms`")
        expect(markdown).toContain("`meetings transcript <meeting> --history`")
      } else {
        expect(markdown).toContain("`item.page`")
        expect(markdown).toContain("`item.next`")
        expect(markdown).toContain("`validation_error`")
        expect(markdown).toContain("`meeting_project_evidence`")
        for (const field of ["meta.truncated", "content_bytes", "validation_error"]) {
          await expect(main).toContainText(field)
          expect(markdown).toContain(`\`${field}\``)
        }
      }
    })
  }
}

for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}: hosted calendar coverage and unverified dates survive Markdown export`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/zm/remote-meetings`)
    const limits = {
      en: ["not list every invitation", "rather than treating a listed date as proof of a future call"],
      ru: ["не включает все приглашения", "дата в списке не доказывает будущий созвон"],
      es: ["No incluye todas las invitaciones", "una fecha listada no prueba una futura llamada"],
    }[lang]
    for (const limit of limits) await expect(page.locator("main")).toContainText(limit)
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/remote-meetings/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    for (const limit of limits) expect(markdown).toContain(limit)
    for (const command of ["meetings scheduled", "meetings prepare <series-id>"]) {
      await expect(page.locator("main")).toContainText(command)
      expect(markdown).toContain(command)
    }
    expect(markdown).toContain("meeting:read:list_meetings")
    expect(markdown).toContain("zm personal remote-meetings list --json")
  })
}

for (const lang of ["en", "ru", "es"] as const) {
  test(`${lang}/mcp: one server offers zm's commands through three tools`, async ({ page, request }) => {
    await page.goto(`/${lang}/docs/zm/mcp`)
    const main = page.locator("main")
    for (const literal of ["zm personal mcp", "zm_tools_search", "zm_read", "zm_write"])
      await expect(main).toContainText(literal)
    const prefix = lang === "en" ? "" : `${lang}/`
    const response = await request.get(`/llms.mdx/docs/${prefix}zm/mcp/content.md`)
    expect(response.ok()).toBe(true)
    const markdown = await response.text()
    for (const literal of ["`zm personal mcp`", "`zm_read`", "`zm_write`"]) expect(markdown).toContain(literal)
  })
}
