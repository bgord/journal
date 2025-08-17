import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { EntrySnapshot } from "+infra/adapters/emotions";
import * as mocks from "./mocks";

describe("AlarmNotificationFactory", () => {
  test("entry", async () => {
    spyOn(EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.Services.AlarmNotificationFactory(EntrySnapshot).create(
      mocks.entryDetection,
      mocks.advice,
    );

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "Emotional advice",
        `Advice for emotion entry: anger: ${mocks.advice.get()}`,
      ),
    );
  });

  test("inactivity", async () => {
    const result = await new Emotions.Services.AlarmNotificationFactory(EntrySnapshot).create(
      mocks.inactivityDetection,
      mocks.advice,
    );

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "Inactivity advice",
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    );
  });
});
