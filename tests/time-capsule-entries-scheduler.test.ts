import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("TimeCapsuleEntriesScheduler", async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const policy = new Emotions.Policies.TimeCapsuleEntriesScheduler({
    ...di.Adapters.System,
    ...di.Tools,
    TimeCapsuleDueEntries: di.Adapters.Emotions.TimeCapsuleDueEntries,
  });

  test("TimeCapsuleEntryIsPublishable - invalid status, valid timing", async () => {
    using _ = spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([
      mocks.timeCapsuleEntryPublished,
    ]);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("TimeCapsuleEntryIsPublishable - invalid status, invalid timing", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.Clock, "now").mockReturnValueOnce(mocks.timeCapsuleEntryScheduledFor));
    spies.use(
      spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([
        mocks.timeCapsuleEntryPublished,
      ]),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("TimeCapsuleEntryIsPublishable - valid status, invalid timing", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.System.Clock, "now").mockReturnValueOnce(mocks.T0.subtract(tools.Duration.Days(1))),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([
        mocks.timeCapsuleEntry,
      ]),
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path - no time capsule entries", async () => {
    using _ = spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([]);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("correct path", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.System.Clock, "now").mockReturnValueOnce(mocks.timeCapsuleEntryScheduledFor));
    spies.use(
      spyOn(di.Adapters.Emotions.TimeCapsuleDueEntries, "listDue").mockResolvedValue([
        mocks.timeCapsuleEntry,
      ]),
    );

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
