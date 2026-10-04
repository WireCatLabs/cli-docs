"use client"

import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock"
import type { ComponentProps } from "react"

type Props = ComponentProps<typeof CodeBlock> & { "data-code-label"?: string }

export function DocsCodeBlock({ children, "data-code-label": label, ...props }: Props) {
  return (
    <CodeBlock {...props} viewportProps={{ ...props.viewportProps, "aria-label": label ?? "Code example" }}>
      <Pre>{children}</Pre>
    </CodeBlock>
  )
}
