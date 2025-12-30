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
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewId]);
    spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.EntriesPerWeekCountQuery, "execute").mockResolvedValue(
      tools.IntegerNonNegative.parse(1),
    );
    spyOn(tools.Week, "fromTimestampValue").mockReturnValue(mocks.week);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate());
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewRequestedEvent]);
  });

  test("WeeklyReviewSchedule", async () => {
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("EntriesForWeekExist", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.entryId]);
    spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]);
    spyOn(di.Adapters.Emotions.EntriesPerWeekCountQuery, "execute").mockResolvedValue(
      tools.IntegerNonNegative.parse(0),
    );
    spyOn(tools.Week, "fromTimestampValue").mockReturnValue(mocks.week);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate());
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewSkippedEvent]);
  });
});
