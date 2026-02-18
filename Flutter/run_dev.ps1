# Run Flutter app with development environment variables
# Usage: ./run_dev.ps1

Write-Host "Loading development environment..." -ForegroundColor Cyan

# Load environment variables from .env.development
Get-Content .env.development | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path env:$name -Value $value
        Write-Host "  Set $name" -ForegroundColor Gray
    }
}

Write-Host "Running Flutter app with development config..." -ForegroundColor Green

flutter run `
  --dart-define=CONVEX_URL=$env:CONVEX_URL `
  --dart-define=CLERK_PUBLISHABLE_KEY=$env:CLERK_PUBLISHABLE_KEY `
  --dart-define=CLERK_FRONTEND_API=$env:CLERK_FRONTEND_API
