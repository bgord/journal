import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("WeeklyReviewExportByEmail", async () => {
  const di = await bootstrap();
  const saga = new Emotions.Sagas.WeeklyReviewExportByEmail({
    ...di.Adapters.System,
    ...di.Tools,
    PdfGenerator: di.Adapters.Emotions.PdfGenerator,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    WeeklyReviewExportQuery: di.Adapters.Emotions.WeeklyReviewExportQuery,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - no email", async () => {
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined);
    const weeklyReviewExportQuery = spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull");
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
    expect(weeklyReviewExportQuery).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - user repo failure", async () => {
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockRejectedValue(new Error("FAILURE"));
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - no weeklyReview", async () => {
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - weeklyReview failure", async () => {
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockRejectedValue(new Error("FAILURE"));
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - mailer failure", async () => {
    spyOn(di.Adapters.System.Mailer, "send").mockRejectedValue(new Error("FAILURE"));
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(mocks.weeklyReviewFull);
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
  });

  test("onWeeklyReviewExportByEmailRequestedEvent", async () => {
    spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());
    spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(di.Adapters.Emotions.WeeklyReviewExportQuery, "getFull").mockResolvedValue(mocks.weeklyReviewFull);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: di.Env.EMAIL_FROM,
      to: mocks.email,
      subject: `JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`,
      html: "Find the file attached",
      attachments: [
        {
          filename: tools.Filename.fromString(`weekly-review-export-${mocks.week.toIsoId()}.pdf`),
          content: mocks.PDF,
          contentType: "application/pdf",
        },
      ],
    });
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 1st", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 2nd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent2nd),
    );

    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 3rd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent3rd),
    );

    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 4rd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent4th),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
