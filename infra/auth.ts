import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { Password } from "../modules/auth/value-objects/password";
import { db } from "./db";
import { logger } from "./logger";
import { Mailer } from "./mailer";

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
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await Mailer.send({
        to: user.email,
        subject: "Reset your Journal password",
        text: `Click the link to reset your password: ${url}`,
        html: `<p>Click to reset your password: <a href="${url}">Reset password</a></p>`,
      });
    },
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const callbackUrl = new URL(url);
      callbackUrl.searchParams.set("callbackURL", "http://localhost:5173");

      await Mailer.send({
        to: user.email,
        subject: "Verify your Journal account",
        text: `Click to verify: ${callbackUrl.toString()}`,
        html: `<p>Click to verify: <a href="${callbackUrl.toString()}">Verify</a></p>`,
      });
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: false,
    expiresIn: tools.Time.Hours(1).seconds,
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
