#!/usr/bin/env bash

set -e

echo "Removing corrupted packages"

# Relates to https://github.com/reach/reach-ui/issues/921
rm -rf node_modules/graphiql/node_modules/@graphiql

echo "Preparing development setup."

yarn husky install
yarn manypkg check
