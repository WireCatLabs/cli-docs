#!/bin/sh
set -eu
task_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
task_revision=64c2b60f23013904e495b0c12acba9b91ceb5746
mkdir -p "$task_root/.docs-tooling"
if [ ! -d "$task_root/.docs-tooling/codewiki-source/.git" ]; then
  git clone https://github.com/FSoft-AI4Code/CodeWiki.git "$task_root/.docs-tooling/codewiki-source"
fi
git -C "$task_root/.docs-tooling/codewiki-source" fetch origin "$task_revision"
git -C "$task_root/.docs-tooling/codewiki-source" checkout --detach "$task_revision"
uv venv --python 3.12 --allow-existing "$task_root/.docs-tooling/codewiki-venv"
uv pip install --python "$task_root/.docs-tooling/codewiki-venv/bin/python" --override "$task_root/scripts/codewiki-overrides.txt" "$task_root/.docs-tooling/codewiki-source"
