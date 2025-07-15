import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onSituationLoggedEvent", () => {
  test("should call repository logSituation method with the event", async () => {
    const logSituation = spyOn(Emotions.Repos.EntryRepository, "logSituation").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onSituationLoggedEvent(mocks.GenericSituationLoggedEvent);

    expect(logSituation).toHaveBeenCalledTimes(1);
    expect(logSituation).toHaveBeenCalledWith(mocks.GenericSituationLoggedEvent);

    jest.restoreAllMocks();
  });
});
