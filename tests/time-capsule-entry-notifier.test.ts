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

  test("onSituationLoggedEvent - no contact", async () => {
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onSituationLoggedEvent - en", async () => {
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: di.Env.EMAIL_FROM,
      to: mocks.email,
      subject: "JOURNAL - time capsule entry",
      html: "Go to the homepage",
    });
  });

  test("onSituationLoggedEvent - pl", async () => {
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.pl);
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: di.Env.EMAIL_FROM,
      to: mocks.email,
      subject: "JOURNAL - wpis z przeszłości",
      html: "Odwiedź stronę główną",
    });
  });
});
