#!/bin/bash
# Run Flutter app with development environment variables
# Usage: ./run_dev.sh

echo -e "\033[36mLoading development environment...\033[0m"

# Load environment variables from .env.development
set -a
source .env.development
set +a

echo -e "\033[32mRunning Flutter app with development config...\033[0m"

flutter run \
  --dart-define=CONVEX_URL=$CONVEX_URL \
  --dart-define=CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY \
  --dart-define=CLERK_FRONTEND_API=$CLERK_FRONTEND_API
