#!/bin/zsh
eval "$(/opt/homebrew/bin/brew shellenv)"

# Python
PATH="/Library/Frameworks/Python.framework/Versions/3.10/bin:${PATH}"
export PATH

# JetBrains Toolbox
export PATH="$PATH:$HOME/Library/Application Support/JetBrains/Toolbox/scripts"

# Swiftly
. "$HOME/.swiftly/env.sh"
