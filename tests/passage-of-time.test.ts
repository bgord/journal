import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import * as Services from "../app/services";
import * as mocks from "./mocks";

describe("PassageOfTime", async () => {
  const di = await bootstrap();
  const PassageOfTime = new Services.PassageOfTime(di.Adapters.System);

  test("correct path", async () => {
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => PassageOfTime.process());

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericHourHasPassedEvent]);
  });
});
