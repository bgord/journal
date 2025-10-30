rm -f public/*.js
rm -f public/*.js.map

cp node_modules/@bgord/design/dist/main.min.css public

bun build ./web/entry-client.tsx \
  --outdir ./public \
  --target browser \
  --splitting \
  --sourcemap \
  --watch
