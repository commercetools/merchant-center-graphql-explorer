#!/usr/bin/env bash

branch_name=$(git rev-parse --abbrev-ref HEAD)

echo "Branch: $branch_name"

if [[ "$branch_name" == "main"  ]]; then
  # Proceed with the build
  exit 1;

else
  # Don't build
  exit 0;
fi