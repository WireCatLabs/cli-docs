"""Check draft source citations against supplied files without following arbitrary draft paths."""
import hashlib
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent / ".docs-tooling/codewiki"
reports = []
for trial in sorted(root.iterdir()):
    if not (trial / "result.json").exists():
        continue
    manifest = json.loads((trial / "input-manifest.json").read_text())
    lines = {}
    for row in manifest["files"]:
        data = (trial / "source" / row["path"]).read_bytes()
        if hashlib.sha256(data).hexdigest() != row["sha256"]:
            raise SystemExit(f"Input changed: {row['path']}")
        lines[row["path"]] = len(data.decode().splitlines())
    citations = []
    for document in (trial / "drafts").glob("*.md"):
        for target in re.findall(r"\]\(([^)]+)\)", document.read_text()):
            match = re.search(r"(src/[^#]+)#L(\d+)(?:-L?(\d+))?", target)
            if not match:
                continue
            path, start, end = match[1], int(match[2]), int(match[3] or match[2])
            valid = path in lines and 1 <= start <= end <= lines[path]
            citations.append({"document": document.name, "target": target, "validFileAndRange": valid})
    result = json.loads((trial / "result.json").read_text())
    report = {"trial": trial.name, "result": result, "citations": citations,
              "validFileAndRange": sum(row["validFileAndRange"] for row in citations),
              "limitation": "Valid file/range does not establish that the cited code supports a claim"}
    (trial / "citation-check.json").write_text(json.dumps(report, indent=2))
    reports.append(report)
    print(f"{trial.name}: {report['validFileAndRange']}/{len(citations)} citation file/ranges valid")
(root / "comparison.json").write_text(json.dumps(reports, indent=2))
