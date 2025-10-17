rm -rf public/assets/*

bun build ./fullstack/entry-client.tsx \
  --production \
  --outdir ./public/assets \
  --target browser \
  --splitting \
  --minify \
  --public-path /assets/
