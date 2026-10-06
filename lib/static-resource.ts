export function isStaticDocumentationResource(href: string | undefined): boolean {
  if (!href) return false
  try {
    const pathname = new URL(href, "https://wirecat.dev").pathname
    return /^\/llms(?:[-./]|$)|^\/install\.ps1$|^\/screenshots\//.test(pathname)
  } catch {
    return false
  }
}
