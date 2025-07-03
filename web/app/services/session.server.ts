import { createCookieSessionStorage } from "react-router";
import type { User, PendingRegistration } from "~/services/auth.server";

export interface SessionData {
  user?: User;
  pendingRegistration?: PendingRegistration;
}

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || "waffle-default-secret-key-12345"],
    secure: process.env.NODE_ENV === "production",
  },
});

// export const { getSession, commitSession, destroySession } = sessionStorage;
