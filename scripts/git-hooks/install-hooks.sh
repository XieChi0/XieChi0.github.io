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

# Copy the pre-push hook
cp "$HOOKS_DIR/pre-push" .git/hooks/pre-push
chmod +x .git/hooks/pre-push

echo "✅ Git hooks installed successfully!"
echo ""
echo "The following checks will run before every push:"
echo "  1. pnpm availability check"
echo "  2. pnpm install (if needed)"
echo "  3. Astro check"
echo "  4. Build"
echo "  5. Biome lint"
echo ""
echo "These checks mirror your GitHub Actions workflows."
