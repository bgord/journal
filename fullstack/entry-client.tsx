import { StrictMode } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";

declare global {
  interface Window {
    __RR_STATE__?: {
      loaderData?: unknown;
      actionData?: unknown;
      errors?: unknown;
    };
  }
}

const router = createBrowserRouter(routes, {
  hydrationData: window.__RR_STATE__ ?? ({} as any),
});

const element = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// If we SSR’d, prefer hydrateRoot for the initial mount.
// With HMR, we keep/reuse the same root between updates.
// Note: hydrateRoot returns a Root that can be .render()’d on updates.
type RootLike = ReturnType<typeof createRoot>;

if (import.meta.hot) {
  const prevRoot: RootLike | undefined = (import.meta.hot.data as any).root;

  // First run: if there is no existing root, hydrate.
  // Subsequent HMR updates: reuse the stored root and just render.
  const root: RootLike = prevRoot ?? (hydrateRoot(element, app) as unknown as RootLike);

  root.render(app);
  (import.meta.hot.data as any).root = root;

  // Accept HMR updates for this module and its dependencies
  import.meta.hot.accept();
} else {
  // Non-HMR prod/dev run: hydrate once.
  hydrateRoot(element, app);
}
