#!/usr/bin/env bash
# bettersaver.github.io — one command from a fresh checkout to a passing `make test`.
#
#   make setup            do every step, stopping at the first thing only you can do
#   make check            check every step, change nothing
#
# Idempotent: each step detects what is already done and skips it, so re-running
# after fixing one thing costs nothing.
#
# The site builds and runs on this machine: no container, no database. What you
# need is git, make, curl, tar, sha256sum, python3, node and npm. Hugo itself
# is downloaded, at the exact version the deploy uses, into .tools/ in this
# checkout (gitignored) — nothing is installed system-wide.
set -uo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

CHECK_ONLY=0
for a in "$@"; do case "$a" in
  --check) CHECK_ONLY=1 ;;
  -h|--help) sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  *) printf 'unknown flag: %s\n' "$a" >&2; exit 2 ;;
esac; done

bold=$'\033[1m'; green=$'\033[32m'; red=$'\033[31m'; yellow=$'\033[33m'; dim=$'\033[2m'; off=$'\033[0m'
step() { printf '\n%s%s%s\n' "$bold" "$*" "$off"; }
ok()   { printf '  %s✓%s %s\n' "$green" "$off" "$*"; }
no()   { printf '  %s✗%s %s\n' "$red" "$off" "$*"; }
warn() { printf '  %s!%s %s\n' "$yellow" "$off" "$*"; }
hint() { printf '    %s%s%s\n' "$dim" "$*" "$off"; }

BLOCKED=0
block() { no "$1"; shift; for l in "$@"; do hint "$l"; done; BLOCKED=1; }
stop_if_blocked() {
  [ "$BLOCKED" = 1 ] || return 0
  if [ "$CHECK_ONLY" = 1 ]; then
    printf '\n%sCheck failed.%s Fix the ✗ items above (make setup does most of them).\n' "$bold$red" "$off"
  else
    printf '\n%sNot finished.%s Fix the ✗ items above and run %smake setup%s again.\n' "$bold" "$off" "$bold" "$off"
  fi
  exit 1
}

# ─────────────────────────────────────────────────────────────────────────────
step "1. Tools"

for b in git make curl tar sha256sum python3 node npm; do
  if command -v "$b" >/dev/null 2>&1; then ok "$b"; else block "$b missing" "install it, then re-run"; fi
done
if command -v python3 >/dev/null 2>&1 && ! python3 -c 'import sys; sys.exit(sys.version_info < (3, 8))'; then
  block "python3 is older than 3.8" "scripts/check-site.py needs 3.8 or newer"
fi
stop_if_blocked

# ─────────────────────────────────────────────────────────────────────────────
step "2. Hugo, at the version the deploy uses"

PIN="$(pinned_version)"
[ -n "$PIN" ] || { block "scripts/lib.sh pins no Hugo version" "put HUGO_PIN back"; stop_if_blocked; }
ok "scripts/lib.sh pins Hugo $PIN (extended)"

# The production deploy names its own version. It decides; the pin follows.
WF="$REPO/.github/workflows/hugo.yml"
deploy_v="$(sed -nE 's/^[[:space:]]*HUGO_VERSION:[[:space:]]*"?([0-9.]+)"?.*/\1/p' "$WF" 2>/dev/null | head -1)"
if [ -z "$deploy_v" ]; then
  block "cannot read HUGO_VERSION from .github/workflows/hugo.yml" \
        "the production deploy used to name its Hugo there; find where it does now and point this check at it"
elif [ "$deploy_v" = "$PIN" ]; then
  ok "the production deploy builds with Hugo $deploy_v too (.github/workflows/hugo.yml)"
else
  block "MISMATCH: the production deploy builds with Hugo $deploy_v, the pin is $PIN" \
        "set HUGO_PIN in scripts/lib.sh to $deploy_v and run make setup"
fi

download_hugo() {
  local v="$1" os arch asset tmp base="https://github.com/gohugoio/hugo/releases/download/v$1"
  case "$(uname -s)" in
    Linux)  os=linux ;;
    Darwin) os=darwin ;;
    *) no "no Hugo download for $(uname -s)"; return 1 ;;
  esac
  case "$(uname -m)" in
    x86_64|amd64)  arch=amd64 ;;
    aarch64|arm64) arch=arm64 ;;
    *) no "no Hugo download for $(uname -m)"; return 1 ;;
  esac
  # Hugo ships one universal macOS build.
  [ "$os" = darwin ] && arch=universal
  # Extended, because that is the edition the deploy installs.
  asset="hugo_extended_${v}_${os}-${arch}.tar.gz"
  tmp="$REPO/.tools/.download"
  rm -rf "$tmp" && mkdir -p "$tmp" || return 1
  echo "  downloading $asset…"
  curl -fsSL -o "$tmp/$asset" "$base/$asset" \
    && curl -fsSL -o "$tmp/checksums.txt" "$base/hugo_${v}_checksums.txt" \
    || { no "download failed ($base/$asset)"; rm -rf "$tmp"; return 1; }
  # Verify against Hugo's published checksums before anything runs it.
  ( cd "$tmp" && grep " $asset\$" checksums.txt | sha256sum -c --quiet - ) \
    || { no "checksum mismatch for $asset — not using it"; rm -rf "$tmp"; return 1; }
  tar -xzf "$tmp/$asset" -C "$tmp" hugo || { no "could not unpack $asset"; rm -rf "$tmp"; return 1; }
  mkdir -p "$(dirname "$(pinned_bin)")" && mv "$tmp/hugo" "$(pinned_bin)" && rm -rf "$tmp"
}

if [ -x "$(pinned_bin)" ] && [ "$(hugo_version_of "$(pinned_bin)")" = "$PIN" ]; then
  ok "pinned Hugo present: .tools/hugo-$PIN/hugo"
elif [ "$CHECK_ONLY" = 1 ]; then
  block "the pinned Hugo $PIN has not been downloaded" "run: make setup (it goes in .tools/, nothing system-wide)"
else
  if download_hugo "$PIN"; then ok "downloaded and verified Hugo $PIN into .tools/hugo-$PIN/"
  else block "could not get Hugo $PIN" "see above; or set HUGO=/path/to/a-$PIN-hugo and re-run"; fi
fi

# ─────────────────────────────────────────────────────────────────────────────
step "3. The Hugo make uses"

# A mismatch here means what you test is not what ships. It fails the check,
# loudly, rather than warning.
used="$(hugo_bin)"
if [ -z "$used" ]; then
  block "no hugo at all" "run: make setup"
else
  used_v="$(hugo_version_of "$used")"
  if [ "$used_v" = "$PIN" ]; then
    ok "make uses Hugo $used_v ($used)"
  else
    block "MISMATCH: make would use Hugo ${used_v:-?} ($used), but the pin is $PIN" \
          "run make setup to get $PIN into .tools/, or unset HUGO"
  fi
  hugo_is_extended "$used" && ok "it is the extended edition, as the deploy's is" \
    || block "$used is not Hugo extended" "run make setup"
fi

# Hugo on PATH is what a bare `hugo`, `npm run dev` or `npm run build` runs.
# make never uses it once the pinned one is here, but say so when it differs.
path_hugo="$(command -v hugo 2>/dev/null || true)"
if [ -n "$path_hugo" ] && [ "$path_hugo" != "$used" ]; then
  pv="$(hugo_version_of "$path_hugo")"
  if [ "$pv" = "$PIN" ]; then ok "hugo on PATH is also $pv"
  else warn "hugo on PATH is ${pv:-not runnable from here} ($path_hugo), not $PIN — use make and scripts/hugo.sh, not bare hugo or npm run dev"; fi
fi

# ─────────────────────────────────────────────────────────────────────────────
step "4. Node packages"

# npm ci from package-lock.json, as the deploy does. (pnpm-lock.yaml is also
# tracked and the README says pnpm; the production deploy does not use it.)
install_deps() {
  ( cd "$REPO" && npm ci --no-audit --no-fund --loglevel=error ) || return 1
  lock_hash > "$REPO/node_modules/.installed-from"
}
if deps_ok; then
  ok "node_modules was installed from the package-lock.json that is here now"
elif [ "$CHECK_ONLY" = 1 ]; then
  block "the Node packages are missing or were not installed from this package-lock.json" "run: make setup"
elif install_deps; then
  ok "installed the Node packages (npm ci)"
else
  block "npm ci failed" "see the output above"
fi
[ -x "$REPO/node_modules/.bin/tailwindcss" ] && ok "tailwindcss is there (every build starts by generating the stylesheet)" \
  || { [ "$BLOCKED" = 1 ] || block "node_modules has no tailwindcss" "run: make setup"; }

# ─────────────────────────────────────────────────────────────────────────────
stop_if_blocked
if [ "$CHECK_ONLY" = 1 ]; then printf '\n%sAll checks pass.%s\n' "$bold$green" "$off"; exit 0; fi
printf '\n%sReady.%s\n' "$bold$green" "$off"
printf '  make serve     the dev server: drafts, live reload, the Tina editor at /admin/\n'
printf '  make test      production build + site checks\n'
printf '  make status    what is set up and what is running\n'
