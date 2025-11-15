import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as Adapters from "+infra/adapters";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(Adapters.Logger);
const policy = new Emotions.Policies.TimeCapsuleEntryNotifier({
  EventBus,
  EventHandler,
  Mailer: Adapters.Mailer,
  UserContact: Adapters.Auth.UserContact,
  UserLanguage: Adapters.Preferences.UserLanguage,
  EMAIL_FROM: Env.EMAIL_FROM,
});

describe("TimeCapsuleEntryNotifier", () => {
  test("onSituationLoggedEvent - no contact", async () => {
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(undefined);
    const mailerSend = spyOn(Adapters.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onSituationLoggedEvent - en", async () => {
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(mocks.contact);
    const mailerSend = spyOn(Adapters.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Time capsule entry",
      html: "Go to the homepage",
    });
  });

  test("onSituationLoggedEvent - pl", async () => {
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.pl);
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(mocks.contact);
    const mailerSend = spyOn(Adapters.Mailer, "send");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onSituationLoggedEvent(mocks.GenericSituationLoggedTimeCapsuleEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Wpis z przeszłości",
      html: "Odwiedź stronę główną",
    });
  });
});
