import * as Emotions from "+emotions";
import { describe, expect, spyOn, test } from "bun:test";
import * as mocks from "./mocks";

describe("AlarmNotificationFactory", () => {
  test("entry", async () => {
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);

    const result = await Emotions.Services.AlarmNotificationFactory.create(
      mocks.entryDetection,
      mocks.advice,
    );

    expect(result).toEqual(
      new Emotions.VO.NotificationTemplate(
        "Emotional advice",
        `Advice for emotion entry: anger: ${mocks.advice.get()}`,
      ),
    );
  });

  test("inactivity", async () => {
    const result = await Emotions.Services.AlarmNotificationFactory.create(
      mocks.inactivityDetection,
      mocks.advice,
    );

    expect(result).toEqual(
      new Emotions.VO.NotificationTemplate(
        "Inactivity advice",
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    );
  });
});
