import { TranslationsContext } from "@bgord/ui";
import { HeadContent, Outlet, Scripts, useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "./router";
import { Navigation } from "./sections/navigation";

export function Shell() {
  const { i18n } = useLoaderData({ from: rootRoute.id });

  return (
    <html lang={i18n.language}>
      <head>
        <HeadContent />
      </head>
      <body data-mx="auto" data-bg="neutral-950">
        <div id="root">
          <TranslationsContext.Provider value={i18n}>
            <Navigation />
            <Outlet />
          </TranslationsContext.Provider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
