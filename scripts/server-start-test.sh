#!/usr/bin/env bash

source bgord-scripts/base.sh
setup_base_config

export NODE_ENV="staging"
export DATABASE_PATH="sqlite.e2e.db"

info "Environment: e2e (staging adapters, $DATABASE_PATH)"

ensure_drizzle_set_up

mkdir -p infra/adapters/system/profile-avatars

./bgord-scripts/db-reset.sh

step_start "DB seed e2e"
bun --env-file=".env.$NODE_ENV" scripts/db-seed.ts
step_end "DB seed e2e"

./bgord-scripts/web-build-bun.sh

step_start "Server start e2e"
bun run \
  --env-file=".env.$NODE_ENV" \
  index.ts
step_end "Server start e2e"
