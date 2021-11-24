#!/usr/bin/env bash

# NOTE: somehow Vercel defaults to `master` when checking out the code,
# even though it's supposed to be `main`.
# https://github.com/vercel/vercel/discussions/5171
branch_name=$(git rev-parse --abbrev-ref HEAD)

echo "Branch: $branch_name"

if [[ "$branch_name" == "main" || "$branch_name" == "master" ]]; then
  # Proceed with the build
  exit 1;

else
  # Don't build
  exit 0;
fi