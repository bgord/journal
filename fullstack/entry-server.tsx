import { renderToReadableStream } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  type RouteObject,
} from "react-router";
import { routes } from "./routes";

export async function handleSsr(request: Request): Promise<Response> {
  const staticHandler = createStaticHandler(routes as RouteObject[]);
  const contextOrResponse = await staticHandler.query(request);

  // Redirects / thrown responses (404, etc.)
  if (contextOrResponse instanceof Response) return contextOrResponse;

  const staticRouter = createStaticRouter(staticHandler.dataRoutes, contextOrResponse);

  const hydrationState = {
    loaderData: contextOrResponse.loaderData,
    actionData: contextOrResponse.actionData,
    errors: contextOrResponse.errors ?? null,
  };

  const jsx = <StaticRouterProvider router={staticRouter} context={contextOrResponse} />;

  // simple buffered path (you can switch to true streaming later)
  const stream = await renderToReadableStream(jsx);
  const appHtml = await new Response(stream).text();

  const status = contextOrResponse.statusCode ?? 200;
  const html = renderHtml(appHtml, hydrationState);

  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function renderHtml(appHtml: string, state: unknown) {
  return /* HTML */ `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Journal</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script>
          window.__RR_STATE__ = ${JSON.stringify(state)};
        </script>
        <script type="module" src="/fullstack/entry-client.tsx"></script>
      </body>
    </html>`;
}
