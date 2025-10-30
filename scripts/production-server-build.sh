#!/usr/bin/env bash

source bgord-scripts/base.sh
setup_base_config

OUTPUT_DIRECTORY="output"

info "Environment: production"
export NODE_ENV="production"

check_if_file_exists .env.production
check_if_directory_exists node_modules
check_if_file_exists scripts/production-server-start.sh
validate_environment_file

# SERVER

step_start "Build cache clean"
rm -rf $OUTPUT_DIRECTORY
step_end "Build cache clean"

step_start "Build directory create"
mkdir -p $OUTPUT_DIRECTORY
step_end "Build directory create"

step_start "Packages install"
bun install --production --no-save --exact
step_end "Packages install"

step_start ".env.production copy"
cp .env.production $OUTPUT_DIRECTORY
step_end ".env.production copy"

step_start "scripts/production-server-start.sh copy"
cp scripts/production-server-start.sh $OUTPUT_DIRECTORY
step_end "scripts/production-server-start.sh copy"

step_start "Infra directory create"
mkdir -p "$OUTPUT_DIRECTORY/infra"
step_end "Infra directory create"

step_start "Translations copy"
cp -r infra/translations "$OUTPUT_DIRECTORY/infra"
step_end "Translations copy"

step_start "Migrations copy"
cp -r infra/drizzle "$OUTPUT_DIRECTORY/infra"
step_end "Migrations copy"

step_start "Drizzle config copy"
cp bgord-scripts/templates/drizzle.config.ts "$OUTPUT_DIRECTORY"
step_end "Drizzle config copy"

step_start "Remote file storage directory create"
mkdir -p "$OUTPUT_DIRECTORY/infra/avatars"
step_end "Remote file storage directory create"

step_start "Temporary file directory directory create"
mkdir -p "$OUTPUT_DIRECTORY/infra/tmp-avatars"
step_end "Temporary file directory directory create"

step_start "App compile"
bun build --compile --minify --sourcemap index.ts --outfile "$OUTPUT_DIRECTORY"/journal
step_end "App compile"

# FRONTEND

step_start "CSS copy"
cp node_modules/@bgord/design/dist/main.min.css "$OUTPUT_DIRECTORY"
step_end "CSS copy"
