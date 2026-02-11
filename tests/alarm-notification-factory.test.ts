import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("AlarmNotificationFactory", async () => {
  const di = await bootstrap();

  test("entry - missing snapshot", async () => {
    using _ = spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(undefined);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual(null);
  });

  test("entry - en", async () => {
    using _ = spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - emotional advice"),
      html: bg.MailerContentHtml.parse(`Advice for emotion entry: anger: ${mocks.advice.get()}`),
    });
  });

  test("entry - pl", async () => {
    using _ = spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.pl,
    ).create(mocks.entryDetection, mocks.advice);

    expect(result).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - porada emocjonalna"),
      html: bg.MailerContentHtml.parse(`Porada dla emocji: anger: ${mocks.advice.get()}`),
    });
  });

  test("inactivity - en", async () => {
    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.inactivityDetection, mocks.advice);

    expect(result).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - inactivity advice"),
      html: bg.MailerContentHtml.parse(
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    });
  });

  test("inactivity - pl", async () => {
    const result = await new Emotions.Services.AlarmNotificationFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.pl,
    ).create(mocks.inactivityDetection, mocks.advice);

    expect(result).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - porada dla braku aktywności"),
      html: bg.MailerContentHtml.parse(
        `Brak aktywności przez ${mocks.inactivityTrigger.inactivityDays} dni, porada: ${mocks.advice.get()}`,
      ),
    });
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
