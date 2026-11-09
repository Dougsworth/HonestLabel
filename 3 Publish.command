#!/bin/zsh -l
cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
{
echo "== $(date)"
git rev-parse --git-dir >/dev/null 2>&1 || git init
git branch -M main 2>/dev/null
git add -A
git commit -q -m "Honest Label: SPECS Lens built with CLAD from the plan-lens brief

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && echo committed || echo "nothing new to commit"
if ! command -v gh >/dev/null; then echo "NO_GH"; exit 1; fi
gh auth status 2>&1 | head -3
if git remote get-url origin >/dev/null 2>&1; then
  git push -u origin main 2>&1 | tail -3
else
  gh repo create HonestLabel --public --source . --remote origin --push --description "Honest Label: a SPECS Lens that shows the sugar in a drink as real size sugar cubes beside it" 2>&1 | tail -5
fi
echo "URL: $(gh repo view --json url -q .url 2>&1)"
} 2>&1 | tee publish-log.txt
