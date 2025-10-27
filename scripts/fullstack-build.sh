rm -f public/*.js
rm -f public/*.js.map

cp node_modules/@bgord/design/dist/main.min.css public

bun build fullstack/entry-client.tsx \
  --outdir ./public \
  --target browser \
  --splitting \
  --minify \
  --production \
  --define process.env.NODE_ENV=\"production\"
