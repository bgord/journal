// fallow-ignore-file circular-dependencies
import { CSS, JS, META } from "@bgord/ui";
import {
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  Router,
  redirect,
} from "@tanstack/react-router";
import * as HomeEntryListForm from "../app/services/home-entry-list-form";
import { AI, Avatar, Dashboard, Entry, I18N, Publishing, Session } from "./api";
import { NotFound } from "./not-found";
import { Shell } from "./shell";

type RouterContext = { request: Request | null; nonce: string };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [...META, { title: "Journal" }],
    links: [...CSS("/public/main.min.css"), ...CSS("/public/custom.css")],
    scripts: [JS("/public/entry-client.js")],
  }),
  component: Shell,
  staleTime: Number.POSITIVE_INFINITY,
  loader: async ({ context }) => {
    const session = await Session.get(context.request);
    const i18n = await I18N.get(context.request);
    const avatarEtag = await Avatar.getEtag(context.request);

    // @ts-expect-error Login stays out as a separate HTML page
    if (!(session && i18n)) throw redirect({ to: "/public/login.html" });

    return { session, i18n, avatarEtag };
  },
  notFoundComponent: NotFound,
});

export const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/home"), "Home"),
  validateSearch: (value) => ({
    filter: HomeEntryListForm.Form.filter.options.includes(value["filter"] as string)
      ? (value["filter"] as HomeEntryListForm.types.EntryListFilterType)
      : HomeEntryListForm.Form.default.filter,
    query: typeof value["query"] === "string" ? value["query"] : HomeEntryListForm.Form.default.query,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => ({ entries: await Entry.getList(context.request, deps) }),
});

export const homeEntryHistoryRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "entry/$entryId/history",
  component: lazyRouteComponent(() => import("./pages/home-entry-history"), "HomeEntryHistory"),
  loader: async ({ context, params }) => ({
    history: await Entry.getHistory(context.request, params.entryId),
  }),
});

export const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
  loader: async ({ context }) => ({
    usage: await AI.getUsageToday(context.request),
    shareableLinks: await Publishing.listShareableLinks(context.request),
  }),
});

export const dashboardRoute = createRoute({
  path: "/dashboard",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/dashboard"), "Dashboard"),
  loader: async ({ context }) => await Dashboard.get(context.request),
});

export const sharedEntries = createRoute({
  path: "/shared-entries/$shareableLinkId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/shared-entries"), "SharedEntries"),
  preload: false,
  loader: async ({ context, params }) => ({
    entries: await Entry.getSharedEntries(context.request, params.shareableLinkId),
  }),
});

const routeTree = rootRoute.addChildren([
  homeRoute.addChildren([homeEntryHistoryRoute]),
  profileRoute,
  dashboardRoute,
  sharedEntries,
]);

export function createRouter(context: RouterContext) {
  return new Router({
    routeTree,
    context,
    defaultPreload: "intent",
    defaultViewTransition: true,
    ssr: { nonce: context.nonce },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
