import * as UI from "@bgord/ui";
import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({ baseURL: import.meta.env.VITE_API_URL });

export const { useSession, signIn, signUp, signOut } = client;

export type Session = typeof client.$Infer.Session;
export type User = typeof client.$Infer.Session.user;

// @ts-expect-error as string to guard against undefined
export const guard = new UI.AuthGuard<Session>(import.meta.env.VITE_API_URL);
