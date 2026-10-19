#!/usr/bin/env bash
# Refuses a commit that carries something shaped like a key — or whose author
# line carries a personal e-mail address.
#
# **This repository is public**, and a push to it is forever. It needs no key
# at all — the one token a deploy uses lives outside every checkout, in
# ~/src/filmopen-keys/website/, and `.gitignore` keeps the usual files out —
# so this is the line after that, for a value pasted into a page, a test, a
# configuration or, above all, **a snapshot**: the importer refuses a document
# that carries one (src/snapshot/publish.ts), and this refuses the commit. It
# reads **what is staged** — the blobs in the index, never the working tree,
# so a value staged and then taken out of the file is still caught — and
# prints the file's name, never the value or its line.
#
#   scripts/check-no-keys.sh          the staged change
#   scripts/check-no-keys.sh --all    every file git would take: tracked, and
#                                     new and not ignored — a file that is new
#                                     is otherwise first read at the commit
#   scripts/check-no-keys.sh --push   the author lines of what is about to be
#                                     pushed (the pre-push hook; reads git's
#                                     list of refs on stdin)
#   scripts/install-hooks.sh          runs it before every commit and every push
#
# **A commit's author line is public too, and for ever** — more so than a
# page, which a later commit can at least correct. A machine's global git
# setting is usually a person's own mailbox, and this repository's first
# commit went out with one for exactly that reason. So the staged check also
# refuses a commit whose author or committer address is not one of GitHub's
# `…@users.noreply.github.com`, and never prints the address it refused. Your
# own is on GitHub under Settings → Emails; set it for this checkout alone:
#
#   git config --local user.email "<id>+<login>@users.noreply.github.com"
#
# Somebody who *means* to publish their address says so, for one command:
#
#   FILMOPEN_ALLOW_AUTHOR_ADDRESS=yes git commit …
#
# **A merge, a cherry-pick and a rebase never run the pre-commit hook**, so
# the same question is asked again where none of them can walk round it — at
# the push, of every commit about to leave: `--push`. GitHub's own
# `noreply@github.com`, the committer of a merge made on its site, is let
# through as well. **`--no-verify` skips either hook, by git's design**: these
# guard a slip, not somebody who has decided to get past them.
set -uo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# An address GitHub made up for the purpose, or GitHub's own.
private_address() {
  case "$1" in
    *@users.noreply.github.com | noreply@github.com) return 0 ;;
    *) return 1 ;;
  esac
}

how_to_fix() {
  echo
  echo "This repository is public, and a commit's author line stays in its history"
  echo "for ever. Use your GitHub noreply address in this checkout (GitHub → Settings"
  echo "→ Emails shows it):"
  echo '  git config --local user.email "<id>+<login>@users.noreply.github.com"'
  echo "or, to publish your own address on purpose, for this one command:"
  echo "  FILMOPEN_ALLOW_AUTHOR_ADDRESS=yes git $1 …"
}

if [ "${1:-}" = "--push" ]; then
  [ "${FILMOPEN_ALLOW_AUTHOR_ADDRESS:-}" = "yes" ] && exit 0
  remote="${2:-origin}"
  exposed=''
  while read -r _ local_sha _ remote_sha; do
    case "$local_sha" in *[!0]*) ;; *) continue ;; esac # a deletion pushes no commit
    case "$remote_sha" in
      *[!0]*) range=("$remote_sha..$local_sha") ;;
      *) range=("$local_sha" --not "--remotes=$remote") ;; # a new branch: what that remote has not seen
    esac
    if ! listed="$(git log --format='%h|%ae|%ce' "${range[@]}" 2>/dev/null)"; then
      echo "the commits about to be pushed could not be listed, so their author lines were not read."
      echo "Fetch first: the remote holds something this checkout does not."
      exit 1
    fi
    while IFS='|' read -r id author committer; do
      [ -n "$id" ] || continue
      if ! private_address "$author" || ! private_address "$committer"; then exposed="$exposed $id"; fi
    done <<<"$listed"
  done
  if [ -n "$exposed" ]; then
    echo "these commits carry an author or committer address that is not a GitHub noreply"
    echo "address, and it is not printed here:$exposed"
    how_to_fix push
    echo "To correct a commit that is not pushed yet: git commit --amend --reset-author,"
    echo "or git rebase -r <base> --exec 'git commit --amend --no-edit --reset-author'."
    exit 1
  fi
  echo "no personal address in what is about to be pushed"
  exit 0
fi

# The shapes the services this repository talks to actually use, in one pass:
# a Stripe key or webhook secret, a Resend key, a Supabase publishable or
# secret key, a signed token of three base64url parts (a Supabase session, a
# GitHub app token), a GitHub token classic or fine-grained, a Slack bot or
# app token, an OpenAI key, a Google API key (the YouTube key of the plan's
# D12) or OAuth secret or token, a PEM private key encrypted or not, an AWS or
# R2 access key id. Cloudflare's own API
# token has no prefix and forty ordinary characters, so it cannot be matched
# without catching every hash in the repository: what guards it is that it
# never leaves the keys folder, and that `scripts/deploy.sh` is the only thing
# here that reads it.
#
# Every prefix is anchored on a non-word character, because a value appears
# after a quote, a space, a colon or an equals sign, while a *word* ending in
# the same letters does not: without the anchor, Workers AI's generated type
# `Ai_Cf_Aisingapore_Gemma_Sea_Lion_…` reads as a Resend key, which is how
# this check first refused its own repository.
readonly NOT_A_WORD='(^|[^A-Za-z0-9_-])'
readonly KEYS="${NOT_A_WORD}(sk|rk)_(test|live)_[A-Za-z0-9]{20,}|${NOT_A_WORD}whsec_[A-Za-z0-9]{20,}|${NOT_A_WORD}re_[A-Za-z0-9_-]{20,}|${NOT_A_WORD}sb_(publishable|secret)_[A-Za-z0-9_-]{20,}|${NOT_A_WORD}eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|GOCSPX-[A-Za-z0-9_-]{20,}|ya29\.[A-Za-z0-9_-]{30,}|BEGIN (RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY|${NOT_A_WORD}AKIA[0-9A-Z]{16}|${NOT_A_WORD}gh[pousr]_[A-Za-z0-9]{36}|${NOT_A_WORD}github_pat_[A-Za-z0-9_]{60,}|${NOT_A_WORD}AIza[0-9A-Za-z_-]{35}|${NOT_A_WORD}xox[baprs]-[A-Za-z0-9-]{10,}|${NOT_A_WORD}xapp-[0-9]-[A-Za-z0-9-]{10,}|${NOT_A_WORD}sk-(proj-|ant-)?[A-Za-z0-9_-]{32,}|${NOT_A_WORD}xai-[A-Za-z0-9_-]{40,}"

if [ "${1:-}" = "--all" ]; then
  # `--name-only`: the names, never the match itself; -I skips binaries.
  # `-a`, not `-I`: a picture is read as text too. A key can sit in a PNG's
  # text chunk or after its end, where no eye looking at the picture finds it,
  # and compressed bytes hold no run long enough to be taken for one.
  hits=$(git grep -aE --name-only -e "$KEYS" -- . 2>/dev/null || true)
  # And what is new and not ignored, which `git grep` does not read: the
  # website's first version of this sweep passed over a key-shaped test
  # fixture twice for exactly that reason, and the hook caught it at the commit.
  while IFS= read -r -d '' path; do
    if grep -aqE -e "$KEYS" -- "$path" 2>/dev/null; then hits="$hits"$'\n'"$path"; fi
  done < <(git ls-files --others --exclude-standard -z)
  where='every file git would take'
else
  # The staged paths, NUL-separated so that a name with a space stays one
  # name (`docs/FilmOpen-Milestone 1.0 Plan.md` is four words to a shell).
  staged=()
  while IFS= read -r -d '' path; do staged+=("$path"); done < <(git diff --cached --name-only --diff-filter=ACMR -z)
  hits=''
  if [ "${#staged[@]}" -gt 0 ]; then
    # `--cached` reads the index: what will be committed, whatever the
    # working file says by now.
    hits=$(git grep --cached -aE --name-only -e "$KEYS" -- "${staged[@]}" 2>/dev/null || true)
  fi
  where='the staged change'
fi

# The author line, for a commit about to be made. Git hands a hook the author
# it settled on — `--author`, an amended commit's, or the configuration's — so
# `git var` answers for the commit and not merely for the checkout.
if [ "${1:-}" != "--all" ] && [ "${FILMOPEN_ALLOW_AUTHOR_ADDRESS:-}" != "yes" ]; then
  for ident in GIT_AUTHOR_IDENT GIT_COMMITTER_IDENT; do
    who="$(printf '%s' "${ident%_IDENT}" | tr 'A-Z' 'a-z' | sed 's/^git_//')"
    address="$(git var "$ident" 2>/dev/null | sed -E 's/^.*<([^>]*)>.*$/\1/')"
    case "$address" in
      *@users.noreply.github.com | noreply@github.com) ;;
      *)
        echo "this commit's $who address is not a GitHub noreply address, and it is not printed here."
        how_to_fix commit
        exit 1
        ;;
    esac
  done
fi

# This script carries the shapes themselves, which is not a key.
hits=$(printf '%s\n' "$hits" | grep -v '^scripts/check-no-keys\.sh$' | grep -v '^$' || true)

if [ -n "$hits" ]; then
  echo "something shaped like a key is in:"
  printf '%s\n' "$hits" | sed 's/^/  /'
  echo
  echo "This repository is public and needs no key. If it is in a snapshot,"
  echo "take it out of the document where it is kept and import again; if it"
  echo "is a test's stand-in, put it together at runtime."
  exit 1
fi
echo "no keys in $where"
