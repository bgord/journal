import { TranslationsContext } from "@bgord/ui";
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { OnlineStatusBar } from "./components/online-status-bar";
import { rootRoute } from "./router";
import { Navigation } from "./sections";

export function Shell() {
  const { i18n } = rootRoute.useLoaderData();

  return (
    <html lang={i18n.language}>
      <head>
        <HeadContent />
      </head>
      <body data-mx="auto">
        <div id="root">
          <TranslationsContext.Provider value={i18n}>
            <Navigation />
            <Outlet />
            <OnlineStatusBar />
          </TranslationsContext.Provider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
