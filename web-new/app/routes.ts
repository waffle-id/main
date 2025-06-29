import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/ui", "routes/ui/docs.tsx"),
  route("/profile", "routes/profile/index.tsx"),
  route("/hover", "routes/profile/hover.tsx"),
] satisfies RouteConfig;
