import { describe, expect, jest, spyOn, test } from "bun:test";
import { onEmotionReappraisedEvent } from "../modules/emotions/handlers/onEmotionReappraisedEvent";
import { EmotionJournalEntryRepository } from "../modules/emotions/repositories/";
import { GenericEmotionReappraisedEvent } from "./mocks";

describe("onEmotionReappraisedEvent", () => {
  test("should call repository reappraiseEmotion method with the event", async () => {
    const reappraiseEmotion = spyOn(EmotionJournalEntryRepository, "reappraiseEmotion").mockImplementation(
      jest.fn(),
    );

    await onEmotionReappraisedEvent(GenericEmotionReappraisedEvent);

    expect(reappraiseEmotion).toHaveBeenCalledTimes(1);
    expect(reappraiseEmotion).toHaveBeenCalledWith(GenericEmotionReappraisedEvent);

    reappraiseEmotion.mockRestore();
  });
});
