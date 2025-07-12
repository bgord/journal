import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("/add-entry", "routes/add-entry.tsx")] satisfies RouteConfig;
