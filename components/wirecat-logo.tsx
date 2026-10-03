// biome-ignore-all lint/security/noDangerouslySetInnerHtml: Repository-owned SVG artwork shared by the header and footer.
import { wirecatLogoSvg } from "@/lib/brand"

export function WirecatLogo() {
  return (
    <span
      className="wirecat-logo"
      role="img"
      aria-label="WireCat"
      dangerouslySetInnerHTML={{ __html: wirecatLogoSvg }}
    />
  )
}
