#!/usr/bin/env python3
"""Check a built copy of the site (the output of `hugo`), standard library only.

    scripts/check-site.py PUBLIC --site-url URL [--build-log LOG]
                          [--held-back CSV ...] [--baseline FILE]

`make test` runs it through scripts/test.sh; you rarely call it directly.
What it checks, and why each one is here:

  build         every WARN or ERROR line hugo printed. Hugo exits 0 on
                warnings, and a warning today (a deprecation, a missing
                template) is a broken build after the next Hugo upgrade.
  pages         every HTML page has a <title> with the page's own title in it
                (a title starting "|" means the page had none of its own),
                a non-empty <meta name="description"> and an <html lang>. Search engines
                and link previews use them.
  links         every internal href/src/srcset (relative, root-relative, or
                absolute on the site's own host) and every url() in the built
                CSS resolves to a file in the build, and every #fragment to an
                id/name on the target page. This is also the missing-image
                check. Plus: nothing is loaded over plain http (an https page
                would block it as mixed content).
  sitemap       sitemap.xml parses; every <loc> is https on the site's host
                and was built.
  robots        robots.txt exists, has a User-agent, points at the sitemap and
                does not disallow the whole site.
  drafts        nothing listed by `hugo list drafts|future|expired` was
                published.
  placeholders  no template placeholder text (lorem ipsum, example.com) and
                no local address (localhost) appears in any built file. The
                deploy rewrites the app's local address in config.toml; one
                left in a template or a content file would ship as it is.

A baseline file names known defects so they do not fail the run; an entry
that no longer matches anything fails it, so the file shrinks as defects are
fixed and cannot quietly hide new ones of a different kind.

External links are not fetched: the check must give the same answer offline
and on CI, and a third-party site being down is not a defect in this one.
Exit status is 1 if anything failed, and every failure is printed.

The deploy screen (/deploy/) is not a public page and is skipped by the pages
check.
"""

import argparse
import csv
import os
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import unquote, urljoin, urlparse

SKIP_SCHEMES = {"mailto", "tel", "javascript", "data"}

# Text that only ever arrives by copying a template and not finishing the job.
# localhost: config.toml carries the app's local address and the deploy
# rewrites it; this catches one written anywhere the rewrite does not reach.
PLACEHOLDERS = [
    "yourname",
    "Lorem ipsum",
    "example.com",
    "example.org",
    "localhost",
]

# Built from static/, not a page of the site: the deploy screen the Tina admin
# embeds. Its links are still checked.
NOT_PAGES = ("/deploy/",)


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = None
        self._in_title = False
        self._title_buf = []
        self.description = None
        self.redirect = False
        self.ids = set()
        self.refs = []  # (tag, attr, value)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title" and self.title is None:
            self._in_title = True
        elif tag == "meta" and (a.get("name") or "").lower() == "description":
            self.description = a.get("content") or ""
        elif tag == "meta" and (a.get("http-equiv") or "").lower() == "refresh":
            self.redirect = True
        for key in ("id", "name"):
            if a.get(key) and not (tag == "meta" and key == "name"):
                self.ids.add(a[key])
        for attr in ("href", "src"):
            if a.get(attr) is not None:
                # <link rel=preconnect|dns-prefetch> point at hosts, not files
                if tag == "link" and (a.get("rel") or "") in ("preconnect", "dns-prefetch"):
                    continue
                self.refs.append((tag, attr, a[attr]))
        if a.get("srcset"):
            for candidate in a["srcset"].split(","):
                url = candidate.strip().split(" ")[0]
                if url:
                    self.refs.append((tag, "srcset", url))

    def handle_endtag(self, tag):
        if tag == "title" and self._in_title:
            self._in_title = False
            self.title = "".join(self._title_buf).strip()

    def handle_data(self, data):
        if self._in_title:
            self._title_buf.append(data)


def url_path_for(root, file_path):
    """The site URL path a built file is served at."""
    rel = os.path.relpath(file_path, root).replace(os.sep, "/")
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def resolve(root, url_path):
    """Map a URL path to a built file, the way a static host serves it, or None."""
    path = unquote(url_path)
    candidate = os.path.normpath(os.path.join(root, path.lstrip("/")))
    if not candidate.startswith(os.path.normpath(root)):
        return None
    for option in (candidate, os.path.join(candidate, "index.html"), candidate + ".html"):
        if os.path.isfile(option):
            return option
    return None


def load_baseline(path):
    """(check, text) pairs. A failure is excused when it is in that check and
    contains the text. Blank lines and # comments are ignored."""
    entries = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            check, _, text = line.partition(":")
            entries.append((check.strip(), text.strip()))
    return entries


def main(argv):
    ap = argparse.ArgumentParser(description="Check a built copy of the site.")
    ap.add_argument("public", help="the directory hugo built into")
    ap.add_argument("--site-url", required=True, help="the site's baseURL, e.g. https://bettersaver.co.nz/")
    ap.add_argument("--build-log", help="hugo's output; every WARN/ERROR line is a failure")
    ap.add_argument("--held-back", nargs="*", default=[], metavar="CSV",
                    help="output of `hugo list drafts|future|expired`")
    ap.add_argument("--baseline", help="known defects to excuse (see the file's header)")
    args = ap.parse_args(argv[1:])
    root = os.path.abspath(args.public)
    if not os.path.isfile(os.path.join(root, "index.html")):
        print(f"check-site: {root} has no index.html; build the site first", file=sys.stderr)
        return 2

    site = urlparse(args.site_url)
    host = site.hostname
    hosts = {host, "www." + host} if host and not host.startswith("www.") else {host}
    origin = f"{site.scheme}://{host}"

    failures = {name: [] for name in
                ("build", "pages", "links", "sitemap", "robots", "drafts", "placeholders")}

    # build ------------------------------------------------------------------
    if args.build_log:
        with open(args.build_log, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                if line.startswith(("WARN", "ERROR")):
                    failures["build"].append(line.strip())

    pages, texts, css = {}, {}, {}
    for dirpath, _, files in os.walk(root):
        for name in files:
            full = os.path.join(dirpath, name)
            if name.endswith((".html", ".xml", ".txt", ".json", ".css")):
                with open(full, encoding="utf-8", errors="replace") as fh:
                    texts[full] = fh.read()
            if name.endswith(".html"):
                parser = Page()
                parser.feed(texts[full])
                pages[full] = parser
            elif name.endswith(".css"):
                css[full] = texts[full]

    # pages ------------------------------------------------------------------
    for full, p in sorted(pages.items()):
        where = url_path_for(root, full)
        # Hugo writes a redirect stub for every alias; it is not a real page.
        if p.redirect or where.startswith(NOT_PAGES):
            continue
        if not p.title:
            failures["pages"].append(f"{where}: no <title>")
        elif p.title.startswith("|"):
            # The theme renders "<page title> | <site title>", so a page with
            # no title of its own comes out starting with "|" rather than empty.
            failures["pages"].append(f"{where}: empty page title ({p.title!r})")
        if not (p.description or "").strip():
            failures["pages"].append(f"{where}: no meta description")
        if not p.lang:
            failures["pages"].append(f"{where}: no <html lang>")

    # links ------------------------------------------------------------------
    checked = 0

    def check_ref(source, base, tag, attr, value):
        nonlocal checked
        value = value.strip()
        if value.startswith("//"):
            value = "https:" + value
        u = urlparse(urljoin(base, value))
        if u.scheme in SKIP_SCHEMES:
            return
        # Loaded (not merely linked) over plain http: blocked on an https page.
        if u.scheme == "http" and (attr in ("src", "srcset", "url()") or (tag == "link" and attr == "href")):
            failures["links"].append(f"{source}: {tag} {attr}={value!r} -> loaded over http (mixed content)")
        if u.scheme not in ("http", "https") or u.hostname not in hosts:
            return
        checked += 1
        target = resolve(root, u.path or "/")
        if target is None:
            failures["links"].append(f"{source}: {tag} {attr}={value!r} -> not built")
            return
        if u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
            failures["links"].append(
                f"{source}: {value!r} -> no id {u.fragment!r} on {url_path_for(root, target)}")

    for full, p in sorted(pages.items()):
        where = url_path_for(root, full)
        for tag, attr, value in p.refs:
            check_ref(where, origin + where, tag, attr, value)
    for full, text in sorted(css.items()):
        where = url_path_for(root, full)
        for value in re.findall(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", text):
            check_ref(where, origin + where, "css", "url()", value)

    # sitemap ----------------------------------------------------------------
    sitemap = os.path.join(root, "sitemap.xml")
    sitemap_urls = 0
    if not os.path.isfile(sitemap):
        failures["sitemap"].append("sitemap.xml was not built")
    else:
        try:
            tree = ET.parse(sitemap)
            for loc in tree.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
                sitemap_urls += 1
                u = urlparse((loc.text or "").strip())
                if u.hostname not in hosts or u.scheme != "https":
                    failures["sitemap"].append(f"{loc.text}: not an https URL on the site's host")
                elif resolve(root, u.path) is None:
                    failures["sitemap"].append(f"{loc.text}: listed but not built")
            if sitemap_urls == 0:
                failures["sitemap"].append("sitemap.xml lists no URLs")
        except ET.ParseError as exc:
            failures["sitemap"].append(f"sitemap.xml does not parse: {exc}")

    # robots -----------------------------------------------------------------
    robots = os.path.join(root, "robots.txt")
    want_sitemap = f"Sitemap: {origin}/sitemap.xml"
    if not os.path.isfile(robots):
        failures["robots"].append("robots.txt was not built")
    else:
        with open(robots, encoding="utf-8") as fh:
            lines = [l.strip() for l in fh]
        if not any(l.lower().startswith("user-agent:") for l in lines):
            failures["robots"].append("robots.txt has no User-agent line")
        if want_sitemap not in lines:
            failures["robots"].append(f"robots.txt has no '{want_sitemap}' line")
        for l in lines:
            if l.lower().replace(" ", "") == "disallow:/":
                failures["robots"].append("robots.txt disallows the whole site")

    # drafts / future / expired ---------------------------------------------
    held_back = 0
    for listing in args.held_back:
        with open(listing, newline="", encoding="utf-8") as fh:
            for row in csv.DictReader(fh):
                held_back += 1
                path = urlparse(row["permalink"]).path
                if resolve(root, path) is not None:
                    failures["drafts"].append(f"{row['path']} ({os.path.basename(listing)}) was published at {path}")

    # placeholders -----------------------------------------------------------
    # One failure per placeholder, naming how many files carry it and a few of
    # them, so a baseline entry is one line and a new post does not change it.
    for needle in PLACEHOLDERS:
        hits = sorted(url_path_for(root, f) for f, t in texts.items() if needle.lower() in t.lower())
        if hits:
            sample = ", ".join(hits[:3]) + (", …" if len(hits) > 3 else "")
            failures["placeholders"].append(f"{needle!r} in {len(hits)} files ({sample})")

    # baseline ---------------------------------------------------------------
    baseline = load_baseline(args.baseline) if args.baseline else []
    used = set()
    excused = {}
    for name in failures:
        kept = []
        for item in sorted(set(failures[name])):
            hit = next((i for i, (check, text) in enumerate(baseline)
                        if check == name and text in item), None)
            if hit is None:
                kept.append(item)
            else:
                used.add(hit)
                excused.setdefault(name, []).append(item)
        failures[name] = kept
    stale = [f"{check}: {text}" for i, (check, text) in enumerate(baseline) if i not in used]

    # report -----------------------------------------------------------------
    print(f"check-site: {len(pages)} HTML files, {checked} internal references, "
          f"{sitemap_urls} sitemap URLs, {held_back} drafts/future/expired held back")
    total = 0
    for name, items in failures.items():
        known = excused.get(name, [])
        status = "ok" if not items else f"{len(items)} FAILED"
        if known:
            status += f" ({len(known)} known, in the baseline)"
        print(f"  {name:12} {status}")
        for item in items:
            print(f"               - {item}")
        total += len(items)
    if stale:
        print(f"  baseline     {len(stale)} STALE: these known defects no longer occur;"
              f" delete them from {args.baseline}")
        for item in stale:
            print(f"               - {item}")
        total += len(stale)
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
