#!/usr/bin/env bash
# Deploys this checkout to one environment, with the Cloudflare token in that
# one command's environment and nowhere else.
#
#   scripts/deploy.sh dev
#   scripts/deploy.sh production
#
# **It takes the environment's name, and nothing else.** The website's wrapper
# (filmopen-web, scripts/cf.sh) was talked into printing its token six times
# before its arguments were allowlisted; this one has no arguments to allow.
# It runs exactly `wrangler deploy --env <name>`, in this repository.
#
# Before a token is loaded it holds `wrangler.jsonc` to `src/config/site.ts`
# (`npm run check:config`), which also refuses the files wrangler would read
# *instead*, and it builds the site — so that nothing a build runs, of ours or
# of a dependency's, ever has the token in its environment. Then the variables
# that redirect a request or its trust are unset, and wrangler runs.
#
# It is needed rarely: each branch builds and deploys itself in Workers
# Builds. It exists for a Worker's first deploy — a Git connection attaches to
# a Worker, and a Worker exists only once something has deployed it — and for
# looking at a change on the development site before it is pushed.
#
# The token lives outside every checkout, in ~/src/filmopen-keys/website/
# (FILMOPEN_KEYS overrides the folder). This repository is public, and holds
# no value of any kind; what it says here is only where one is kept.
#
# **What this does not promise.** It keeps the token out of a build's
# *environment*; it cannot keep a build from reading the key *file*, whose
# place is written above, nor from rewriting wrangler.jsonc after it was
# checked. Whoever can run code in this checkout — a dependency's script, a
# merged pull request's — or edit this file, the keys folder or the
# configuration, has the token; so does whoever sets FILMOPEN_WRANGLER, which
# names the binary that is given it (it is how the tests put a stand-in there,
# and the website's wrapper has the same door). This guards a slip, not an
# adversary with a shell. **So: run it on a checkout you have read**, and
# never on a contributor's branch that has not been reviewed.
set -euo pipefail

refuse() {
  echo "deploy.sh: $1" >&2
  exit 2
}

[ "$#" -eq 1 ] || refuse "give the environment and nothing else: dev or production"
case "$1" in
  dev | production) environment="$1" ;;
  *) refuse "'$1' is not an environment of this site: dev or production" ;;
esac

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
keys="${FILMOPEN_KEYS:-$HOME/src/filmopen-keys/website}"
env_file="$keys/cloudflare.env"

[ -r "$env_file" ] || refuse "cannot read $env_file"
mode="$(stat -c '%a' "$env_file")"
[ "$mode" = "600" ] || refuse "$env_file is mode $mode; a token file is 600"

cd "$repo"

# Everything that runs code of the repository's or of a dependency's happens
# here, before the token exists in this shell.
node scripts/check-config.ts
# The build is told which site it is, for the pages' canonical addresses
# (astro.config.mjs); Cloudflare's own builds know it from the branch.
FILMOPEN_DOCS_ENVIRONMENT="$environment" npm run --silent build

# The repository's own wrangler. FILMOPEN_WRANGLER names another, which is how
# test/deploy-sh.spec.ts puts a stand-in in its place and reads what it was given.
wrangler="${FILMOPEN_WRANGLER:-node_modules/.bin/wrangler}"
[ -x "$wrangler" ] || refuse "no wrangler at $wrangler — npm install first"

# Read, and deliberately not exported: a variable of this shell only, until
# the one command that needs it.
# shellcheck source=/dev/null
. "$env_file"
: "${CLOUDFLARE_API_TOKEN:?deploy.sh: $env_file carries no CLOUDFLARE_API_TOKEN}"
: "${CLOUDFLARE_ACCOUNT_ID:?deploy.sh: $env_file carries no CLOUDFLARE_ACCOUNT_ID}"
case "$CLOUDFLARE_API_TOKEN" in
  *[!A-Za-z0-9_-]*) refuse "the token in $env_file carries a character a Cloudflare token does not" ;;
esac

# Where wrangler sends the token, and what it trusts on the way, is not a
# caller's to choose.
# Nor which credential it sends: a global key in the environment is preferred
# by wrangler over the token, and would act as the whole account.
unset CLOUDFLARE_API_BASE_URL CF_API_BASE_URL CLOUDFLARE_API_URL \
  CLOUDFLARE_EMAIL CLOUDFLARE_API_KEY CLOUDFLARE_API_USER_SERVICE_KEY CF_EMAIL CF_API_KEY \
  SSL_CERT_FILE SSL_CERT_DIR NODE_EXTRA_CA_CERTS NODE_OPTIONS NODE_TLS_REJECT_UNAUTHORIZED \
  http_proxy https_proxy HTTP_PROXY HTTPS_PROXY all_proxy ALL_PROXY NO_PROXY no_proxy

CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
  CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID" \
  exec "$wrangler" deploy --env "$environment"
