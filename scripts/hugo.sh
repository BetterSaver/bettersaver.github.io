#!/usr/bin/env bash
# Run Hugo — the version scripts/lib.sh pins, from .tools/ — instead of whatever
# `hugo` is on PATH. Use it wherever you would type `hugo`:
#
#   scripts/hugo.sh version
#   scripts/hugo.sh new content financial-tips/<slug>.md
#   scripts/hugo.sh --production …   the deploy's build: Tailwind first, then
#                                    the production config, funds, environment
#                                    and flags (what make build runs)
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
cd "$REPO"

bin="$(hugo_bin)"
[ -n "$bin" ] || die "no hugo" "run: make setup"
if [ "${1:-}" = "--production" ]; then
  shift
  build_css
  cfg="$(production_config "$REPO/.test/build")" || die "could not write the production config"
  production_env
  set -- --config "$cfg" "${BUILD_FLAGS[@]}" "$@"
fi
exec "$bin" "$@"
