#!/usr/bin/env bun

echo "Environment: production"
echo "Starting frontend..."

export NODE_ENV="production"

cd /var/www/journal/frontend || exit
/home/bgord/.bun/bin/bunx --bun react-router-serve ./build/server/index.js
