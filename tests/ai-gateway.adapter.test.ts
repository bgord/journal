import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { AiGateway, AiQuotaExceededError } from "+ai/open-host-services";
import * as VO from "+ai/value-objects";
import * as Adapters from "+infra/adapters";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const gateway = new AiGateway({
  Publisher: Adapters.AI.AiEventStorePublisher,
  AiClient: Adapters.AI.AiClient,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  BucketCounter: Adapters.AI.BucketCounter,
});

const prompt = new VO.Prompt("Give me some insights");

describe("AiGateway", () => {
  test("happy path", async () => {
    spyOn(Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsAlarmEntryBucket]: 0,
    });
    spyOn(Adapters.AI.AiClient, "request").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const result = await gateway.query(prompt, mocks.EmotionsAlarmEntryContext);
      expect(result).toEqual(mocks.advice);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiRequestRegisteredEmotionsAlarmEntryEvent]);
  });

  test("quota exceeded", async () => {
    spyOn(Adapters.AI.BucketCounter, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 11,
      [mocks.emotionsAlarmEntryBucket]: 3,
    });
    spyOn(Adapters.AI.AiClient, "request").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => gateway.query(prompt, mocks.EmotionsAlarmEntryContext)).toThrowError(
        AiQuotaExceededError,
      );
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiQuotaExceededEvent]);
  });
});
