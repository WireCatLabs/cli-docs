import type { SVGProps } from "react"

// Brand marks Lucide does not ship. Same 24×24 box and `currentColor` fill as the footer's GitHub glyph.
type IconProps = SVGProps<SVGSVGElement>

function Glyph({ path, ...props }: IconProps & { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d={path} />
    </svg>
  )
}

const githubPath =
  "M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.09.67-3.74-1.31-3.74-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.11.08 1.69 1.14 1.69 1.14.99 1.69 2.59 1.2 3.22.92.1-.72.38-1.2.7-1.48-2.47-.28-5.07-1.24-5.07-5.49 0-1.21.43-2.2 1.14-2.97-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.14A10.6 10.6 0 0 1 12 6.23c.94 0 1.87.13 2.75.37 2.12-1.44 3.05-1.14 3.05-1.14.6 1.53.22 2.66.11 2.94.71.77 1.14 1.76 1.14 2.97 0 4.27-2.6 5.2-5.08 5.48.4.35.75 1.02.75 2.06v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"
export const GitHubIcon = (props: IconProps) => <Glyph path={githubPath} {...props} />

/** The footer's paper plane, stroked like the site's other line icons. */
export function TelegramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m3 11 18-7-5 17-5-6-4 3 1-6 10-6-8 8Z" />
    </svg>
  )
}

const linkedinPath =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
export const LinkedInIcon = (props: IconProps) => <Glyph path={linkedinPath} {...props} />

const xPath =
  "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z"
export const XIcon = (props: IconProps) => <Glyph path={xPath} {...props} />
