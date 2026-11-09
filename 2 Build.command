#!/bin/zsh -l
cd "$(dirname "$0")"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh" && nvm use default >/dev/null 2>&1
export PATH="$HOME/.local/bin:$PATH"
echo "node: $(which node) $(node -v 2>&1)"
claude plugin marketplace add https://github.com/lens-studio-devs/ls-extensions.git 2>&1 | tail -2
claude plugin install ls-clad@ls-extensions --scope project 2>&1 | tail -3
claude plugin list 2>&1 | grep -i clad
MODE=acceptEdits
if claude --help 2>&1 | grep -q "auto"; then MODE=auto; fi
echo "Honest Label: starting CLAD build (permission mode: $MODE)"
claude --permission-mode $MODE "$(cat build-prompt.md)"
