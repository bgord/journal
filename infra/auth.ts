import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { Password } from "../modules/auth/value-objects/password";
import { db } from "./db";
import { logger } from "./logger";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", usePlural: true }),
  advanced: { database: { generateId: () => crypto.randomUUID() } },
  session: { expiresIn: tools.Time.Days(30).seconds, updateAge: tools.Time.Days(1).seconds },
  rateLimit: { enabled: true, window: tools.Time.Minutes(5).seconds, max: 100 },
  emailAndPassword: {
    autoSignIn: false,
    enabled: true,
    minPasswordLength: Password.MinimumLength,
    maxPasswordLength: Password.MaximumLength,
  },
  autoSignIn: false,
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],
  plugins: [openAPI()],
  logger: new bg.BetterAuthLogger(logger).attach(),
});

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};

export const AuthShield = new bg.AuthShield(auth);
