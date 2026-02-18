#!/bin/bash
# Build Flutter app with production environment variables
# Usage: ./build_prod.sh [apk|appbundle|ios|web]

PLATFORM=${1:-apk}

echo -e "\033[36mLoading production environment...\033[0m"

# Load environment variables from .env.production
set -a
source .env.production
set +a

echo -e "\033[32mBuilding Flutter app for $PLATFORM with production config...\033[0m"

flutter build $PLATFORM --release \
  --dart-define=CONVEX_URL=$CONVEX_URL \
  --dart-define=CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY \
  --dart-define=CLERK_FRONTEND_API=$CLERK_FRONTEND_API
