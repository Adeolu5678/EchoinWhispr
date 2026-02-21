# Build Flutter app with production environment variables
# Usage: ./build_prod.ps1 [apk|ios|web]

param(
    [Parameter(Position=0)]
    [ValidateSet("apk", "appbundle", "ios", "web")]
    [string]$platform = "apk"
)

Write-Host "Loading production environment..." -ForegroundColor Cyan

# Load environment variables from .env.production
Get-Content .env.production | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path env:$name -Value $value
        Write-Host "  Set $name" -ForegroundColor Gray
    }
}

Write-Host "Building Flutter app for $platform with production config..." -ForegroundColor Green

$buildCmd = "flutter build $platform --release --dart-define=CONVEX_URL=$env:CONVEX_URL --dart-define=CLERK_PUBLISHABLE_KEY=$env:CLERK_PUBLISHABLE_KEY --dart-define=CLERK_FRONTEND_API=$env:CLERK_FRONTEND_API"

Invoke-Expression $buildCmd
