#!/usr/bin/env bash

bunx drizzle-kit generate --dialect sqlite --schema ./infra/schema.ts --out infra/drizzle
