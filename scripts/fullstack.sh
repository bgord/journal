cp node_modules/@bgord/design/dist/main.min.css public

bun build fullstack/client-entry.tsx \
  --outdir ./public \
  --target browser \
  --splitting \
  --sourcemap \
  --watch
