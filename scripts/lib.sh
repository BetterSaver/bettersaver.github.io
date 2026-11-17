# Shared by scripts/*.sh. Source it; do not run it.
#
# Two jobs: decide WHICH hugo every command uses, and make a production build
# here come out the same as the one the deploy makes, without editing a
# tracked file to do it.

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# The Hugo the production deploy builds with (.github/workflows/hugo.yml,
# HUGO_VERSION), extended edition. The deploy is what decides: change it there
# first, then here. `make check` fails while the two differ.
HUGO_PIN="0.161.1"

# Where production is served. The deploy takes its base URL from the GitHub
# Pages settings, not from config.toml (which says localhost:1313), so a local
# production build has to be told.
SITE_URL="https://bettersaver.co.nz/"
# The app the marketing site links into. config.toml carries the local
# address; the deploy rewrites it to this one.
APP_URL="https://app.bettersaver.co.nz"

die()  { printf '\033[31m✗\033[0m %s\n' "$1" >&2; shift; for l in "$@"; do printf '  \033[2m%s\033[0m\n' "$l" >&2; done; exit 1; }
say()  { printf '\033[2m%s\033[0m\n' "$*" >&2; }

pinned_version() { printf '%s' "$HUGO_PIN"; }

# Where `make setup` puts the pinned hugo. Inside the checkout, gitignored, and
# per-version, so a pin change never runs a stale binary. Nothing is installed
# system-wide.
pinned_bin() { printf '%s/.tools/hugo-%s/hugo' "$REPO" "$(pinned_version)"; }

# The hugo every script uses: $HUGO if you set it, else the pinned download,
# else whatever is on PATH (which `make check` will tell you is wrong).
hugo_bin() {
  if [ -n "${HUGO:-}" ]; then printf '%s' "$HUGO"
  elif [ -x "$(pinned_bin)" ]; then pinned_bin
  else command -v hugo 2>/dev/null || true
  fi
}

# "0.161.1" from "hugo v0.161.1-…+extended linux/amd64 …"
hugo_version_of() { "$1" version 2>/dev/null | sed -nE 's/^hugo v([0-9]+\.[0-9]+\.[0-9]+).*/\1/p'; }
hugo_is_extended() { "$1" version 2>/dev/null | grep -q '+extended'; }

# Node packages are "installed" when node_modules was installed from the
# package-lock.json that is there now. npm ci leaves nothing to compare
# against, so setup leaves a stamp: the lockfile's hash, next to the packages.
# npm and package-lock.json, not pnpm, because that is what the deploy uses.
lock_hash() { sha256sum "$REPO/package-lock.json" 2>/dev/null | cut -d' ' -f1; }
deps_ok()   { [ -n "$(lock_hash)" ] && [ "$(cat "$REPO/node_modules/.installed-from" 2>/dev/null)" = "$(lock_hash)" ]; }

# The stylesheet Tailwind generates is gitignored and Hugo reads it as an
# asset, so every build starts by making it. Without it the site builds and
# has no Tailwind styles.
build_css() {
  [ -x "$REPO/node_modules/.bin/tailwindcss" ] || die "the Node packages are not installed" "run: make setup"
  ( cd "$REPO" && npm run --silent build:css >/dev/null 2>&1 ) || die "npm run build:css failed" "run it by hand to see why"
}

# The production deploy edits two tracked files in place before it builds
# (.github/workflows/hugo.yml): it rewrites the app's local address in
# config.toml, and copies funds-prod.json over funds.json, which holds test
# funds. Doing that here would leave both modified in your working tree.
#
# So: write the rewritten config into $1, and put the production funds where
# a mount in that config lays them over the theme's copy. A third mount leaves
# out static/admin/, which the deploy never has. Prints the config's
# path; build with `hugo --config <that>`. Nothing tracked is touched.
production_config() {
  local dir="$1" rel
  rel="${dir#"$REPO"/}"
  mkdir -p "$dir/assets/ananke/data" || return 1
  cp "$REPO/themes/bettersaver/assets/ananke/data/funds-prod.json" "$dir/assets/ananke/data/funds.json" || return 1
  {
    sed -e "s|http://localhost:4200|$APP_URL|g" -e "s|http://localhost:4250|$APP_URL|g" "$REPO/config.toml"
    printf '\n# Added by scripts/lib.sh: the production funds, over the theme'"'"'s test funds.\n'
    printf '[[module.mounts]]\n  source = "assets"\n  target = "assets"\n'
    printf '[[module.mounts]]\n  source = "%s/assets"\n  target = "assets"\n' "$rel"
    # static/admin/ is Tina's generated admin: gitignored, absent from the
    # deploy's checkout, and rewritten by every `make serve`. Leave it out.
    printf '[[module.mounts]]\n  source = "static"\n  target = "static"\n  files = ["! admin/index.html", "! admin/assets/**"]\n'
  } > "$dir/config.toml" || return 1
  printf '%s' "$rel/config.toml"
}

# The flags the deploy builds with, and its environment. make build, make test
# and make preview share them, so that what is tested is what is shipped.
BUILD_FLAGS=(--minify --baseURL "$SITE_URL")
production_env() { export HUGO_ENVIRONMENT=production HUGO_ENV=production; }

# True if nothing is listening on 127.0.0.1:$1. bash's /dev/tcp, so it needs no nc.
port_free() { ! (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null; }
