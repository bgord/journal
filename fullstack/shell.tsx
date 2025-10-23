import { TranslationsContext } from "@bgord/ui";
import { HeadContent, Outlet, Scripts, useLoaderData } from "@tanstack/react-router";
import { Navigation } from "./navigation";
import { rootRoute } from "./router";

export function Shell() {
  const data = useLoaderData({ from: rootRoute.id });

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body data-mx="auto" data-bg="neutral-950">
        <div id="root">
          <TranslationsContext.Provider value={data.i18n}>
            <Navigation />
            <Outlet />
          </TranslationsContext.Provider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
