import { prerender as ssr } from "preact-iso";
import { locationStub } from "preact-iso/prerender";
import { AppShell } from "./app";

export async function renderHtml(path: string) {
  locationStub(path);
  const { html } = await ssr(<AppShell />);

  return /* HTML */ `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="preload" as="style" href="/public/main.min.css" />
        <link rel="preload" as="style" href="/public/custom.css" />
        <title>Journal</title>
      </head>
      <body data-mx="auto" data-bg="neutral-950">
        <div id="root">${html}</div>
        <script type="module" src="/public/client-entry.js"></script>
      </body>
    </html>`;
}
