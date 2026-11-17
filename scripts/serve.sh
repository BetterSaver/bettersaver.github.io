#!/usr/bin/env bash
# The dev server: what `npm run dev` runs (Tailwind in watch mode beside
# `tinacms dev` wrapping `hugo server -D`), with two differences: the pinned
# Hugo instead of whichever is on PATH, and a port you can move. Drafts
# included, the Tina editor at /admin/ working against your local files, the
# app's local address and the test funds. Foreground; Ctrl-C stops it.
#
#   scripts/serve.sh [port]       default 1313
#
# It listens on 127.0.0.1 only. `npm run dev` binds 0.0.0.0, which the
# devcontainer needs; BIND=0.0.0.0 gives you that here.
#
# Tina's own ports (4001, 9000) are not moved. If 4001 is taken, this site's
# dev server is probably already running in another terminal.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
cd "$REPO"

port="${1:-1313}"
port_free "$port" || die "port $port is already in use on 127.0.0.1" \
  "something else is serving there (another site's hugo server?); leave it, and use: make serve PORT=$((port + 2))"
port_free 4001 || die "port 4001 (Tina) is already in use on 127.0.0.1" "is this site's dev server already running?"
[ -x "$(pinned_bin)" ] || die "the pinned Hugo is not here" "run: make setup"
deps_ok || die "the Node packages are missing or out of date" "run: make setup"
build_css
export PATH="$(dirname "$(pinned_bin)"):$REPO/node_modules/.bin:$PATH"
export NODE_OPTIONS=--dns-result-order=ipv4first
exec concurrently --kill-others-on-fail -n css,site -c cyan,green \
  "npm:watch:css" \
  "tinacms dev -c 'hugo server -D --bind ${BIND:-127.0.0.1} --port $port --poll 700ms'"
