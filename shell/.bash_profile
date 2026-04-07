# ============================================================================
# LOCALE & ENVIRONMENT
# ============================================================================
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export EDITOR='nano'

# ============================================================================
# HISTORY
# ============================================================================
HISTSIZE=50000
HISTFILESIZE=50000
HISTCONTROL=ignoreboth:erasedups
shopt -s histappend

# ============================================================================
# PATH CONFIGURATION
# ============================================================================
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Homebrew
if [[ -d "/opt/homebrew/bin" ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# User bin
[[ -d "$HOME/bin" ]] && export PATH="$HOME/bin:$PATH"
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
fi

# Yarn
[[ -d "$HOME/.yarn/bin" ]] && export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

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
[[ -d "/Library/Frameworks/Python.framework/Versions/3.11/bin" ]] && export PATH="/Library/Frameworks/Python.framework/Versions/3.11/bin:$PATH"

# Ruby (via Homebrew)
if [[ -d "/opt/homebrew/opt/ruby/bin" ]]; then
    export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
    command -v gem &>/dev/null && export PATH="$(gem environment gemdir)/bin:$PATH"
fi

# Rust
[[ -f "$HOME/.cargo/env" ]] && . "$HOME/.cargo/env"

# Conda / Mambaforge
if [[ -d "$HOME/mambaforge" ]]; then
    __conda_setup="$("$HOME/mambaforge/bin/conda" 'shell.bash' 'hook' 2>/dev/null)"
    if [ $? -eq 0 ]; then
        eval "$__conda_setup"
    else
        . "$HOME/mambaforge/etc/profile.d/conda.sh" 2>/dev/null || export PATH="$HOME/mambaforge/bin:$PATH"
    fi
    unset __conda_setup
fi

# Fastlane
[[ -d "$HOME/.fastlane/bin" ]] && export PATH="$HOME/.fastlane/bin:$PATH"

# Windsurf
[[ -d "$HOME/.codeium/windsurf/bin" ]] && export PATH="$HOME/.codeium/windsurf/bin:$PATH"

# Maestro
[[ -d "$HOME/.maestro/bin" ]] && export PATH="$PATH:$HOME/.maestro/bin"

# Swiftly
[[ -f "$HOME/.swiftly/env.sh" ]] && . "$HOME/.swiftly/env.sh"

# JetBrains Toolbox
[[ -d "$HOME/Library/Application Support/JetBrains/Toolbox/scripts" ]] && export PATH="$PATH:$HOME/Library/Application Support/JetBrains/Toolbox/scripts"

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

# Go
alias air='$(go env GOPATH)/bin/air'

# Android emulator
alias emulator_start="emulator -avd Pixel_4a_API_34"

# ============================================================================
# MODERN CLI TOOLS
# ============================================================================

# zoxide
command -v zoxide &>/dev/null && eval "$(zoxide init bash)"

# fzf
command -v fzf &>/dev/null && eval "$(fzf --bash)"

# eza
if command -v eza &>/dev/null; then
    alias ls="eza --icons --group-directories-first"
    alias ll="eza -la --icons --group-directories-first --git"
    alias lt="eza --tree --level=2 --icons"
fi

# bat
command -v bat &>/dev/null && alias cat="bat --paging=never"

# ============================================================================
# OPTIONAL
# ============================================================================

# Docker CLI completions
[[ -d "$HOME/.docker/completions" ]] && . "$HOME/.docker/completions/docker.bash-completion" 2>/dev/null

# Kiro shell integration
[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path bash)"

# Antigravity
[[ -d "$HOME/.antigravity/antigravity/bin" ]] && export PATH="$HOME/.antigravity/antigravity/bin:$PATH"

# Source bashrc
[[ -f "$HOME/.bashrc" ]] && . "$HOME/.bashrc"
