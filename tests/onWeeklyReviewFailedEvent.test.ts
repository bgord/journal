import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onWeeklyReviewFailedEvent", () => {
  test("should call repository fail method with the event", async () => {
    const fail = spyOn(Emotions.Repos.WeeklyReviewRepository, "fail").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onWeeklyReviewFailedEvent(mocks.GenericWeeklyReviewFailedEvent);

    expect(fail).toHaveBeenCalledTimes(1);
    expect(fail).toHaveBeenCalledWith(mocks.GenericWeeklyReviewFailedEvent);
  });
});
