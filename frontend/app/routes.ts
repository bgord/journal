import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("/register", "routes/register.tsx"),

  layout("routes/auth-layout.tsx", [
    route("/home", "routes/home.tsx"),
    route("/dashboard", "routes/dashboard.tsx"),
    route("/profile", "routes/profile.tsx"),
    route("/logout", "routes/logout.tsx"),
  ]),
] satisfies RouteConfig;
