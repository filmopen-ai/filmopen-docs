#!/usr/bin/env bash
# Puts scripts/check-no-keys.sh in front of every commit and every push in
# this checkout. Run once per clone; each hook is one line, so a later change
# to the check needs no reinstall.
#
# Two hooks, because a merge, a cherry-pick and a rebase make commits without
# running the first: what a commit's author line says is asked again at the
# push, which is the moment it becomes public.
set -euo pipefail
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
hooks="$(git -C "$repo" rev-parse --git-path hooks)"
mkdir -p "$hooks"

cat > "$hooks/pre-commit" <<'HOOK'
#!/usr/bin/env bash
# Installed by scripts/install-hooks.sh.
exec "$(git rev-parse --show-toplevel)/scripts/check-no-keys.sh"
HOOK
cat > "$hooks/pre-push" <<'HOOK'
#!/usr/bin/env bash
# Installed by scripts/install-hooks.sh. git gives the remote's name, and the
# refs being pushed on stdin.
exec "$(git rev-parse --show-toplevel)/scripts/check-no-keys.sh" --push "$1"
HOOK
chmod +x "$hooks/pre-commit" "$hooks/pre-push"
echo "installed $hooks/pre-commit and $hooks/pre-push"
