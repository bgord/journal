import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import * as Auth from "+auth";
import { Clock, IdProvider, Logger, Mailer } from "+infra/adapters";
import { db } from "./db";
import { Env } from "./env";
import { EventStore } from "./event-store";

const deps = { IdProvider, Clock };

const production = Env.type === bg.NodeEnvironmentEnum.production;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", usePlural: true }),
  advanced: {
    database: { generateId: () => crypto.randomUUID() },
    useSecureCookies: false,
    cookiePrefix: "journal_v1",
    cookies: {
      session_token: { attributes: { path: "/", sameSite: "lax", secure: false, httpOnly: true } },
      csrf_token: { attributes: { path: "/", sameSite: "lax", secure: false, httpOnly: true } },
    },
  },
  session: { expiresIn: tools.Duration.Days(30).seconds, updateAge: tools.Duration.Days(1).seconds },
  rateLimit: { enabled: true, window: tools.Duration.Minutes(5).seconds, max: 100 },
  user: {
    deleteUser: {
      enabled: true,
      async afterDelete(user) {
        const event = Auth.Events.AccountDeletedEvent.parse({
          ...bg.createEventEnvelope(`account_${user.id}`, deps),
          name: Auth.Events.ACCOUNT_DELETED_EVENT,
          payload: { userId: user.id, timestamp: deps.Clock.nowMs() },
        } satisfies Auth.Events.AccountDeletedEventType);

        await EventStore.save([event]);
      },
    },
  },
  emailAndPassword: {
    // TODO
    // disableSignUp: tools.FeatureFlag.isDisabled(Env.SIGNUP_ENABLED),
    disableSignUp: false,
    autoSignIn: false,
    enabled: true,
    minPasswordLength: Auth.VO.Password.MinimumLength,
    maxPasswordLength: Auth.VO.Password.MaximumLength,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      await Mailer.send({
        to: user.email,
        ...new Auth.Services.PasswordResetNotificationComposer().compose(url),
      });
    },
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await Mailer.send({
        to: user.email,
        ...new Auth.Services.EmailVerificationNotificationComposer().compose(url),
      });
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: false,
    expiresIn: tools.Duration.Hours(1).seconds,
    async afterEmailVerification(user) {
      const event = Auth.Events.AccountCreatedEvent.parse({
        ...bg.createEventEnvelope(`account_${user.id}`, deps),
        name: Auth.Events.ACCOUNT_CREATED_EVENT,
        payload: { userId: user.id, timestamp: deps.Clock.nowMs() },
      } satisfies Auth.Events.AccountCreatedEventType);

      await EventStore.save([event]);
    },
  },
  autoSignIn: false,
  trustedOrigins: ["http://localhost:3000", "https://journal.bgord.dev", "http://journal.bgord.dev", "*"],
  plugins: [
    production ? openAPI() : undefined,
    // TODO
    // Env.type === bg.NodeEnvironmentEnum.production
    //   ? captcha({ provider: "hcaptcha", secretKey: Env.HCAPTCHA_SECRET_KEY })
    //   : undefined,
    // production ? haveIBeenPwned() : undefined,
  ].filter((plugin) => plugin !== undefined),
  logger: new bg.BetterAuthLogger(Logger).attach(),
});

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};

export const AuthShield = new bg.ShieldAuth(auth);
