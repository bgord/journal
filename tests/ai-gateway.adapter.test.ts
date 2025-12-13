import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { AiGateway, AiQuotaExceededError } from "+ai/open-host-services";
import * as VO from "+ai/value-objects";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const prompt = new VO.Prompt("Give me some insights");

describe("AiGateway", async () => {
  const di = await bootstrap(mocks.Env);

  const gateway = new AiGateway({
    Publisher: di.Adapters.AI.AiEventPublisher,
    AiClient: di.Adapters.AI.AiClient,
    IdProvider: di.Adapters.System.IdProvider,
    Clock: di.Adapters.System.Clock,
    BucketCounter: di.Adapters.AI.BucketCounter,
  });

  test("happy path", async () => {
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsAlarmEntryBucket]: 0,
    });
    spyOn(di.Adapters.AI.AiClient, "request").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const result = await gateway.query(prompt, mocks.EmotionsAlarmEntryContext);
      expect(result).toEqual(mocks.advice);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiRequestRegisteredEmotionsAlarmEntryEvent]);
  });

  test("quota exceeded", async () => {
    spyOn(di.Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 11,
      [mocks.emotionsAlarmEntryBucket]: 3,
    });
    spyOn(di.Adapters.AI.AiClient, "request").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => gateway.query(prompt, mocks.EmotionsAlarmEntryContext)).toThrowError(
        AiQuotaExceededError,
      );
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiQuotaExceededEvent]);
  });
});
