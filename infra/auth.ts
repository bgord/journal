import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", usePlural: true }),
  emailAndPassword: { enabled: true },
  autoSignIn: false,
  trustedOrigins: ["http://localhost:5173"],
});

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
