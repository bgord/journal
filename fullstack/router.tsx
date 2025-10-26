import {
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  Router,
  redirect,
} from "@tanstack/react-router";
import * as AI from "./ai.api";
import * as Auth from "./auth.api";
import * as Avatar from "./avatar.api";
import * as HEAD from "./head";
import * as I18n from "./i18n.api";
import { NotFound } from "./not-found";
import { Shell } from "./shell";

export type RouterContext = { request: Request | null };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [...HEAD.META, { title: "Journal" }],
    links: [...HEAD.CSS("/public/main.min.css"), ...HEAD.CSS("/public/custom.css"), ...HEAD.FONT],
    scripts: [HEAD.JS("/public/entry-client.js")],
  }),
  component: Shell,
  staleTime: Number.POSITIVE_INFINITY,
  loader: async ({ context }) => {
    const [session, i18n, avatarEtag] = await Promise.all([
      await Auth.getSession(context.request),
      await I18n.getI18n(context.request),
      await Avatar.getAvatarEtag(context.request),
    ]);

    // @ts-expect-error Login stays out as a separate HTML page
    if (!(session && i18n)) throw redirect({ to: "/login" });

    return { session, i18n, avatarEtag };
  },
  notFoundComponent: NotFound,
});

export const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/home"), "Home"),
  loader: async () => {
    return { entries: [] };
  },
});

export const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
  loader: async ({ context }) => ({ usage: await AI.getAiUsageToday(context.request) }),
});

const dashboardRoute = createRoute({
  path: "/dashboard",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/dashboard"), "Dashboard"),
});

const routeTree = rootRoute.addChildren([homeRoute, profileRoute, dashboardRoute]);

export function createRouter(context: RouterContext) {
  return new Router({ routeTree, context, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
