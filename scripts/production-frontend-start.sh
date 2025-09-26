#!/usr/bin/env bun

echo "Environment: production"
echo "Starting frontend..."

export NODE_ENV="production"

cd /var/www/journal || exit
bunx --bun react-router-serve ./frontend/server/index.js
