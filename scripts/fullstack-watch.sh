rm -rf public/assets/*

bun build ./fullstack/entry-client.tsx \
  --outdir ./public/assets \
  --target browser \
  --splitting \
  --sourcemap \
  --public-path /assets/ \
  --watch
