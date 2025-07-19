import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("AlarmNotificationFactory", () => {
  test("entry", async () => {
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);

    const result = await Emotions.Services.AlarmNotificationFactory.create(
      mocks.entryDetection,
      mocks.advice,
    );

    expect(result).toEqual(
      new Emotions.Services.NotificationTemplate(
        "Emotional advice",
        "Advice for emotion entry: anger: You should do something",
      ),
    );

    jest.restoreAllMocks();
  });

  test("inactivity", async () => {
    const result = await Emotions.Services.AlarmNotificationFactory.create(
      mocks.inactivityDetection,
      mocks.advice,
    );

    expect(result).toEqual(
      new Emotions.Services.NotificationTemplate(
        "Inactivity advice",
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    );
  });
});
