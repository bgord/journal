rm -f public/*.js

cp node_modules/@bgord/design/dist/main.min.css public

bun build ./fullstack/entry-client.tsx \
  --outdir ./public \
  --target browser \
  --splitting \
  --sourcemap \
  --watch
