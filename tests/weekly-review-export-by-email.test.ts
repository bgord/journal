import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as Adapters from "+infra/adapters";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler({ Logger: Adapters.Logger });
const saga = new Emotions.Sagas.WeeklyReviewExportByEmail({
  EventBus,
  EventHandler,
  EventStore,
  Mailer: Adapters.Mailer,
  PdfGenerator: Adapters.Emotions.PdfGenerator,
  UserContact: Adapters.Auth.UserContact,
  WeeklyReviewExport: Adapters.Emotions.WeeklyReviewExport,
  UserLanguage: Adapters.Preferences.UserLanguage,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  EMAIL_FROM: Env.EMAIL_FROM,
});

describe("WeeklyReviewExportByEmail", () => {
  test("onWeeklyReviewExportByEmailRequestedEvent - no email", async () => {
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - user repo failure", async () => {
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockRejectedValue(new Error("FAILURE"));
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - no weeklyReview", async () => {
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(Adapters.Emotions.WeeklyReviewExport, "getFull").mockResolvedValue(undefined);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - weeklyReview failure", async () => {
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(Adapters.Emotions.WeeklyReviewExport, "getFull").mockRejectedValue(new Error("FAILURE"));
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - mailer failure", async () => {
    spyOn(Adapters.Mailer, "send").mockRejectedValue(new Error("FAILURE"));
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(Adapters.Emotions.WeeklyReviewExport, "getFull").mockResolvedValue(mocks.weeklyReviewFull);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
  });

  test("onWeeklyReviewExportByEmailRequestedEvent", async () => {
    spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(Adapters.Emotions.WeeklyReviewExport, "getFull").mockResolvedValue(mocks.weeklyReviewFull);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailRequestedEvent(mocks.GenericWeeklyReviewExportByEmailRequestedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: `JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`,
      html: "Find the file attached",
      attachments: [
        {
          filename: `weekly-review-export-${mocks.week.toIsoId()}.pdf`,
          content: mocks.PDF,
          contentType: "application/pdf",
        },
      ],
    });
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 1st", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 2nd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent2nd),
    );
    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 3rd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent3rd),
    );
    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 4rd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent4th),
    );
    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
