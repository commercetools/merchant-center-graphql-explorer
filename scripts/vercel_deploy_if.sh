#!/usr/bin/env bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main"  ]]; then
  # Proceed with the build
  exit 1;

else
  # Don't build
  exit 0;
fi