#!/usr/bin/env bash
set -eu

npm run build
cp docs/CNAME dist
rm -r docs
mv dist docs
git add docs
git status
