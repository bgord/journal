import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { Password } from "../modules/auth/value-objects/password";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", usePlural: true }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: Password.MinimumLength,
    maxPasswordLength: Password.MaximumLength,
  },
  autoSignIn: false,
  trustedOrigins: ["http://localhost:5173"],
  plugins: [openAPI()],
  // TODO: wire up logger
});

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
