#!/usr/bin/env python3
"""Replay saved synthetic CLI calls. Does not invoke an LLM or the real tg executable."""
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

repo = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('run', help='run directory containing manifest.json and trace.jsonl')
args = parser.parse_args()
run = Path(args.run).resolve()
manifest = json.loads((run / 'manifest.json').read_text())
fixture = repo / ('docs/agent-evals/fixtures/tg-0.22-v2' if manifest['fixtureVersion'] == 'v2' else 'docs/agent-evals/archive/harness-v1')
for path, key in [(fixture / 'harness.py', 'harnessSha256'), (fixture / 'discovery/commands.json', 'discoverySha256'), (fixture / 'discovery/SKILL.md', 'skillSha256'), (fixture / 'discovery/help.txt', 'helpSha256')]:
    if hashlib.sha256(path.read_bytes()).hexdigest() != manifest[key]:
        sys.exit(f'Fixture changed: {path}; preserve the old revision or record a new manifest.')
with tempfile.TemporaryDirectory(prefix='wirecat-cli-replay-') as scratch:
    root = Path(scratch)
    shutil.copytree(fixture, root, dirs_exist_ok=True)
    events = [json.loads(line) for line in (run / 'trace.jsonl').read_text().splitlines()]
    for index, event in enumerate(events, 1):
        result = subprocess.run([sys.executable, str(root / 'harness.py'), manifest['case'], *event['argv']], capture_output=True, text=True, timeout=15)
        if result.returncode != event['exitCode'] or result.stdout.rstrip('\n') != event['stdout'].rstrip('\n') or result.stderr.rstrip('\n') != event['stderr'].rstrip('\n'):
            print(f'Mismatch at call {index}: tg {event["argv"]}')
            print(f'exit: expected {event["exitCode"]}, received {result.returncode}')
            sys.exit(1)
print(f'PASS: {len(events)} recorded CLI calls replayed; the agent was not rerun.')
