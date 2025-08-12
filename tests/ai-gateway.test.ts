import * as VO from "+ai/value-objects";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { AiClient } from "../infra/ai-client";
import { EventStore } from "../infra/event-store";
import { AiGateway, AiQuotaExceededError } from "../modules/ai/open-host-services/ai-gateway";
import { BucketCounterDrizzleRepository } from "../modules/ai/repositories/bucket-counter.drizzle";
import * as mocks from "./mocks";

const bucketCounterRepo = new BucketCounterDrizzleRepository();

const gateway = new AiGateway(AiClient, bucketCounterRepo);

const prompt = new VO.Prompt("Give me some insights");

describe("AiGateway", () => {
  test("happy path", async () => {
    spyOn(Date, "now").mockReturnValue(mocks.aiRequestRegisteredTimestamp);
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 0,
      [mocks.emotionsAlarmEntryBucket]: 0,
    });
    spyOn(AiClient, "request").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const result = await gateway.request(prompt, mocks.EmotionsAlarmEntryContext);
      expect(result).toEqual(mocks.advice);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiRequestRegisteredEvent]);
  });

  test("quota exceeded", async () => {
    spyOn(Date, "now").mockReturnValue(mocks.aiRequestRegisteredTimestamp);
    spyOn(bucketCounterRepo, "getMany").mockResolvedValue({
      [mocks.userDailyBucket]: 11,
      [mocks.emotionsAlarmEntryBucket]: 3,
    });
    spyOn(AiClient, "request").mockResolvedValue(mocks.advice);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      expect(async () => await gateway.request(prompt, mocks.EmotionsAlarmEntryContext)).toThrowError(
        AiQuotaExceededError,
      );
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAiQuotaExceededEvent]);
  });
});
