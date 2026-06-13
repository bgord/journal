#!/usr/bin/env bun

echo "Environment: production"
echo "Starting project..."

export NODE_ENV="production"

cd /var/www/journal || exit
"$HOME/.bun/bin/bun" install --production --no-save --exact
"$HOME/.bun/bin/bun" index.js
