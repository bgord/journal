import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/add-journal-entry", "routes/add-journal-entry.tsx"),
] satisfies RouteConfig;
