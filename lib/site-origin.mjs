/** Prevent preview URLs from leaking into canonical URLs, sitemaps and structured data. */
export function publicSiteOrigin(value) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error("site.config.json url must be a public HTTPS origin")
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    /^(localhost|127\.|0\.|\[::1\])/.test(url.hostname) ||
    /\.(localhost|local|test|invalid)$/.test(url.hostname)
  )
    throw new Error("site.config.json url must be a public HTTPS origin")
  return url.origin
}
