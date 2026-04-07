#!/usr/bin/env pwsh
# ============================================================================
# dotfiles installer for Windows (PowerShell)
# Usage: pwsh setup/install.ps1 [-DryRun] [-Only shell,git,ai] [-Skip editor]
# ============================================================================

param(
    [switch]$DryRun,
    [string]$Only = "",
    [string]$Skip = ""
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$OnlyList = if ($Only) { $Only -split "," } else { @() }
$SkipList = if ($Skip) { $Skip -split "," } else { @() }

# ============================================================================
# HELPERS
# ============================================================================
function Info($msg)     { Write-Host "[+] $msg" -ForegroundColor Green }
function Warn($msg)     { Write-Host "[!] $msg" -ForegroundColor Yellow }
function SkipMsg($msg)  { Write-Host "[~] skip: $msg" -ForegroundColor DarkGray }
function Err($msg)      { Write-Host "[x] $msg" -ForegroundColor Red }

function ShouldRun($category) {
    if ($OnlyList.Count -gt 0) { return $OnlyList -contains $category }
    if ($SkipList -contains $category) { return $false }
    return $true
}

function BackupAndCopy($src, $dest, $label) {
    if (-not (Test-Path $src)) {
        SkipMsg "$label (source not found)"
        return
    }

    if ($DryRun) {
        Info "[dry-run] $label -> $dest"
        return
    }

    $destDir = Split-Path -Parent $dest
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

    if (Test-Path $dest) {
        $backup = "$dest.dotfiles-backup"
        Copy-Item $dest $backup -Force
        Info "$label -> $dest (backup: $backup)"
    } else {
        Info "$label -> $dest"
    }

    Copy-Item $src $dest -Force
}

function BackupAndCopyDir($src, $dest, $label) {
    if (-not (Test-Path $src)) {
        SkipMsg "$label (source not found)"
        return
    }

    if ($DryRun) {
        $count = (Get-ChildItem $src -Recurse -File).Count
        Info "[dry-run] $label -> $dest ($count files)"
        return
    }

    if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }
    Copy-Item "$src\*" $dest -Recurse -Force
    Info "$label -> $dest"
}

# ============================================================================
# DETECT ENVIRONMENT
# ============================================================================
$UserProfile = $env:USERPROFILE
$AppData = $env:APPDATA

Info "Detected: Windows $([System.Environment]::OSVersion.Version) ($env:PROCESSOR_ARCHITECTURE)"
if ($DryRun) {
    Warn "Dry run mode - no files will be changed"
    Write-Host ""
}

# ============================================================================
# GIT
# ============================================================================
if (ShouldRun "git") {
    Info "=== Git ==="
    BackupAndCopy "$RepoRoot\git\.gitconfig"        "$UserProfile\.gitconfig"        ".gitconfig"
    BackupAndCopy "$RepoRoot\git\.gitignore_global" "$UserProfile\.gitignore_global" ".gitignore_global"
    BackupAndCopy "$RepoRoot\git\gh\config.yml"     "$AppData\GitHub CLI\config.yml" "gh config"
    Write-Host ""
}

# ============================================================================
# EDITORS
# ============================================================================
if (ShouldRun "editor") {
    Info "=== Editors ==="
    BackupAndCopy "$RepoRoot\editor\zed\settings.json"    "$AppData\Zed\settings.json"               "Zed settings"
    BackupAndCopy "$RepoRoot\editor\cursor\settings.json"  "$AppData\Cursor\User\settings.json"       "Cursor editor settings"
    BackupAndCopy "$RepoRoot\editor\nvim\init.lua"         "$UserProfile\AppData\Local\nvim\init.lua"  "Neovim config"
    BackupAndCopy "$RepoRoot\editor\.vimrc"                "$UserProfile\_vimrc"                       ".vimrc"
    Write-Host ""
}

# ============================================================================
# SSH
# ============================================================================
if (ShouldRun "ssh") {
    Info "=== SSH ==="
    $sshDir = "$UserProfile\.ssh"
    if (-not (Test-Path $sshDir)) { New-Item -ItemType Directory -Path $sshDir -Force | Out-Null }

    BackupAndCopy "$RepoRoot\ssh\config.template" "$sshDir\config.template" "SSH config template"
    if (-not (Test-Path "$sshDir\config")) {
        BackupAndCopy "$RepoRoot\ssh\config.template" "$sshDir\config" "SSH config (from template)"
    } else {
        SkipMsg "SSH config already exists (not overwriting)"
    }
    Write-Host ""
}

# ============================================================================
# AI TOOLS
# ============================================================================
if (ShouldRun "ai") {
    Info "=== AI Tools ==="

    # Claude
    BackupAndCopy "$RepoRoot\ai\claude\CLAUDE.md"      "$UserProfile\.claude\CLAUDE.md"      "Claude CLAUDE.md"
    BackupAndCopy "$RepoRoot\ai\claude\settings.json"   "$UserProfile\.claude\settings.json"  "Claude settings"

    # Cursor
    BackupAndCopy "$RepoRoot\ai\cursor\mcp.json"        "$UserProfile\.cursor\mcp.json"       "Cursor MCP"

    # Gemini
    BackupAndCopy "$RepoRoot\ai\gemini\GEMINI.md"       "$UserProfile\.gemini\GEMINI.md"      "Gemini GEMINI.md"
    BackupAndCopy "$RepoRoot\ai\gemini\settings.json"   "$UserProfile\.gemini\settings.json"  "Gemini settings"

    # Windsurf
    BackupAndCopy "$RepoRoot\ai\windsurf\mcp_config.json" `
        "$UserProfile\.codeium\windsurf\mcp_config.json" "Windsurf MCP"

    Write-Host ""
}

# ============================================================================
# NPM / BUN
# ============================================================================
if (ShouldRun "npm") {
    Info "=== Package Managers ==="
    BackupAndCopy "$RepoRoot\npm\.npmrc"          "$UserProfile\.npmrc"        ".npmrc"
    BackupAndCopy "$RepoRoot\bun\.bunfig.toml"    "$UserProfile\.bunfig.toml"  ".bunfig.toml"
    Write-Host ""
}

# ============================================================================
# DEV TOOLS
# ============================================================================
if (ShouldRun "tools") {
    Info "=== Dev Tools ==="

    # Bun
    if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
        if ($DryRun) {
            Info "[dry-run] Would install Bun"
        } else {
            Info "Installing Bun..."
            irm bun.sh/install.ps1 | iex
        }
    } else {
        SkipMsg "Bun already installed ($(bun --version))"
    }

    # fnm (Node.js)
    if (-not (Get-Command fnm -ErrorAction SilentlyContinue)) {
        if ($DryRun) {
            Info "[dry-run] Would install fnm via winget"
        } else {
            Info "Installing fnm..."
            winget install Schniz.fnm --accept-source-agreements --accept-package-agreements
        }
    } else {
        SkipMsg "fnm already installed ($(fnm --version))"
    }

    Write-Host ""
}

# ============================================================================
# SUMMARY
# ============================================================================
Write-Host "============================================"
if ($DryRun) {
    Warn "Dry run complete - no changes made"
    Write-Host "Run without -DryRun to apply changes"
} else {
    Info "Installation complete!"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  1. Restart your terminal"
    Write-Host "  2. Review backed-up files (*.dotfiles-backup)"
    Write-Host "  3. Edit ~/.ssh/config if needed"
}
Write-Host "============================================"
