import { execFileSync } from "node:child_process"
import type { Tool } from "./sync.ts"

/** Source distributions are explicit reviewed commits, never an accidental substitute for a release. */
export function sourceInstallation(tool: Pick<Tool, "distribution" | "docsRef" | "repo">): boolean {
  if (tool.distribution !== "source") return false
  if (!/^[a-f0-9]{40}$/.test(tool.docsRef ?? "") || !/^[\w.-]+\/[\w.-]+$/.test(tool.repo))
    throw new Error("Source installation requires a repository and immutable reviewed commit")
  return true
}

export function checkoutSource(tool: Tool, destination: string): void {
  if (!sourceInstallation(tool)) throw new Error("Not a source distribution")
  checkoutCommit(tool.repo, tool.docsRef as string, destination)
}

/** Fetch the selected immutable object; git clone --branch does not accept commit IDs. */
export function checkoutCommit(repo: string, commit: string, destination: string): void {
  if (!/^[a-f0-9]{40}$/.test(commit) || !/^[\w.-]+\/[\w.-]+$/.test(repo))
    throw new Error("Commit checkout requires a repository and immutable commit")
  const git = (args: string[], cwd?: string) => execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "inherit"] })
  git(["clone", "-q", "--no-checkout", "--depth", "1", `https://github.com/${repo}.git`, destination])
  git(["fetch", "-q", "--depth", "1", "origin", commit], destination)
  git(["-c", "advice.detachedHead=false", "checkout", "-q", "--detach", commit], destination)
}
