#!/usr/bin/env bash
# Serve exactly what the production deploy builds (no drafts, minified, the
# pinned Hugo, the app's production address, the production funds), as plain
# files from .test/preview. Foreground; Ctrl-C stops it.
#
# The pages carry https://bettersaver.co.nz/ in their canonical and Open Graph
# tags, as the deployed ones do. Navigation still works here because the
# site's own links are root-relative.
#
#   scripts/preview.sh [port]     default 1314 (make serve uses 1313)
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
cd "$REPO"

port="${1:-1314}"
port_free "$port" || die "port $port is already in use on 127.0.0.1" "use: make preview PORT=$((port + 2))"
bin="$(hugo_bin)"
[ -n "$bin" ] || die "no hugo" "run: make setup"
build_css
rm -rf .test/preview
cfg="$(production_config "$REPO/.test/preview")" || die "could not write the production config"
production_env
"$bin" --config "$cfg" "${BUILD_FLAGS[@]}" --destination .test/preview/public --quiet
echo "production preview (Hugo $(hugo_version_of "$bin")): http://127.0.0.1:$port/  — Ctrl-C to stop"
exec python3 -m http.server --bind 127.0.0.1 --directory .test/preview/public "$port"
