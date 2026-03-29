# Enable Powerlevel10k instant prompt.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# Path to oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="powerlevel10k/powerlevel10k"

plugins=(git zsh-autosuggestions zsh-syntax-highlighting zsh-completions you-should-use)

source $ZSH/oh-my-zsh.sh

# ============================================================================
# LOCALE & ENVIRONMENT
# ============================================================================
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export EDITOR='nano'

# ============================================================================
# HISTORY — bigger, shared across terminals, no duplicates
# ============================================================================
HISTSIZE=50000
SAVEHIST=50000
setopt SHARE_HISTORY
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_REDUCE_BLANKS
setopt HIST_IGNORE_SPACE

# ============================================================================
# PATH CONFIGURATION
# ============================================================================
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Homebrew
if [[ -d "/opt/homebrew/bin" ]]; then
    export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"
fi

# User bin
if [[ -d "$HOME/bin" ]]; then
    export PATH="$HOME/bin:$PATH"
fi
export PATH="$HOME/.local/bin:$PATH"

# Node.js via fnm
if [[ -d "$HOME/Library/Application Support/fnm" ]]; then
    export PATH="$HOME/Library/Application Support/fnm:$PATH"
    eval "$(fnm env --use-on-cd)"
fi

# Bun
if [[ -d "$HOME/.bun" ]]; then
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    [[ -s "$HOME/.bun/_bun" ]] && source "$HOME/.bun/_bun"
fi

# Yarn
if [[ -d "$HOME/.yarn/bin" ]]; then
    export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
fi

# Java & Android
if [[ -d "/Library/Java/JavaVirtualMachines/zulu-17.jdk" ]]; then
    export JAVA_HOME="/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home"
fi

if [[ -d "$HOME/Library/Android/sdk" ]]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
    export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
fi

# Python
alias python=python3
if [[ -d "/Library/Frameworks/Python.framework/Versions/3.11/bin" ]]; then
    export PATH="/Library/Frameworks/Python.framework/Versions/3.11/bin:$PATH"
fi

# Ruby (via Homebrew)
if [[ -d "/opt/homebrew/opt/ruby/bin" ]]; then
    export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
    if command -v gem &> /dev/null; then
        export PATH="$(gem environment gemdir)/bin:$PATH"
    fi
fi

# Sublime
if [[ -d "/Applications/Sublime Text.app/Contents/SharedSupport/bin" ]]; then
    export PATH="/Applications/Sublime Text.app/Contents/SharedSupport/bin:$PATH"
fi

# Fastlane
if [[ -d "$HOME/.fastlane/bin" ]]; then
    export PATH="$HOME/.fastlane/bin:$PATH"
fi

# Windsurf
if [[ -d "$HOME/.codeium/windsurf/bin" ]]; then
    export PATH="$HOME/.codeium/windsurf/bin:$PATH"
fi

# Maestro
if [[ -d "$HOME/.maestro/bin" ]]; then
    export PATH="$PATH:$HOME/.maestro/bin"
fi

# ============================================================================
# ALIASES
# ============================================================================

# Docker
alias dcup="docker compose up"
alias dcdown="docker compose down"
alias dcps="docker compose ps"
alias dps="docker ps"

# Git
alias gs="git status"
alias gf="git fetch"
alias gp="git pull"
alias gaa="git add ."
alias gc="git commit -m"
alias gac="git commit -am"
alias gcl="git clone --recursive"

# Navigation
alias cddev="cd ~/Developer/"
alias cdfork="cd ~/Developer/FORK"
alias cdper="cd ~/Developer/Personal"
alias cdtga="cd ~/Developer/TGA"

# General
alias cls="clear"
alias pn=pnpm
alias c="code"
alias howmanylines="cloc . --exclude-dir=node_modules,.next,dist,.turbo,.git,build,public,coverage,android,ios --exclude-ext=lock,log,md,html,css,scss,svg,xml,txt,woff,woff2,ttf,otf,ico,webp,webm,mp4,mp3,webm,webp,webmanifest"

# Go
alias air='$(go env GOPATH)/bin/air'

# Android emulator
alias emulator_start="emulator -avd Pixel_4a_API_34"

# ============================================================================
# MODERN CLI TOOLS (install: brew install zoxide fzf eza bat git-delta)
# ============================================================================

# zoxide — smarter cd, learns your frequent dirs. Usage: z <partial-dir-name>
if command -v zoxide &> /dev/null; then
    eval "$(zoxide init zsh)"
fi

# fzf — fuzzy finder for history (Ctrl+R), files, and more
if command -v fzf &> /dev/null; then
    source <(fzf --zsh)
fi

# eza — modern ls with git status and icons
if command -v eza &> /dev/null; then
    alias ls="eza --icons --group-directories-first"
    alias ll="eza -la --icons --group-directories-first --git"
    alias lt="eza --tree --level=2 --icons"
fi

# bat — syntax-highlighted cat
if command -v bat &> /dev/null; then
    alias cat="bat --paging=never"
fi

# delta — better git diffs (configure in .gitconfig)

# ============================================================================
# OPTIONAL TOOLS
# ============================================================================

# Docker CLI completions
if [[ -d "$HOME/.docker/completions" ]]; then
    fpath=($HOME/.docker/completions $fpath)
    autoload -Uz compinit
    compinit
fi

# Kiro shell integration
[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path zsh)"

# Antigravity
if [[ -d "$HOME/.antigravity/antigravity/bin" ]]; then
    export PATH="$HOME/.antigravity/antigravity/bin:$PATH"
fi

# p10k theme
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
