import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/register", "routes/register.tsx"),

  layout("routes/auth-layout.tsx", [
    route("/add-entry", "routes/add-entry.tsx"),
    route("/home", "routes/home.tsx"),
    route("/alarms", "routes/alarms.tsx"),
    route("/logout", "routes/logout.tsx"),
  ]),
] satisfies RouteConfig;
