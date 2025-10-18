rm -rf public/assets/*

bun build fullstack/entry-client.tsx \
  --outdir public/assets \
  --target browser \
  --splitting \
  --minify \
  --public-path /assets/ \
  --production \
  --define process.env.NODE_ENV=\"production\"
