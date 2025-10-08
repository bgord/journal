import * as UI from "@bgord/ui";
import * as RR from "react-router";
import { API } from "../api";
import { GlobalShortcuts } from "../components/global-shortcuts";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  { as: "style", rel: "stylesheet preload", href: "/main.min.css" },
  { as: "style", rel: "stylesheet preload", href: "/custom.css" },
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
    <html lang={data.language} data-bg="neutral-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <RR.Meta />
        <RR.Links />
      </head>
      <body>
        <UI.TranslationsContext.Provider value={{ translations: data.translations, language: data.language }}>
          {children}
        </UI.TranslationsContext.Provider>
        <RR.ScrollRestoration />
        <UI.RevalidateOnFocus />
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
