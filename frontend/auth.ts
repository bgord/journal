import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({ baseURL: import.meta.env.VITE_API_URL });

export const { useSession, signIn, signUp, signOut } = authClient;

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;
