import { describe, expect, it, jest, spyOn } from "bun:test";
import { onSituationLoggedEvent } from "../modules/emotions/handlers/onSituationLoggedEvent";
import { EmotionJournalEntryRepository } from "../modules/emotions/repositories/";
import { GenericSituationLoggedEvent } from "./mocks";

describe("onSituationLoggedEvent", () => {
  it("should call repository logSituation method with the event", async () => {
    const logSituation = spyOn(EmotionJournalEntryRepository, "logSituation").mockImplementation(jest.fn());

    await onSituationLoggedEvent(GenericSituationLoggedEvent);

    expect(logSituation).toHaveBeenCalledTimes(1);
    expect(logSituation).toHaveBeenCalledWith(GenericSituationLoggedEvent);

    logSituation.mockRestore();
  });
});
