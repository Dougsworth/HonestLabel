#!/bin/zsh -l
cd "$(dirname "$0")"
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
echo "Honest Label: running plan-lens..."
claude -p "$(cat plan-answers.md)" --permission-mode acceptEdits --allowedTools "Read" "Write" "Edit" "Glob" "Grep" "Skill" "Bash(mkdir:*)" "Bash(ls:*)" 2>&1 | tee plan-log.txt
echo
echo "=== PLAN DONE ==="
