import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    /* ------------------------------- Main pages ------------------------------- */
    index("routes/landing/index.tsx"),
    route("/categories", "routes/categories/index.tsx"),
    route("/badges", "routes/badges/index.tsx"),
    route("/leaderboard/:categories?", "routes/leaderboard/index.tsx"),

    /* ------------------------------- User pages ------------------------------- */
    route("/profile/:variant/:slug", "routes/profile/index.tsx"),
    // route("/hover", "routes/profile/hover.tsx"),
    // route("/hover2", "routes/profile/hover-new.tsx"),

    /* -------------------------- Authentication routes ------------------------- */
    route("/auth/twitter", "routes/auth/twitter/index.tsx"),
    route("/auth/twitter/callback", "routes/auth/twitter/callback.tsx"),
    route("/auth/logout", "routes/auth/logout.tsx"),
    route("/auth/complete-registration", "routes/auth/complete-registration.tsx"),

    /* ------------------------------ API routes ----------------------------- */
    route("/api/auth/check-user", "routes/api/auth/check-user.ts"),
    route("/api/auth/nonce", "routes/api/auth/nonce.ts"),
    route("/api/auth/login", "routes/api/auth/login.ts"),
    route("/api/auth/register", "routes/api/auth/register.ts"),
    route("/api/account/complete-registration", "routes/api/account/complete-registration.tsx"),

    /* ------------------------ Debug/Development routes ------------------------ */
    route("/debug/env", "routes/debug/env.tsx"),

    /* ------------------ UI/Development routes (commented out) ----------------- */
    // route("/ui", "routes/ui/docs.tsx"),
  ]),
] satisfies RouteConfig;
