import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { Password } from "../modules/auth/value-objects/password";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", usePlural: true }),
  advanced: { database: { generateId: () => crypto.randomUUID() } },
  session: { expiresIn: tools.Time.Days(30).seconds, updateAge: tools.Time.Days(1).seconds },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: Password.MinimumLength,
    maxPasswordLength: Password.MaximumLength,
  },
  autoSignIn: false,
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],
  plugins: [openAPI()],
  // TODO: wire up logger
});

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};

export const AuthShield = new bg.AuthShield(auth);
