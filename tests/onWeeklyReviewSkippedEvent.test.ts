import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onWeeklyReviewSkippedEvent", () => {
  test("should call repository createSkipped method with the event", async () => {
    const createSkipped = spyOn(Emotions.Repos.WeeklyReviewRepository, "createSkipped").mockImplementation(
      jest.fn(),
    );

    await Emotions.EventHandlers.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent);

    expect(createSkipped).toHaveBeenCalledTimes(1);
    expect(createSkipped).toHaveBeenCalledWith(mocks.GenericWeeklyReviewSkippedEvent);
  });
});
