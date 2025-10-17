import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";

declare global {
  interface Window {
    __RR_STATE__?: { loaderData?: unknown; actionData?: unknown; errors?: unknown };
  }
}

const router = createBrowserRouter(routes, { hydrationData: window.__RR_STATE__ ?? ({} as any) });

hydrateRoot(document.getElementById("root")!, <RouterProvider router={router} />);
