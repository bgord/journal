#!/usr/bin/env bash

source bgord-scripts/base.sh
setup_base_config
press_enter_to_continue

SHA=$(git rev-parse HEAD)

step_start "Bun install"
bun install --exact --frozen-lockfile --no-summary
step_end "Bun install"

step_start "Run build prechecks"
./bgord-scripts/build-prechecks.sh
step_end "Run build prechecks"

step_start "Build app"
./scripts/production-server-build.sh
step_end "Build app"

step_start "Generate build info"
./bgord-scripts/build-info-generate.sh "$SHA"
step_end "Generate build info"

step_start "Clean public"
ssh production "cd /var/www/journal && rm -rf public/"
step_end "Clean public"

step_start "Sync source code"
rsync -azP output/ production:/var/www/journal
step_end "Sync source code"

step_start "Restart server"
ssh production sudo systemctl restart journal.service
step_end "Restart server"
