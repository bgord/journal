import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { haveIBeenPwned, openAPI } from "better-auth/plugins";
import * as Auth from "+auth";
import type { EventStoreType } from "+infra/adapters/system/event-store";
import { db } from "+infra/db";
import type { EnvironmentType } from "+infra/env";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  Logger: bg.LoggerPort;
  EventStore: EventStoreType;
  Mailer: bg.MailerPort;
};

export function createShieldAuth(Env: EnvironmentType, deps: Dependencies) {
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
          const event = Auth.Events.AccountDeletedEvent.parse({
            ...bg.createEventEnvelope(`account_${user.id}`, deps),
            name: Auth.Events.ACCOUNT_DELETED_EVENT,
            payload: { userId: user.id, timestamp: deps.Clock.now().ms },
          } satisfies Auth.Events.AccountDeletedEventType);

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
        await deps.Mailer.send({
          to: user.email,
          ...new Auth.Services.PasswordResetNotificationComposer().compose(tools.UrlWithoutSlash.parse(url)),
        });
      },
    },
    emailVerification: {
      async sendVerificationEmail({ user, url }) {
        await deps.Mailer.send({
          to: user.email,
          ...new Auth.Services.EmailVerificationNotificationComposer(Env.BETTER_AUTH_URL).compose(
            tools.UrlWithoutSlash.parse(url),
          ),
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
          payload: { userId: user.id, timestamp: deps.Clock.now().ms },
        } satisfies Auth.Events.AccountCreatedEventType);

        await deps.EventStore.save([event]);
      },
    },
    autoSignIn: false,
    plugins: [
      production ? openAPI() : undefined,
      // Env.type === bg.NodeEnvironmentEnum.production
      //   ? captcha({ provider: "hcaptcha", secretKey: Env.HCAPTCHA_SECRET_KEY })
      //   : undefined,
      production ? haveIBeenPwned() : undefined,
    ].filter((plugin) => plugin !== undefined),
    logger: new bg.BetterAuthLogger(deps).attach(),
  });

  return { ShieldAuth: new bg.ShieldAuthStrategy(config), config };
}

export type AuthVariables = {
  user: ReturnType<typeof createShieldAuth>["config"]["$Infer"]["Session"]["user"];
  session: ReturnType<typeof createShieldAuth>["config"]["$Infer"]["Session"]["session"];
};
