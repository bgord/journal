#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh
setup_base_config

OUTPUT_DIRECTORY="build"

info "Environment: production"
export NODE_ENV="production"

check_if_file_exists .env.production
check_if_directory_exists node_modules
check_if_file_exists scripts/production-server-start.sh
bun_validate_environment_file

# ==========================================================

info "Building project!"

# ==========================================================

rm -rf $OUTPUT_DIRECTORY
info "Cleaned previous build cache"

# ==========================================================

mkdir -p $OUTPUT_DIRECTORY
info "Created output directory"

# ==========================================================

bun install --production --no-save --exact
info "Installed packages"

# ==========================================================

cp .env.production $OUTPUT_DIRECTORY
info "Copied .env.production"

# ==========================================================

cp scripts/production-server-start.sh $OUTPUT_DIRECTORY
info "Copied production-server-start script"

# ==========================================================

bun build --compile --minify --sourcemap index.ts --outfile "$OUTPUT_DIRECTORY"/journal
info "Compiled app"

# ==========================================================

success "Project built correctly!"
