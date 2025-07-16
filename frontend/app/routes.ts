import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/add-entry", "routes/add-entry.tsx"),
  route("/home", "routes/home.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/register", "routes/register.tsx"),
] satisfies RouteConfig;
