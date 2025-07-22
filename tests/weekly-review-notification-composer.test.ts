import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewNotificationComposer();

    const notification = composer.compose(mocks.week, [], mocks.advice);

    expect(notification).toEqual(
      new Emotions.VO.NotificationTemplate(
        `Weekly Review - ${mocks.week.getStart()}`,
        `Weekly review: ${mocks.week.getStart()}`,
      ),
    );
  });
});
