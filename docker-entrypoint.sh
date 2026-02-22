#!/bin/sh
set -eu

echo "Running startup database migration..."
node dist/scripts/migrate.js

echo "Starting API..."
exec node dist/main.js
