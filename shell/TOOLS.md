# Shell Tools Reference

Tools and plugins configured in `.zshrc`. Install with:

```bash
brew install zoxide fzf eza bat git-delta tldr
```

### Nerd Font (required for eza icons)

eza uses Nerd Font icons. Without it you'll see `?` in rectangles.

```bash
brew install --cask font-fira-code-nerd-font
```

Then set your terminal font to **"FiraCode Nerd Font"** (not regular "Fira Code"):
- **Warp** → Settings → Appearance → Font → FiraCode Nerd Font
- **iTerm2** → Preferences → Profiles → Text → Font → FiraCode Nerd Font
- **Terminal.app** → Preferences → Profiles → Font → Change → FiraCode Nerd Font
- **VS Code/Cursor** → Settings → `terminal.integrated.fontFamily` → `"FiraCode Nerd Font"`

If using p10k and icons look wrong, run `p10k configure` to reconfigure.

### oh-my-zsh custom plugins (clone into `~/.oh-my-zsh/custom/plugins/`):

```bash
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-completions
git clone https://github.com/MichaelAquilina/zsh-you-should-use ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/you-should-use
```

---

## zoxide — Smart directory jumping

Learns your most-used directories. Replaces `cd` for frequent paths.

```bash
z dotfiles          # jumps to ~/Developer/Personal/dotfiles
z dev per           # fuzzy matches partial names
zi                  # interactive selection with fzf
```

## fzf — Fuzzy finder

Fuzzy search everywhere: history, files, directories.

```bash
Ctrl+R              # fuzzy search command history (replaces default)
Ctrl+T              # fuzzy find files in current dir
Alt+C               # fuzzy cd into subdirectory
vim $(fzf)          # open a fuzzy-found file in vim
```

## eza — Modern ls

Replaces `ls` with colors, icons, and git status.

```bash
ls                  # aliased to eza with icons
ll                  # long list with git status
lt                  # tree view (2 levels deep)
```

## bat — Syntax-highlighted cat

Replaces `cat` with syntax highlighting and line numbers.

```bash
cat README.md       # aliased to bat, shows highlighted output
bat --language json # force language detection
bat -p file.txt     # plain mode, no decorations
```

## git-delta — Better git diffs

Configured in `.gitconfig`. Works automatically with git commands.

```bash
git diff            # side-by-side, line numbers, syntax highlighted
git log -p          # same for log patches
git show            # same for show
```

## tldr — Simplified man pages

Community-driven cheat sheets for common commands.

```bash
tldr git rebase     # quick examples instead of full man page
tldr docker run     # practical usage patterns
tldr tar            # finally remember tar flags
```

## you-should-use — Alias reminder

Automatically reminds you when you type a command that has an alias.

```bash
$ git status        # prints: "Found existing alias for 'git status'. You should use: 'gs'"
$ docker ps         # prints: "Found existing alias for 'docker ps'. You should use: 'dps'"
```

## zsh-completions — Extra tab completions

Adds completions for docker, bun, cargo, and many more. Just press `Tab`.

## History improvements

```bash
HISTSIZE=50000                  # 50k commands in memory
SHARE_HISTORY                   # shared across all terminal tabs
HIST_IGNORE_ALL_DUPS            # no duplicate entries
HIST_IGNORE_SPACE               # prefix command with space to exclude from history
```
