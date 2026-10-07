import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import { Heading } from "fumadocs-ui/components/heading"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { ExternalLink } from "lucide-react"
import type { MDXComponents } from "mdx/types"
import type { ComponentProps, ComponentType } from "react"
import { ArchitectureDiagram } from "@/components/architecture-diagram"
import { DocTerm } from "@/components/doc-term"
import { DocsCodeBlock } from "@/components/docs-code-block"
import {
  AgentInstallPrompt,
  InstallationGuide,
  InstallationMessengerTabs,
  InstallationOsTabs,
} from "@/components/installation-guide"
import { MeetingBriefDemo } from "@/components/meeting-brief-demo"
import { NodeSetupPrompt } from "@/components/node-setup-prompt"
import { PlatformPaths } from "@/components/platform-paths"
import { PlatformSetupTabs } from "@/components/platform-setup-tabs"
import { Screenshot } from "@/components/screenshot"
import { SearchPlayground } from "@/components/search-playground/search-playground"
import { AgentPrompt } from "@/components/text-snippet"
import { isStaticDocumentationResource } from "@/lib/static-resource"

export function getMDXComponents(components?: MDXComponents) {
  const LinkComponent = (components?.a ?? defaultMdxComponents.a) as ComponentType<ComponentProps<"a">>
  return {
    ...defaultMdxComponents,
    pre: DocsCodeBlock,
    table: (props: ComponentProps<"table"> & { "data-table-label"?: string }) => (
      // biome-ignore lint/a11y/useSemanticElements: A named scrolling group keeps repeated data tables out of landmark navigation.
      <div
        role="group"
        className="docs-reference-table relative my-6 overflow-auto prose-no-margin"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard focus enables scrolling wide reference tables.
        tabIndex={0}
        aria-label={props["data-table-label"] ?? "Reference table"}
      >
        <table {...props} />
      </div>
    ),
    h2: (props: ComponentProps<"h2"> & { "data-static-heading"?: boolean }) =>
      props["data-static-heading"] ? <h2 {...props}>{props.children}</h2> : <Heading as="h2" {...props} />,
    ArchitectureDiagram,
    InstallationGuide,
    AgentInstallPrompt,
    InstallationMessengerTabs,
    InstallationOsTabs,
    PlatformSetupTabs,
    Screenshot,
    Tabs,
    Tab,
    Steps,
    Step,
    Accordions,
    Accordion,
    DocTerm,
    NodeSetupPrompt,
    MeetingBriefDemo,
    SearchPlayground,
    "platform-paths": PlatformPaths,
    "platform-setup-tabs": PlatformSetupTabs,
    "platform-setup-tab": Tab,
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
