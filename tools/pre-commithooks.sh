#!/bin/sh
echo "Running pre-commit hooks"
pnpm run lint
pnpm run test
pnpm run build
echo "Pre-commit hooks passed"
exit 0