import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { languages } from "+languages";
import * as Preferences from "+preferences";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("SetDefaultUserLanguage", async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);

  const policy = new Preferences.Policies.SetDefaultUserLanguage(languages.fallback, {
    ...di.Adapters.System,
    ...di.Tools,
  });

  test("onAccountCreatedEvent - no language set", async () => {
    using _ = spyOn(di.Adapters.Preferences.UserLanguageQuery, "get").mockResolvedValue(null);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onAccountCreatedEvent(mocks.GenericAccountCreatedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericUserLanguageSetEvent]);
  });

  test("onAccountCreatedEvent - does not duplicate events", async () => {
    using _ = spyOn(di.Adapters.Preferences.UserLanguageQuery, "get").mockResolvedValue(
      languages.supported.en,
    );
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onAccountCreatedEvent(mocks.GenericAccountCreatedEvent);
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
