import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/landing/index.tsx"),
    route("/ui", "routes/ui/docs.tsx"),
    route("/profile", "routes/profile/index.tsx"),
    route("/hover", "routes/profile/hover.tsx"),
    route("/categories", "routes/categories/index.tsx"),
    route("/leaderboard", "routes/leaderboard/index.tsx"),
  ]),
] satisfies RouteConfig;
