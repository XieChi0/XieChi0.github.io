#!/bin/bash
# Install git hooks for astro-boke

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

# Detect platform and copy appropriate hook
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" || -n "$PROGRAMFILES" ]]; then
    # Windows: copy PowerShell wrapper and script
    cp "$HOOKS_DIR/pre-push.ps1" .git/hooks/pre-push.ps1
    cat > .git/hooks/pre-push << 'EOF'
# Wrapper for Windows PowerShell pre-push hook
hookDir="$(dirname "$0")"
if command -v powershell >/dev/null 2>&1; then
    powershell -File "$hookDir/pre-push.ps1"
else
    echo "Error: PowerShell is not installed"
    exit 1
fi
EOF
    chmod +x .git/hooks/pre-push
    echo "✅ Git hooks installed successfully! (PowerShell version)"
else
    # Unix-like: copy bash script
    cp "$HOOKS_DIR/pre-push" .git/hooks/pre-push
    chmod +x .git/hooks/pre-push
    echo "✅ Git hooks installed successfully! (Bash version)"
fi

echo ""
echo "The following checks will run before every push:"
echo "  1. pnpm availability check"
echo "  2. pnpm install (if needed)"
echo "  3. Astro check"
echo "  4. Build"
echo "  5. Biome lint"
echo ""
echo "These checks mirror your GitHub Actions workflows."
