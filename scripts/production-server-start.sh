#!/usr/bin/env bun

echo "Environment: production"
echo "Starting project..."

export NODE_ENV="production"

cd /var/www/journal || exit
/home/bgord/.bun/bin/bunx drizzle-kit generate
/home/bgord/.bun/bin/bunx drizzle-kit migrate
./journal
