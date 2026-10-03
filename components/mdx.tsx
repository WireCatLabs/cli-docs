import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { InstallationGuide } from "@/components/installation-guide"

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    InstallationGuide,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
