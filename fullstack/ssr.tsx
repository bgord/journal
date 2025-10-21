import { prerender } from "preact-iso";
// @ts-expect-error
import { locationStub } from "preact-iso/prerender";
import { App } from "./app";

export async function ssr(path: string) {
  locationStub(path);
  const { html } = await prerender(<App />);

  return /* HTML */ `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="description" content="Journal" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />

        <link as="style" rel="stylesheet preload" href="/public/main.min.css" />
        <link as="style" rel="stylesheet preload" href="/public/custom.css" />

        <title>Journal</title>
      </head>

      <body data-mx="auto" data-bg="neutral-950">
        <div id="root">${html}</div>
        <script type="module" src="/public/client-entry.js"></script>
      </body>
    </html>`;
}
