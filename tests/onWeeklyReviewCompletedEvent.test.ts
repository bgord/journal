import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onWeeklyReviewCompletedEvent", () => {
  test("should call repository complete method with the event", async () => {
    const complete = spyOn(Emotions.Repos.WeeklyReviewRepository, "complete").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent);

    expect(complete).toHaveBeenCalledTimes(1);
    expect(complete).toHaveBeenCalledWith(mocks.GenericWeeklyReviewCompletedEvent);
  });
});
