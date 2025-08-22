import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { SupportedLanguages } from "+languages";
import * as Preferences from "+preferences";
import { UserLanguageQueryAdapter } from "+infra/adapters/preferences";
import { CommandBus } from "+infra/command-bus";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { logger } from "+infra/logger";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(logger);
const policy = new Preferences.Policies.SetDefaultUserLanguage(
  EventBus,
  EventHandler,
  CommandBus,
  SupportedLanguages.en,
);

describe("SetDefaultUserLanguage", () => {
  test("onAccountCreatedEvent - no language set", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(null);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onAccountCreatedEvent(mocks.GenericAccountCreatedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericUserLanguageSetEvent]);
  });

  test("onAccountCreatedEvent - does not duplicate events", async () => {
    spyOn(UserLanguageQueryAdapter, "get").mockResolvedValue(
      Preferences.VO.LanguageTag.create(SupportedLanguages.en),
    );
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onAccountCreatedEvent(mocks.GenericAccountCreatedEvent);
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
