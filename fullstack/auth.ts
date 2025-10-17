import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/api/auth",
  fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { credentials: "include", ...init }),
});

export const { useSession, signIn, signUp, signOut } = authClient;
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
