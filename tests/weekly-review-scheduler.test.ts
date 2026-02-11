import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("WeeklyReviewScheduler", async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const policy = new Emotions.Policies.WeeklyReviewScheduler({
    ...di.Adapters.System,
    ...di.Tools,
    UserDirectoryOHQ: di.Adapters.Auth.UserDirectoryOHQ,
  });

  test("correct path - single user", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewId]);
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.EntriesPerWeekCountQuery, "execute").mockResolvedValue(
        tools.IntegerNonNegative.parse(1),
      ),
    );
    spies.use(spyOn(tools.Week, "fromTimestampValue").mockReturnValue(mocks.week));
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewRequestedEvent]);
  });

  test("WeeklyReviewSchedule - not monday, not 6 pm", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WeeklyReviewSchedule - monday, not 6 pm", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc12Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("WeeklyReviewSchedule - not monday, 6 pm", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("EntriesForWeekExist", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const ids = new bg.IdProviderDeterministicAdapter([mocks.entryId]);
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.EntriesPerWeekCountQuery, "execute").mockResolvedValue(
        tools.IntegerNonNegative.parse(0),
      ),
    );
    spies.use(spyOn(tools.Week, "fromTimestampValue").mockReturnValue(mocks.week));
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewSkippedEvent]);
  });
});
