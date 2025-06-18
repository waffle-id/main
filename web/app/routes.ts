import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/leaderboard", "routes/leaderboard.tsx"),
  route("/profile", "routes/profile.tsx"),
  route("/explorer", "routes/explorer.tsx"),
  route("/:username", "routes/user-profile.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
