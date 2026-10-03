import { wirecatWordmark } from "@/lib/brand"

export function WirecatLogo() {
  return (
    <span className="wirecat-logo" role="img" aria-label="WireCat">
      <svg className="wirecat-logo-mark" viewBox="0 0 32 32" aria-hidden="true">
        <circle className="wirecat-logo-ring" cx="16" cy="16" r="16" />
        <circle cx="16" cy="16" r="16" fill="var(--wirecat-brand-tone)" />
        <path
          className="wirecat-logo-wire"
          pathLength="40"
          d="M9 21V11l4 4 3-4 3 4 4-4v10"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path className="wirecat-logo-pulse" pathLength="40" d="M9 21V11l4 4 3-4 3 4 4-4v10" />
      </svg>
      <svg className="wirecat-logo-word" viewBox="0 -18 121.4 20" aria-hidden="true">
        <path d={wirecatWordmark} fill="currentColor" />
      </svg>
    </span>
  )
}
