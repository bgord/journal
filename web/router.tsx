// fallow-ignore-file circular-dependencies
import * as bg from "@bgord/ui";
import { createRootRouteWithContext, createRoute, Router, redirect } from "@tanstack/react-router";
import * as HomeEntryListForm from "../app/services/home-entry-list-form";
import { AI, Avatar, Dashboard, Entry, I18N, Publishing, Session } from "./api";
import { NotFound } from "./not-found";
import { Dashboard as DashboardPage } from "./pages/dashboard";
import { Home as HomePage } from "./pages/home";
import { HomeEntryHistory as HomeEntryHistoryPage } from "./pages/home-entry-history";
import { Profile as ProfilePage } from "./pages/profile";
import { SharedEntries as SharedEntriesPage } from "./pages/shared-entries";
import { Shell } from "./shell";

type RouterContext = { request: Request | null; nonce: string; assetVersion: string };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: ({ match }: { match: { context: RouterContext } }) => ({
    meta: [...bg.META, { title: "Journal" }],
    links: [
      ...bg.CSS(bg.AssetVersion.url("/public/main.min.css", match.context.assetVersion)),
      ...bg.CSS(bg.AssetVersion.url("/public/custom.css", match.context.assetVersion)),
    ],
    scripts: [bg.JS(bg.AssetVersion.url("/public/entry-client.js", match.context.assetVersion))],
  }),
  component: Shell,
  staleTime: Number.POSITIVE_INFINITY,
  loader: async ({ context }) => {
    const [session, i18n, avatarEtag] = await Promise.all([
      Session.get(context.request),
      I18N.get(context.request),
      Avatar.getEtag(context.request),
    ]);

    // @ts-expect-error Login stays out as a separate HTML page
    if (!(session && i18n)) throw redirect({ to: "/public/login.html" });

    return { session, i18n, avatarEtag };
  },
  notFoundComponent: NotFound,
});

export const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: HomePage,
  validateSearch: (value) => ({
    filter: HomeEntryListForm.Form.filter.is(value["filter"])
      ? value["filter"]
      : HomeEntryListForm.Form.default.filter,
    query: typeof value["query"] === "string" ? value["query"] : HomeEntryListForm.Form.default.query,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => ({ entries: await Entry.getList(context.request, deps) }),
});

export const homeEntryHistoryRoute = createRoute({
  getParentRoute: () => homeRoute,
  path: "entry/$entryId/history",
  component: HomeEntryHistoryPage,
  loader: async ({ context, params }) => ({
    history: await Entry.getHistory(context.request, params.entryId),
  }),
});

export const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: ProfilePage,
  loader: async ({ context }) => {
    const [usage, shareableLinks] = await Promise.all([
      AI.getUsageToday(context.request),
      Publishing.listShareableLinks(context.request),
    ]);

    return { usage, shareableLinks };
  },
});

export const dashboardRoute = createRoute({
  path: "/dashboard",
  getParentRoute: () => rootRoute,
  component: DashboardPage,
  loader: async ({ context }) => await Dashboard.get(context.request),
});

export const sharedEntries = createRoute({
  path: "/shared-entries/$shareableLinkId",
  getParentRoute: () => rootRoute,
  component: SharedEntriesPage,
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
    dehydrate: () => ({ assetVersion: context.assetVersion }),
    hydrate: (dehydrated) => {
      context.assetVersion = dehydrated.assetVersion;
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
