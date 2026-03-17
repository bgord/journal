import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { haveIBeenPwned } from "better-auth/plugins/haveibeenpwned";
import * as v from "valibot";
import * as Auth from "+auth";
import * as wip from "+infra/build";
import { db } from "+infra/db";
import type { EnvironmentResultType } from "+infra/env";

export type AuthVariables = {
  user: ReturnType<typeof betterAuth>["$Infer"]["Session"]["user"];
  session: ReturnType<typeof betterAuth>["$Infer"]["Session"]["session"];
};

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  Logger: bg.LoggerPort;
  EventStore: bg.EventStorePort<Auth.Events.AccountCreatedEventType | Auth.Events.AccountDeletedEventType>;
  Mailer: bg.MailerPort;
};

export function createShieldAuth(Env: EnvironmentResultType, deps: Dependencies) {
  const production = Env.type === bg.NodeEnvironmentEnum.production;

  const config = betterAuth({
    secret: Env.BETTER_AUTH_SECRET,
    baseURL: Env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, { provider: "sqlite", usePlural: true }),
    advanced: { database: { generateId: () => crypto.randomUUID() }, useSecureCookies: production },
    session: { expiresIn: tools.Duration.Days(30).seconds, updateAge: tools.Duration.Days(1).seconds },
    rateLimit: { enabled: true, window: tools.Duration.Minutes(5).seconds, max: 100 },
    user: {
      deleteUser: {
        enabled: true,
        async afterDelete(user) {
          const event = wip.event(
            Auth.Events.AccountDeletedEvent,
            `account_${user.id}`,
            { userId: user.id, timestamp: deps.Clock.now().ms },
            deps,
          );

          await deps.EventStore.save([event]);
        },
      },
    },
    emailAndPassword: {
      disableSignUp: tools.FeatureFlag.isDisabled(Env.SIGNUP_ENABLED),
      autoSignIn: false,
      enabled: true,
      minPasswordLength: Auth.VO.Password.MinimumLength,
      maxPasswordLength: Auth.VO.Password.MaximumLength,
      requireEmailVerification: true,
      async sendResetPassword({ user, url }) {
        const config = { to: v.parse(tools.Email, user.email), from: Env.EMAIL_FROM };
        const message = new Auth.Services.PasswordResetNotificationComposer().compose(
          v.parse(tools.UrlWithoutSlash, url),
        );

        await deps.Mailer.send(new bg.MailerTemplate(config, message));
      },
    },
    emailVerification: {
      async sendVerificationEmail({ user, url }) {
        const config = { to: v.parse(tools.Email, user.email), from: Env.EMAIL_FROM };
        const message = new Auth.Services.EmailVerificationNotificationComposer(Env.BETTER_AUTH_URL).compose(
          v.parse(tools.UrlWithoutSlash, url),
        );

        await deps.Mailer.send(new bg.MailerTemplate(config, message));
      },
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: false,
      expiresIn: tools.Duration.Hours(1).seconds,
      async afterEmailVerification(user) {
        const event = wip.event(
          Auth.Events.AccountCreatedEvent,
          `account_${user.id}`,
          { userId: user.id, timestamp: deps.Clock.now().ms },
          deps,
        );

        await deps.EventStore.save([event]);
      },
    },
    autoSignIn: false,
    plugins: [
      // Env.type === bg.NodeEnvironmentEnum.production
      //   ? captcha({ provider: "hcaptcha", secretKey: Env.HCAPTCHA_SECRET_KEY })
      //   : undefined,
      production ? haveIBeenPwned() : undefined,
    ].filter((plugin) => plugin !== undefined),
    logger: new bg.BetterAuthLogger(deps).attach(),
  });

  const AuthSessionReader = new bg.AuthSessionReaderBetterAuthAdapter(config);

  return { ShieldAuth: new bg.ShieldAuthHonoStrategy({ AuthSessionReader, ...deps }), config };
}
