import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    /* ------------------------------- Main pages ------------------------------- */
    index("routes/landing/index.tsx"),
    route("/categories", "routes/categories/index.tsx"),
    route("/badges", "routes/badges.tsx"),
    route("/leaderboard", "routes/leaderboard/index.tsx"),

    /* ------------------------------- User pages ------------------------------- */
    route("/profile/:slug", "routes/profile/index.tsx"),
    // route("/hover", "routes/profile/hover.tsx"),
    // route("/hover2", "routes/profile/hover-new.tsx"),

    /* -------------------------- Authentication routes ------------------------- */
    route("/auth/twitter", "routes/auth/twitter/index.tsx"),
    route("/auth/twitter/callback", "routes/auth/twitter/callback.tsx"),
    route("/auth/logout", "routes/auth/logout.tsx"),

    /* ------------------------ Debug/Development routes ------------------------ */
    route("/debug/env", "routes/debug/env.tsx"),

    /* ------------------ UI/Development routes (commented out) ----------------- */
    // route("/ui", "routes/ui/docs.tsx"),
  ]),
] satisfies RouteConfig;
