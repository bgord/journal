import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/add-entry", "routes/add-entry.tsx"),
  route("/entry/:entryId", "routes/entry.tsx"),
] satisfies RouteConfig;
