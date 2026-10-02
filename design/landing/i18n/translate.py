"""Builds g-home.ru.html and g-home.es.html from g-home.html. Run: python3 design/landing/i18n/translate.py"""

import pathlib
import re

from strings import CODE, SCRIPT, TEXT, TITLE

landing = pathlib.Path(__file__).resolve().parent.parent
source = (landing / "g-home.html").read_text()
SKIP = {"code", "pre", "style", "title"}


def text_nodes(html, i):
    out, inside = [], []
    for piece in re.split(r"(<[^>]+>)", html):
        if piece.startswith("<"):
            tag = re.match(r"</?\s*([a-zA-Z0-9]+)", piece)
            if tag and tag.group(1).lower() in SKIP:
                if piece.startswith("</"):
                    inside.pop()
                else:
                    inside.append(tag.group(1))
            out.append(piece)
            continue
        core = piece.strip()
        if core and not inside and core in TEXT:
            piece = piece.replace(core, TEXT[core][i], 1)
        out.append(piece)
    return "".join(out)


def replace_all(text, rows, i):
    for row in sorted(rows, key=lambda r: -len(r[0])):
        text = text.replace(row[0], row[1 + i])
    return text


def build(lang, i):
    head, rest = source.split("<body>", 1)
    body, script = rest.split("<script>", 1)
    page = head + "<body>" + text_nodes(body, i) + "<script>" + replace_all(script, SCRIPT, i)
    page = replace_all(page, CODE, i)
    swaps = [
        ('<html lang="en">', f'<html lang="{lang}">'),
        ("<title>WireCat Home</title>", f"<title>{TITLE[i]}</title>"),
        ("<span>EN</span>", f"<span>{lang.upper()}</span>"),
        ('lang="en" aria-current="page"', 'lang="en"'),
        (f'lang="{lang}">', f'lang="{lang}" aria-current="page">'),
        ('<a href="g-home.html" aria-current="page">', '<a href="g-home.html">'),
        (f'<a href="g-home.{lang}.html">', f'<a href="g-home.{lang}.html" aria-current="page">'),
        ("wirecat.dev/en/docs/tg", f"wirecat.dev/{lang}/docs/tg"),
    ]
    for old, new in swaps:
        page = page.replace(old, new)
    (landing / f"g-home.{lang}.html").write_text(page)
    print(f"g-home.{lang}.html")


unmatched = [row[0] for row in SCRIPT + CODE if row[0] not in source]
if unmatched:
    raise SystemExit(f"not found in g-home.html: {unmatched}")


build("ru", 0)
build("es", 1)
