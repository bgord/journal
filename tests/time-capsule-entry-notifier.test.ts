import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("TimeCapsuleEntryNotifier", async () => {
  const di = await bootstrap();
  const policy = new Emotions.Policies.TimeCapsuleEntryNotifier({
    ...di.Adapters.System,
    ...di.Tools,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });

  const config = { from: di.Env.EMAIL_FROM, to: mocks.email };

  test("onSituationLoggedEvent - regular entry", async () => {
    using userContactOhqGet = spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(
      SupportedLanguages.en,
    );
    using userContaxtOhqGetPrimary = spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(
      undefined,
    );
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedEvent),
    );

    expect(userContactOhqGet).not.toHaveBeenCalled();
    expect(userContaxtOhqGetPrimary).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onSituationLoggedEvent - no contact", async () => {
    using UserLanguageOhqGet = spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(
      SupportedLanguages.en,
    );
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send");
    using _ = spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(UserLanguageOhqGet).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onSituationLoggedEvent - en", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      config,
      message: { subject: "JOURNAL - time capsule entry", html: "Go to the homepage" },
    });
  });

  test("onSituationLoggedEvent - pl", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.pl));
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      config,
      message: { subject: "JOURNAL - wpis z przeszłości", html: "Odwiedź stronę główną" },
    });
  });
});
