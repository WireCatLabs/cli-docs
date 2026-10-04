import defaultMdxComponents from "fumadocs-ui/mdx"
import { ExternalLink } from "lucide-react"
import type { MDXComponents } from "mdx/types"
import type { ComponentProps, ComponentType } from "react"
import { InstallationGuide } from "@/components/installation-guide"
import { PlatformPaths } from "@/components/platform-paths"
import { SearchPlayground } from "@/components/search-playground/search-playground"
import { AgentPrompt } from "@/components/text-snippet"
import { isStaticDocumentationResource } from "@/lib/static-resource"

export function getMDXComponents(components?: MDXComponents) {
  const LinkComponent = (components?.a ?? defaultMdxComponents.a) as ComponentType<ComponentProps<"a">>
  return {
    ...defaultMdxComponents,
    InstallationGuide,
    SearchPlayground,
    "platform-paths": PlatformPaths,
    "agent-prompt": AgentPrompt,
    ...components,
    a: (props) => {
      const Component = isStaticDocumentationResource(props.href) ? "a" : LinkComponent
      return (
        <Component {...props}>
          {props.className?.split(" ").includes("command-reference") ? (
            <ExternalLink size={14} aria-hidden="true" />
          ) : (
            props.children
          )}
        </Component>
      )
    },
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
