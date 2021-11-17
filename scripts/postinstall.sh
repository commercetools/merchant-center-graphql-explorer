#!/usr/bin/env bash

set -e

if [ -n "$VERCEL" ]; then
  echo "Running on Vercel, skipping development setup."

else
  echo "Preparing development setup."

  yarn husky install
  yarn manypkg check
fi
