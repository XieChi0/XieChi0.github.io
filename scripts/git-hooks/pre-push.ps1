# Pre-push hook for astro-boke (PowerShell version)
# Mirrors the GitHub Actions workflows: build.yml and biome.yml

$ErrorActionPreference = "Stop"

$YELLOW = "Yellow"
$GREEN = "Green"
$RED = "Red"

function Write-Info { param($m) Write-Host "🔍 $m" -ForegroundColor $YELLOW }
function Write-Success { param($m) Write-Host "✅ $m" -ForegroundColor $GREEN }
function Write-Fail { param($m) Write-Host "❌ $m" -ForegroundColor $RED }

Write-Info "Running pre-push checks..."
Write-Info "Project: astro-boke"
Write-Host ""

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Success "pnpm is installed (v$pnpmVersion)"
} catch {
    Write-Fail "pnpm is not installed. Please install it first: npm install -g pnpm"
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Info "Installing dependencies..."
    pnpm install
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

# Run Astro check (from build.yml)
Write-Info "Running Astro check..."
pnpm astro check
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Astro type check failed!"
    Write-Fail "Please fix the errors before pushing."
    exit 1
}
Write-Success "Astro check passed"

# Build to catch any build errors (from build.yml)
Write-Info "Running build..."
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Build failed!"
    Write-Fail "Please fix the build errors before pushing."
    exit 1
}
Write-Success "Build passed"

# Run Biome lint (from biome.yml)
Write-Info "Running Biome lint..."
pnpm biome ci ./src
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Biome lint failed!"
    Write-Fail "Please fix the linting errors before pushing."
    exit 1
}
Write-Success "Biome lint passed"

Write-Host ""
Write-Success "All pre-push checks passed! Ready to push."
