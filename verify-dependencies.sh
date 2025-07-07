#!/usr/bin/env bash

source bgord-scripts/base.sh
setup_base_config

info "Verifying dependencies"

function check_dependencies() {
  local package_json_path=$1
  local dep_type=$2

  if ! jq -e ".$dep_type" "$package_json_path" >/dev/null; then
    return
  fi

  while read -r name version; do
    if [[ "$version" == *"^"* || "$version" == *"~"* ]]; then
      error "Dependency $name@$version in $package_json_path is not pinned. Please use an exact version."
      exit 1
    fi

    if [[ "$version" == *"file:"* ]]; then
      error "Dependency $name@$version in $package_json_path is a file dependency. Please use a published version."
      exit 1
    fi
  done < <(jq -r ".$dep_type | to_entries | .[] | .key + \" \" + .value" "$package_json_path")
}

check_dependencies "package.json" "dependencies"
check_dependencies "package.json" "devDependencies"
check_dependencies "package.json" "peerDependencies"

success "Dependencies verified"
