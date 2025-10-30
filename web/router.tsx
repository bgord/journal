import {
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  Router,
  redirect,
} from "@tanstack/react-router";
import * as HomeEntryListForm from "../app/services/home-entry-list-form";
import * as API from "./api";
import * as HEAD from "./head";
import { NotFound } from "./not-found";
import { Shell } from "./shell";

type RouterContext = { request: Request | null };

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
      await API.Session.get(context.request),
      await API.I18N.get(context.request),
      await API.Avatar.getEtag(context.request),
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
  validateSearch: (value) => ({
    filter: HomeEntryListForm.Form.filter.options.includes(value.filter as string)
      ? (value.filter as HomeEntryListForm.types.EntryListFilterType)
      : HomeEntryListForm.Form.default.filter,
    query: typeof value.query === "string" ? value.query : HomeEntryListForm.Form.default.query,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => ({ entries: await API.Entry.getList(context.request, deps) }),
});

export const homeEntryHistoryRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "entry/$entryId/history",
  component: lazyRouteComponent(() => import("./pages/home-entry-history"), "HomeEntryHistory"),
  loader: async ({ context, params }) => ({
    history: await API.Entry.getHistory(context.request, params.entryId),
  }),
});

export const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
  loader: async ({ context }) => ({
    usage: await API.AI.getUsageToday(context.request),
    shareableLinks: await API.Publishing.listShareableLinks(context.request),
  }),
});

export const dashboardRoute = createRoute({
  path: "/dashboard",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/dashboard"), "Dashboard"),
  loader: async ({ context }) => await API.Dashboard.get(context.request),
});

export const sharedEntries = createRoute({
  path: "/shared-entries/$shareableLinkId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/shared-entries"), "SharedEntries"),
  preload: false,
  loader: async ({ context, params }) => ({
    entries: await API.Entry.getSharedEntries(context.request, params.shareableLinkId),
  }),
});

const routeTree = rootRoute.addChildren([
  homeRoute.addChildren([homeEntryHistoryRoute]),
  profileRoute,
  dashboardRoute,
  sharedEntries,
]);

export function createRouter(context: RouterContext) {
  return new Router({ routeTree, context, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
