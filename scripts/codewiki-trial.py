"""Run the bounded documentation trial without loading dotenv or global CodeWiki settings."""
import os

os.environ["PYTHON_DOTENV_DISABLED"] = "1"
os.environ["CODEWIKI_NO_KEYRING"] = "1"

import argparse
import json
import shutil
import time
from pathlib import Path

from codewiki.cli.adapters.doc_generator import CLIDocumentationGenerator

parser = argparse.ArgumentParser()
parser.add_argument("--topic", choices=["login", "search", "replies"], required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
repository = "max" if args.topic == "login" else "messaging"
packs = sorted((root / ".docs-tooling/packs").glob(f"{repository}-{args.topic}-*"))
if not packs:
    raise SystemExit("Create the released source pack first; see docs/TOOLING.md")
pack = packs[-1]
manifest = json.loads((pack / "manifest.json").read_text())
if manifest["mode"] != "commit":
    raise SystemExit("CodeWiki comparison requires a pinned commit source pack")
target = root / ".docs-tooling/codewiki" / f"{args.topic}-{int(time.time())}"
source = target / "source"
source.mkdir(parents=True)
priority = {
    "login": ["src/session/", "src/auth/", "src/commands/setup", "src/commands/session"],
    "search": ["src/services/messages-search", "src/store/sqlite/lucene", "src/search/"],
    "replies": ["src/sends/guard", "src/services/messages-send", "src/services/messages", "src/sends/"],
}[args.topic]
selected = [row for row in manifest["files"] if row["path"] == "package.json"]
for prefix in priority:
    for row in manifest["files"]:
        name = row["path"]
        if name.endswith(".ts") and ".test." not in name and name.startswith(prefix) and row not in selected:
            selected.append(row)
selected = selected[:10]
if len(selected) < 2:
    raise SystemExit("No relevant source modules selected")
for row in selected:
    destination = source / row["path"]
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(pack / "source" / row["path"], destination)
(target / "input-manifest.json").write_text(json.dumps({**manifest, "files": selected, "scope": "Partial topic snapshot; imports outside these files are not supplied", "provider": "codex", "model": "Existing CLI default", "generator": "CodeWiki 2.0.0"}, indent=2))
os.chdir(source)
started = time.monotonic()
generator = CLIDocumentationGenerator(
    repo_path=source,
    output_dir=target / "drafts",
    commit_id=manifest["revision"],
    config={
        "provider": "codex", "main_model": "", "cluster_model": "", "fallback_model": "",
        "api_key": "", "base_url": "", "max_depth": 0, "request_limit": 6,
        "agent_retries": 1, "max_tokens": 4096, "max_token_per_module": 20000,
        "max_token_per_leaf_module": 12000, "artifacts_enabled": False,
        "agent_instructions": {"doc_type": "architecture", "custom_instructions":
            f"Analyze only the supplied {args.topic} source. Link each claim to evidence. "
            "Never infer original line numbers from extracted snippets; cite file and symbol when original offsets are unavailable. "
            "Separate verified behavior from inference and missing dependencies. Explain user implications. "
            "Do not execute CLI or messenger operations. Only use the supplied snapshot. "
            "Produce compact technical evidence, not public user documentation."},
    },
)
try:
    job = generator.generate()
    outcome = {"status": "generated", "elapsedSeconds": round(time.monotonic() - started, 1), "files": job.files_generated, "reportedTokens": job.statistics.total_tokens_used}
except Exception as error:
    outcome = {"status": "failed", "elapsedSeconds": round(time.monotonic() - started, 1), "errorType": type(error).__name__, "error": str(error)}
    raise
finally:
    (target / "result.json").write_text(json.dumps(outcome, indent=2))
    print(f"Trial artifacts: {target}")
