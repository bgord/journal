import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onWeeklyReviewRequestedEvent", () => {
  test("should call repository create method with the event", async () => {
    const create = spyOn(Emotions.Repos.WeeklyReviewRepository, "create").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent);

    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith(mocks.GenericWeeklyReviewRequestedEvent);
  });
});
