#!/bin/bash
# ============================================================================
# dotfiles installer — set up a new machine from this repo
# Usage: bash setup/install.sh [--dry-run] [--only shell,git,ai] [--skip editor]
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
DRY_RUN=false
ONLY=()
SKIP=()

# ============================================================================
# PARSE ARGS
# ============================================================================
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run) DRY_RUN=true; shift ;;
        --only) IFS=',' read -ra ONLY <<< "$2"; shift 2 ;;
        --skip) IFS=',' read -ra SKIP <<< "$2"; shift 2 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# ============================================================================
# HELPERS
# ============================================================================
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
DIM='\033[2m'
RESET='\033[0m'

info()    { echo -e "${GREEN}[+]${RESET} $1"; }
warn()    { echo -e "${YELLOW}[!]${RESET} $1"; }
skip_msg(){ echo -e "${DIM}[~] skip: $1${RESET}"; }
err()     { echo -e "${RED}[x]${RESET} $1"; }

should_run() {
    local category="$1"
    if [[ ${#ONLY[@]} -gt 0 ]]; then
        for o in "${ONLY[@]}"; do [[ "$o" == "$category" ]] && return 0; done
        return 1
    fi
    for s in "${SKIP[@]}"; do [[ "$s" == "$category" ]] && return 1; done
    return 0
}

backup_and_copy() {
    local src="$1"
    local dest="$2"
    local label="$3"

    if [[ ! -f "$src" ]]; then
        skip_msg "$label (source not found)"
        return
    fi

    if $DRY_RUN; then
        info "[dry-run] $label → $dest"
        return
    fi

    mkdir -p "$(dirname "$dest")"

    if [[ -f "$dest" ]]; then
        local backup="${dest}.dotfiles-backup"
        cp "$dest" "$backup"
        info "$label → $dest (backup: ${backup})"
    else
        info "$label → $dest"
    fi

    cp "$src" "$dest"
}

backup_and_copy_dir() {
    local src="$1"
    local dest="$2"
    local label="$3"

    if [[ ! -d "$src" ]]; then
        skip_msg "$label (source not found)"
        return
    fi

    if $DRY_RUN; then
        local count
        count=$(find "$src" -type f | wc -l | tr -d ' ')
        info "[dry-run] $label → $dest ($count files)"
        return
    fi

    mkdir -p "$dest"
    cp -R "$src/." "$dest/"
    info "$label → $dest"
}

# ============================================================================
# DETECT ENVIRONMENT
# ============================================================================
OS="$(uname -s)"
ARCH="$(uname -m)"
info "Detected: $OS $ARCH"

if $DRY_RUN; then
    warn "Dry run mode — no files will be changed"
    echo ""
fi

# ============================================================================
# SHELL
# ============================================================================
if should_run "shell"; then
    info "=== Shell ==="
    backup_and_copy "$REPO_ROOT/shell/.zshrc"         "$HOME/.zshrc"         ".zshrc"
    backup_and_copy "$REPO_ROOT/shell/.zprofile"      "$HOME/.zprofile"      ".zprofile"
    backup_and_copy "$REPO_ROOT/shell/.bash_profile"  "$HOME/.bash_profile"  ".bash_profile"
    backup_and_copy "$REPO_ROOT/shell/.bashrc"        "$HOME/.bashrc"        ".bashrc"
    echo ""
fi

# ============================================================================
# GIT
# ============================================================================
if should_run "git"; then
    info "=== Git ==="
    backup_and_copy "$REPO_ROOT/git/.gitconfig"        "$HOME/.gitconfig"        ".gitconfig"
    backup_and_copy "$REPO_ROOT/git/.gitignore_global" "$HOME/.gitignore_global" ".gitignore_global"
    backup_and_copy "$REPO_ROOT/git/gh/config.yml"     "$HOME/.config/gh/config.yml" "gh config"
    echo ""
fi

# ============================================================================
# TERMINAL
# ============================================================================
if should_run "terminal"; then
    info "=== Terminal ==="
    backup_and_copy "$REPO_ROOT/terminal/.p10k.zsh" "$HOME/.p10k.zsh" ".p10k.zsh"
    echo ""
fi

# ============================================================================
# EDITORS
# ============================================================================
if should_run "editor"; then
    info "=== Editors ==="
    backup_and_copy "$REPO_ROOT/editor/zed/settings.json" "$HOME/.config/zed/settings.json" "Zed settings"

    if [[ "$OS" == "Darwin" ]]; then
        backup_and_copy "$REPO_ROOT/editor/cursor/settings.json" \
            "$HOME/Library/Application Support/Cursor/User/settings.json" "Cursor editor settings"
    else
        backup_and_copy "$REPO_ROOT/editor/cursor/settings.json" \
            "$HOME/.config/Cursor/User/settings.json" "Cursor editor settings"
    fi
    echo ""
fi

# ============================================================================
# SSH
# ============================================================================
if should_run "ssh"; then
    info "=== SSH ==="
    backup_and_copy "$REPO_ROOT/ssh/config.template" "$HOME/.ssh/config.template" "SSH config template"
    if [[ ! -f "$HOME/.ssh/config" ]]; then
        backup_and_copy "$REPO_ROOT/ssh/config.template" "$HOME/.ssh/config" "SSH config (from template)"
    else
        skip_msg "SSH config already exists (not overwriting — use template manually)"
    fi
    chmod 700 "$HOME/.ssh" 2>/dev/null || true
    echo ""
fi

# ============================================================================
# AI TOOLS
# ============================================================================
if should_run "ai"; then
    info "=== AI Tools ==="

    # Claude
    backup_and_copy "$REPO_ROOT/ai/claude/CLAUDE.md"      "$HOME/.claude/CLAUDE.md"      "Claude CLAUDE.md"
    backup_and_copy "$REPO_ROOT/ai/claude/settings.json"   "$HOME/.claude/settings.json"  "Claude settings"

    # Cursor
    backup_and_copy "$REPO_ROOT/ai/cursor/mcp.json"        "$HOME/.cursor/mcp.json"       "Cursor MCP"

    # Gemini
    backup_and_copy "$REPO_ROOT/ai/gemini/GEMINI.md"       "$HOME/.gemini/GEMINI.md"      "Gemini GEMINI.md"
    backup_and_copy "$REPO_ROOT/ai/gemini/settings.json"   "$HOME/.gemini/settings.json"  "Gemini settings"

    # Windsurf
    backup_and_copy "$REPO_ROOT/ai/windsurf/mcp_config.json" \
        "$HOME/.codeium/windsurf/mcp_config.json" "Windsurf MCP"

    echo ""
fi

# ============================================================================
# HOMEBREW (macOS only)
# ============================================================================
if should_run "brew" && [[ "$OS" == "Darwin" ]]; then
    info "=== Homebrew ==="

    if ! command -v brew &>/dev/null; then
        if $DRY_RUN; then
            info "[dry-run] Would install Homebrew"
        else
            info "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
    else
        info "Homebrew already installed ($(brew --version | head -1))"
    fi

    echo ""
fi

# ============================================================================
# OH-MY-ZSH
# ============================================================================
if should_run "shell"; then
    if [[ ! -d "$HOME/.oh-my-zsh" ]]; then
        if $DRY_RUN; then
            info "[dry-run] Would install oh-my-zsh"
        else
            info "Installing oh-my-zsh..."
            sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
        fi
    else
        skip_msg "oh-my-zsh already installed"
    fi

    # zsh plugins
    ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
    declare -A ZSH_PLUGINS=(
        ["zsh-autosuggestions"]="https://github.com/zsh-users/zsh-autosuggestions"
        ["zsh-syntax-highlighting"]="https://github.com/zsh-users/zsh-syntax-highlighting"
        ["zsh-completions"]="https://github.com/zsh-users/zsh-completions"
        ["you-should-use"]="https://github.com/MichaelAqwortsmenaq/you-should-use"
    )

    for plugin in "${!ZSH_PLUGINS[@]}"; do
        if [[ ! -d "$ZSH_CUSTOM/plugins/$plugin" ]]; then
            if $DRY_RUN; then
                info "[dry-run] Would clone $plugin"
            else
                info "Installing zsh plugin: $plugin"
                git clone "${ZSH_PLUGINS[$plugin]}" "$ZSH_CUSTOM/plugins/$plugin" --depth 1 --quiet
            fi
        else
            skip_msg "$plugin already installed"
        fi
    done

    # Powerlevel10k theme
    if [[ ! -d "$ZSH_CUSTOM/themes/powerlevel10k" ]]; then
        if $DRY_RUN; then
            info "[dry-run] Would clone powerlevel10k"
        else
            info "Installing powerlevel10k theme"
            git clone https://github.com/romkatv/powerlevel10k.git "$ZSH_CUSTOM/themes/powerlevel10k" --depth 1 --quiet
        fi
    else
        skip_msg "powerlevel10k already installed"
    fi

    echo ""
fi

# ============================================================================
# DEV TOOLS (macOS)
# ============================================================================
if should_run "tools" && [[ "$OS" == "Darwin" ]]; then
    info "=== Dev Tools ==="

    # Bun
    if ! command -v bun &>/dev/null; then
        if $DRY_RUN; then
            info "[dry-run] Would install Bun"
        else
            info "Installing Bun..."
            curl -fsSL https://bun.sh/install | bash
        fi
    else
        skip_msg "Bun already installed ($(bun --version))"
    fi

    # fnm (Node.js)
    if ! command -v fnm &>/dev/null; then
        if $DRY_RUN; then
            info "[dry-run] Would install fnm"
        else
            info "Installing fnm..."
            curl -fsSL https://fnm.vercel.app/install | bash
        fi
    else
        skip_msg "fnm already installed ($(fnm --version))"
    fi

    # Modern CLI tools via brew
    if command -v brew &>/dev/null; then
        BREW_TOOLS=(zoxide fzf eza bat git-delta)
        for tool in "${BREW_TOOLS[@]}"; do
            if ! command -v "$tool" &>/dev/null; then
                if $DRY_RUN; then
                    info "[dry-run] Would brew install $tool"
                else
                    info "Installing $tool..."
                    brew install "$tool" --quiet
                fi
            else
                skip_msg "$tool already installed"
            fi
        done
    fi

    echo ""
fi

# ============================================================================
# SUMMARY
# ============================================================================
echo "============================================"
if $DRY_RUN; then
    warn "Dry run complete — no changes made"
    echo "Run without --dry-run to apply changes"
else
    info "Installation complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Restart your terminal (or: source ~/.zshrc)"
    echo "  2. Review backed-up files (*.dotfiles-backup)"
    echo "  3. Edit ~/.ssh/config if needed"
fi
echo "============================================"
