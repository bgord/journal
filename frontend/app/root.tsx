import * as UI from "@bgord/ui";
import * as RR from "react-router";
import { API } from "../api";
import { GlobalShortcuts } from "../components/global-shortcuts";
import { LanguageSelector } from "../components/language-selector";
import { RevalidateOnFocus } from "../components/revalidate-on-focus";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  {
    as: "style",
    rel: "stylesheet preload",
    href: "/normalize.min.css",
  },
  {
    as: "style",
    rel: "stylesheet preload",
    href: "/main.min.css",
  },
  {
    as: "style",
    rel: "stylesheet preload",
    href: "/custom.css",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("cookie") as string;

  const response = await API("/translations", { headers: { cookie } });
  const { translations, language } = await response.json();

  return { translations, language };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = RR.useRouteLoaderData("root");

  return (
    <html lang={data.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <RR.Meta />
        <RR.Links />
      </head>
      <body>
        <UI.TranslationsContext.Provider value={{ translations: data.translations, language: data.language }}>
          <header
            data-display="flex"
            data-main="center"
            data-cross="baseline"
            data-mt="48"
            data-gap="12"
            data-fs="32"
            data-fw="700"
            data-transform="center uppercase"
            data-ls="1.5"
            className="logo"
          >
            <RR.Link to="/">Journal</RR.Link>

            <LanguageSelector />
          </header>

          {children}
        </UI.TranslationsContext.Provider>
        <RR.ScrollRestoration />
        <RevalidateOnFocus />
        <GlobalShortcuts />
        <RR.Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <RR.Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (RR.isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
