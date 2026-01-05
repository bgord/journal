import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("AlarmNotificationFactory", async () => {
  const di = await bootstrap();

  test("entry - missing snapshot", async () => {
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(undefined);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual(null);
  });

  test("entry - en", async () => {
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - emotional advice",
        `Advice for emotion entry: anger: ${mocks.advice.get()}`,
      ),
    );
  });

  test("entry - pl", async () => {
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.pl,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - porada emocjonalna",
        `Porada dla emocji: anger: ${mocks.advice.get()}`,
      ),
    );
  });

  test("inactivity - en", async () => {
    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.inactivityDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - inactivity advice",
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    );
  });

  test("inactivity - pl", async () => {
    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.pl,
    ).create(mocks.inactivityDetection, mocks.advice);

    expect(result).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - porada dla braku aktywności",
        `Brak aktywności przez ${mocks.inactivityTrigger.inactivityDays} dni, porada: ${mocks.advice.get()}`,
      ),
    );
  });

  test("unknown type", async () => {
    expect(
      async () =>
        await new Emotions.Services.AlarmNotificationFactory(
          di.Adapters.Emotions.EntrySnapshot,
          SupportedLanguages.en,
          // @ts-expect-error
        ).create(new Emotions.VO.AlarmDetection("unknown", "unknown"), mocks.advice),
    ).toThrow("alarm.notification.factory.error.unknown.trigger");
  });
});
