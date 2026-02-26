import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("InactivityAlarmScheduler", async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const policy = new Emotions.Policies.InactivityAlarmScheduler({
    ...di.Adapters.System,
    ...di.Tools,
    UserDirectoryOHQ: di.Adapters.Auth.UserDirectoryOHQ,
    GetLatestEntryTimestampForUserQuery: di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery,
  });

  test("correct path - single user", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery, "execute").mockResolvedValue(
        mocks.inactivityTrigger.lastEntryTimestamp,
      ),
    );
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    spies.use(spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({ violations: [] }));

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericInactivityAlarmGeneratedEvent]);
  });

  test.todo("USER_DAILY", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery, "execute").mockResolvedValue(
        mocks.inactivityTrigger.lastEntryTimestamp,
      ),
    );
    spies.use(
      spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
        violations: [
          {
            bucket: mocks.userDailyBucket,
            limit: AI.QuotaLimit.parse(10),
            id: "USER_DAILY",
            used: tools.IntegerNonNegative.parse(10),
          },
        ],
      }),
    );
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test.todo("EMOTIONS_ALARM_INACTIVITY_WEEKLY", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery, "execute").mockResolvedValue(
        mocks.inactivityTrigger.lastEntryTimestamp,
      ),
    );
    spies.use(
      spyOn(di.Adapters.AI.AiGateway, "check").mockResolvedValue({
        violations: [
          {
            bucket: mocks.emotionsAlarmInactivityWeeklyBucket,
            limit: AI.QuotaLimit.parse(1),
            id: "EMOTIONS_ALARM_INACTIVITY_WEEKLY",
            used: tools.IntegerNonNegative.parse(1),
          },
        ],
      }),
    );
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event);
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("DailyAlarmLimit - failure", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const ids = new bg.IdProviderDeterministicAdapter([mocks.alarmId]);
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery, "execute").mockResolvedValue(
        mocks.inactivityTrigger.lastEntryTimestamp,
      ),
    );
    spies.use(spyOn(di.Adapters.AI.AiGateway, "check").mockImplementation(mocks.throwIntentionalErrorAsync));
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(
        async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
      ).toThrow();
    });

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek - undefined timestamp", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery, "execute").mockResolvedValue(undefined),
    );

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("NoEntriesInTheLastWeek", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds").mockResolvedValue([mocks.userId]),
    );
    spies.use(
      spyOn(di.Adapters.Emotions.GetLatestEntryTimestampForUserQuery, "execute").mockResolvedValue(
        mocks.GenericHourHasPassedWednesdayUtc18Event.payload.timestamp,
      ),
    );

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedWednesdayUtc18Event),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("InactivityAlarmSchedule - wednesday, not 6 pm", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using userDirectoryOhqListActiveUserIds = spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds");

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedEvent),
    );

    expect(userDirectoryOhqListActiveUserIds).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("InactivityAlarmSchedule - not wednesday, 6 pm", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using userDirectoryOhqListActiveUserIds = spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds");

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event),
    );

    expect(userDirectoryOhqListActiveUserIds).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("InactivityAlarmSchedule - not wednesday, not 6 pm", async () => {
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    using userDirectoryOhqListActiveUserIds = spyOn(di.Adapters.Auth.UserDirectoryOHQ, "listActiveUserIds");

    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await policy.onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc12Event),
    );

    expect(userDirectoryOhqListActiveUserIds).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
