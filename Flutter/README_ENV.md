# Environment Variable Setup for EchoinWhispr

This document explains how to configure environment variables for the EchoinWhispr Flutter application.

## Environment Files

The project uses separate environment files for different build configurations:

| File | Purpose | Convex URL |
|------|---------|------------|
| `.env.development` | Local development | `gregarious-puma-353.convex.cloud` |
| `.env.production` | Production builds | `youthful-sandpiper-909.convex.cloud` |
| `.env.example` | Template file (committed) | Placeholder values |

**Important:** The `.env.development` and `.env.production` files are ignored by git. Never commit files containing real credentials.

## Quick Start

### Development Build
```bash
# Using the env file (Windows PowerShell)
Get-Content .env.development | ForEach-Object {
    $name, $value = $_.split('=')
    Set-Item -Path env:$name -Value $value
}

flutter run `
  --dart-define=CONVEX_URL=$env:CONVEX_URL `
  --dart-define=CLERK_PUBLISHABLE_KEY=$env:CLERK_PUBLISHABLE_KEY `
  --dart-define=CLERK_FRONTEND_API=$env:CLERK_FRONTEND_API
```

### Production Build
```bash
# Using the env file (Windows PowerShell)
Get-Content .env.production | ForEach-Object {
    $name, $value = $_.split('=')
    Set-Item -Path env:$name -Value $value
}

flutter build apk --release `
  --dart-define=CONVEX_URL=$env:CONVEX_URL `
  --dart-define=CLERK_PUBLISHABLE_KEY=$env:CLERK_PUBLISHABLE_KEY `
  --dart-define=CLERK_FRONTEND_API=$env:CLERK_FRONTEND_API
```

## Build Commands Reference

### Development (with defaults)
If no `--dart-define` flags are provided, the app uses development defaults:
```bash
flutter run
```

### Development (explicit)
```bash
flutter run \
  --dart-define=CONVEX_URL=https://gregarious-puma-353.convex.cloud \
  --dart-define=CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lvdXMtaGFyZS00NC5jbGVyay5hY2NvdW50cy5kZXYk \
  --dart-define=CLERK_FRONTEND_API=https://precious-hare-44.clerk.accounts.dev
```

### Production (Android APK)
```bash
flutter build apk --release \
  --dart-define=CONVEX_URL=https://youthful-sandpiper-909.convex.cloud \
  --dart-define=CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lvdXMtaGFyZS00NC5jbGVyay5hY2NvdW50cy5kZXYk \
  --dart-define=CLERK_FRONTEND_API=https://precious-hare-44.clerk.accounts.dev
```

### Production (iOS)
```bash
flutter build ios --release \
  --dart-define=CONVEX_URL=https://youthful-sandpiper-909.convex.cloud \
  --dart-define=CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lvdXMtaGFyZS00NC5jbGVyay5hY2NvdW50cy5kZXYk \
  --dart-define=CLERK_FRONTEND_API=https://precious-hare-44.clerk.accounts.dev
```

### Production (Web)
```bash
flutter build web --release \
  --dart-define=CONVEX_URL=https://youthful-sandpiper-909.convex.cloud \
  --dart-define=CLERK_PUBLISHABLE_KEY=pk_test_cHJlY2lvdXMtaGFyZS00NC5jbGVyay5hY2NvdW50cy5kZXYk \
  --dart-define=CLERK_FRONTEND_API=https://precious-hare-44.clerk.accounts.dev
```

## Environment Variables Reference

| Variable | Description | Dev Example | Prod Example |
|----------|-------------|-------------|--------------|
| `CONVEX_URL` | Convex backend URL | `https://gregarious-puma-353.convex.cloud` | `https://youthful-sandpiper-909.convex.cloud` |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` | `pk_live_...` |
| `CLERK_FRONTEND_API` | Clerk frontend API URL | `https://precious-hare-44.clerk.accounts.dev` | `https://precious-hare-44.clerk.accounts.dev` |
| `ENABLE_SSL_PINNING` | Enable SSL pinning | `false` | `true` |
| `SSL_PINNED_SPKI_HASHES` | Comma-separated SPKI hashes | (empty) | `hash1,hash2` |

## Helper Scripts

### Linux/Mac (`run_dev.sh`)
```bash
#!/bin/bash
source .env.development

flutter run \
  --dart-define=CONVEX_URL=$CONVEX_URL \
  --dart-define=CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY \
  --dart-define=CLERK_FRONTEND_API=$CLERK_FRONTEND_API
```

### Linux/Mac (`build_prod.sh`)
```bash
#!/bin/bash
source .env.production

flutter build apk --release \
  --dart-define=CONVEX_URL=$CONVEX_URL \
  --dart-define=CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY \
  --dart-define=CLERK_FRONTEND_API=$CLERK_FRONTEND_API
```

### Windows PowerShell (`run_dev.ps1`)
```powershell
Get-Content .env.development | ForEach-Object {
    $name, $value = $_.split('=')
    Set-Item -Path env:$name -Value $value
}

flutter run `
  --dart-define=CONVEX_URL=$env:CONVEX_URL `
  --dart-define=CLERK_PUBLISHABLE_KEY=$env:CLERK_PUBLISHABLE_KEY `
  --dart-define=CLERK_FRONTEND_API=$env:CLERK_FRONTEND_API
```

### Windows PowerShell (`build_prod.ps1`)
```powershell
Get-Content .env.production | ForEach-Object {
    $name, $value = $_.split('=')
    Set-Item -Path env:$name -Value $value
}

flutter build apk --release `
  --dart-define=CONVEX_URL=$env:CONVEX_URL `
  --dart-define=CLERK_PUBLISHABLE_KEY=$env:CLERK_PUBLISHABLE_KEY `
  --dart-define=CLERK_FRONTEND_API=$env:CLERK_FRONTEND_API
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build Production APK

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        
      - name: Build APK
        env:
          CONVEX_URL: ${{ secrets.CONVEX_URL }}
          CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
          CLERK_FRONTEND_API: ${{ secrets.CLERK_FRONTEND_API }}
        run: |
          flutter build apk --release \
            --dart-define=CONVEX_URL=$CONVEX_URL \
            --dart-define=CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY \
            --dart-define=CLERK_FRONTEND_API=$CLERK_FRONTEND_API
```

## Security Best Practices

- ✅ **DO** add environment files to `.gitignore` (already configured)
- ✅ **DO** commit `.env.example` as a template
- ✅ **DO** use different Convex URLs for dev/prod
- ❌ **DON'T** commit `.env.development` or `.env.production`
- ❌ **DON'T** use development keys in production builds
- ❌ **DON'T** hardcode credentials in source code

## Fallback Behavior

If no `--dart-define` flags are provided, the app uses **development defaults** and shows a warning in debug mode. This is convenient for local development but should never be relied upon for production.

## Troubleshooting

### "Using default values" warning
This is expected in development. For production, ensure you're passing the correct `--dart-define` flags.

### Build fails with environment errors
1. Check that all required variables are defined
2. Verify URLs don't have trailing slashes
3. Ensure credentials are valid in Clerk dashboard

### Wrong Convex backend being used
Check the console output when the app starts - it will show which configuration is active.