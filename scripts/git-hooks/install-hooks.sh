#!/bin/bash
# Install git hooks for astro-boke
# Creates platform-appropriate hook files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS_DIR="$SCRIPT_DIR"

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "Error: Not a git repository. Run this script from the project root."
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy PowerShell script
cp "$HOOKS_DIR/pre-commit.ps1" .git/hooks/pre-commit.ps1

# Detect OS and create appropriate wrapper
OS="$(uname -s)"
if [[ "$OS" == *"MINGW"* ]] || [[ "$OS" == *"CYGWIN"* ]] || [[ "$OS" == *"MSYS"* ]] || [[ "$OSTYPE" == "msys" ]]; then
    # Windows: create batch wrapper
    cat > .git/hooks/pre-commit << 'EOF'
@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0pre-commit.ps1"
exit /b %ERRORLEVEL%
EOF
    cp .git/hooks/pre-commit .git/hooks/pre-commit.cmd
    echo "✅ Git hooks installed! (Windows)"
else
    # Unix-like: create bash wrapper
    cat > .git/hooks/pre-commit << 'EOFWRAPPER'
#!/bin/bash
powershell -NoProfile -ExecutionPolicy Bypass -File "$(dirname "$0")/pre-commit.ps1"
exit $?
EOFWRAPPER
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks installed! (Unix)"
fi

echo ""
echo "Pre-commit checks:"
echo "  1. pnpm check"
echo "  2. Astro check"
echo "  3. Build"
echo "  4. Biome lint"
