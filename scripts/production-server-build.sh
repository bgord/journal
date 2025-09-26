#!/usr/bin/env bash

source bgord-scripts/base.sh
setup_base_config

OUTPUT_DIRECTORY="build"

info "Environment: production"
export NODE_ENV="production"

check_if_file_exists .env.production
check_if_directory_exists node_modules
check_if_file_exists scripts/production-server-start.sh
validate_environment_file

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

step_start "App compile"
bun build --compile --minify --sourcemap index.ts --outfile "$OUTPUT_DIRECTORY"/journal
step_end "App compile"
