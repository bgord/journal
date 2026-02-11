import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { AiGateway, AiQuotaExceededError } from "+ai/open-host-services";
import * as VO from "+ai/value-objects";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const prompt = new VO.Prompt("Give me some insights");

describe("AiGateway", async () => {
  const di = await bootstrap();

  const gateway = new AiGateway({
    Publisher: di.Adapters.AI.AiEventPublisher,
    AiClient: di.Adapters.AI.AiClient,
    IdProvider: di.Adapters.System.IdProvider,
    Clock: di.Adapters.System.Clock,
    BucketCounter: di.Adapters.AI.BucketCounter,
  });

  test("happy path", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
        [mocks.userDailyBucket]: tools.IntegerNonNegative.parse(0),
        [mocks.emotionsAlarmEntryBucket]: tools.IntegerNonNegative.parse(0),
      }),
    );
    spies.use(spyOn(di.Adapters.AI.AiClient, "request").mockResolvedValue(mocks.advice));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const result = await gateway.query(prompt, mocks.EmotionsAlarmEntryContext);

      expect(result).toEqual(mocks.advice);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiRequestRegisteredEmotionsAlarmEntryEvent]);
  });

  test("quota exceeded", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
        [mocks.userDailyBucket]: tools.IntegerNonNegative.parse(11),
        [mocks.emotionsAlarmEntryBucket]: tools.IntegerNonNegative.parse(3),
      }),
    );
    spies.use(spyOn(di.Adapters.AI.AiClient, "request").mockResolvedValue(mocks.advice));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      expect(async () => gateway.query(prompt, mocks.EmotionsAlarmEntryContext)).toThrowError(
        AiQuotaExceededError,
      ),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiQuotaExceededEvent]);
  });
});
