import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onEmotionJournalEntryDeletedEvent", () => {
  test("should call repository deleteEntry method with the event", async () => {
    const deleteEntry = spyOn(Emotions.Repos.EmotionJournalEntryRepository, "deleteEntry").mockImplementation(
      jest.fn(),
    );

    await Emotions.Handlers.onEmotionJournalEntryDeletedEvent(mocks.GenericEmotionJournalEntryDeletedEvent);

    expect(deleteEntry).toHaveBeenCalledTimes(1);
    expect(deleteEntry).toHaveBeenCalledWith(mocks.GenericEmotionJournalEntryDeletedEvent);

    jest.restoreAllMocks();
  });
});
