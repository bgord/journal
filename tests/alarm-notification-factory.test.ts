import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

describe("AlarmNotificationFactory", () => {
  test("entry - en", async () => {
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "Emotional advice",
        `Advice for emotion entry: anger: ${mocks.advice.get()}`,
      ),
    );
  });

  test("entry - pl", async () => {
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.pl,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate("Porada emocjonalna", `Porada dla emocji: anger: ${mocks.advice.get()}`),
    );
  });

  test("inactivity - en", async () => {
    const result = await new Emotions.Services.AlarmNotificationFactory(
      Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.inactivityDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "Inactivity advice",
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    );
  });

  test("inactivity - pl", async () => {
    const result = await new Emotions.Services.AlarmNotificationFactory(
      Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.pl,
    ).create(mocks.inactivityDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "Porada dla braku aktywności",
        `Brak aktywności przez ${mocks.inactivityTrigger.inactivityDays} dni, porada: ${mocks.advice.get()}`,
      ),
    );
  });
});
