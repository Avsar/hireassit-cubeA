import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

// First-party cubea.nl session. The backend stays the data store; this cookie
// just records who is logged in (email = identity). httpOnly + Secure + signed.
export interface SessionData {
  email?: string;
}

export const sessionOptions: SessionOptions = {
  // Must be >= 32 chars. Set SESSION_SECRET in Vercel env. The fallback is
  // intentionally non-secret and only lets local dev boot.
  password: process.env.SESSION_SECRET || "dev_only_insecure_session_secret_change_me",
  cookieName: "cubea_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
