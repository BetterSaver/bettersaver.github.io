#!/usr/bin/env bash
# What `make test` runs: the production build exactly as `make build` makes it,
# into a throwaway directory, then scripts/check-site.py over the result. See
# scripts/check-site.py for what is checked and why.
#
#   scripts/test.sh            build + check, excusing scripts/known-defects.txt
#   scripts/test.sh --strict   the same with no baseline: every known defect fails
#
# It writes only under .test/ (gitignored) and never touches public/ or any
# tracked file. Not /tmp: a Hugo installed as a snap cannot see the host's /tmp.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
cd "$REPO"

baseline=(--baseline scripts/known-defects.txt)
[ "${1:-}" = "--strict" ] && baseline=()

HUGO_BIN="$(hugo_bin)"
[ -n "$HUGO_BIN" ] || die "no hugo" "run: make setup"
PIN="$(pinned_version)"
USED="$(hugo_version_of "$HUGO_BIN")"
if [ "$USED" != "$PIN" ]; then
  printf '\033[33m!\033[0m testing with Hugo %s (%s), but the pin is %s — run make setup\n' "$USED" "$HUGO_BIN" "$PIN" >&2
fi

out=.test/test
rm -rf "$out"
mkdir -p "$out"

start=$(date +%s%N)
echo "==> css: npm run build:css"
build_css
cfg="$(production_config "$REPO/$out")" || die "could not write the production config"
production_env

echo "==> build: hugo $USED (pinned: $PIN) ${BUILD_FLAGS[*]}, HUGO_ENVIRONMENT=$HUGO_ENVIRONMENT, into $out/public"
# Hugo exits 0 on warnings; the log is checked line by line instead. The i18n
# and path warnings are off by default and are exactly the quiet kind.
if ! "$HUGO_BIN" --config "$cfg" "${BUILD_FLAGS[@]}" --destination "$out/public" --printPathWarnings --printI18nWarnings \
        >"$out/build.log" 2>&1; then
    cat "$out/build.log"
    echo "FAIL: the production build exited non-zero" >&2
    exit 1
fi
grep -E '^ *(Pages|Static files|Aliases) ' "$out/build.log" || true

for kind in drafts future expired; do
    "$HUGO_BIN" --config "$cfg" list "$kind" >"$out/$kind.csv" 2>/dev/null
done

echo "==> check: scripts/check-site.py"
status=0
python3 scripts/check-site.py "$out/public" \
    --site-url "$SITE_URL" \
    --build-log "$out/build.log" \
    --held-back "$out/drafts.csv" "$out/future.csv" "$out/expired.csv" \
    ${baseline[@]+"${baseline[@]}"} || status=$?
ms=$(( ($(date +%s%N) - start) / 1000000 ))
printf '==> %s in %d.%01ds\n' "$([ $status = 0 ] && echo passed || echo FAILED)" $((ms / 1000)) $((ms % 1000 / 100))
exit $status
