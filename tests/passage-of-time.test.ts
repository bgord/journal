import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Services from "../app/services";
import { EventStore } from "../infra/event-store";
import * as mocks from "./mocks";

describe("PassageOfTime", () => {
  test("correct path", async () => {
    spyOn(Date, "now").mockReturnValue(mocks.hourHasPassedTimestamp);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      await Services.PassageOfTime.process();
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericHourHasPassedEvent]);
  });
});
