import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { createEnvironmentLoader } from "+infra/env";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("TimeCapsuleEntriesScheduler", async () => {
  const EnvironmentLoader = createEnvironmentLoader();
  const di = await bootstrap(await EnvironmentLoader.load());
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const policy = new Emotions.Policies.TimeCapsuleEntriesScheduler({
    ...di.Adapters.System,
    TimeCapsuleDueEntries: di.Adapters.Emotions.TimeCapsuleDueEntries,
  });

  test("TimeCapsuleEntryIsPublishable - status", async () => {
    spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([
      mocks.timeCapsuleEntryPublished,
    ]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("TimeCapsuleEntryIsPublishable - scheduledFor", async () => {
    spyOn(di.Adapters.System.Clock, "nowMs").mockReturnValueOnce(
      mocks.T0.subtract(tools.Duration.Days(1)).ms,
    );
    spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([mocks.timeCapsuleEntry]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no time capsule entries", async () => {
    spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    spyOn(di.Adapters.System.Clock, "now").mockReturnValueOnce(mocks.timeCapsuleEntryScheduledFor);
    spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([mocks.timeCapsuleEntry]);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([
      mocks.GenericSituationLoggedTimeCapsuleEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
  });
});
