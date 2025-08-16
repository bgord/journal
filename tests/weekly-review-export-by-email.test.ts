import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import { PdfGenerator } from "+infra/adapters/emotions";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import { Mailer } from "+infra/mailer";
import * as mocks from "./mocks";

describe("WeeklyReviewExportByEmail", () => {
  test("onWeeklyReviewExportByEmailRequestedEvent - no email", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(undefined);

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailRequestedEvent(
          mocks.GenericWeeklyReviewExportByEmailRequestedEvent,
        ),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - user repo failure", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockImplementation(() => {
      throw new Error("FAILURE");
    });

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailRequestedEvent(
          mocks.GenericWeeklyReviewExportByEmailRequestedEvent,
        ),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - no weeklyReview", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(mocks.user);
    spyOn(Emotions.Queries.WeeklyReviewExportReadModel, "getFull").mockResolvedValue(undefined);

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailRequestedEvent(
          mocks.GenericWeeklyReviewExportByEmailRequestedEvent,
        ),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - weeklyReview failure", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(mocks.user);
    spyOn(Emotions.Queries.WeeklyReviewExportReadModel, "getFull").mockImplementation(() => {
      throw new Error("FAILURE");
    });

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailRequestedEvent(
          mocks.GenericWeeklyReviewExportByEmailRequestedEvent,
        ),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailRequestedEvent - mailer failure", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(Mailer, "send").mockImplementation(() => {
      throw new Error("FAILURE");
    });
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(mocks.user);
    spyOn(Emotions.Queries.WeeklyReviewExportReadModel, "getFull").mockResolvedValue(mocks.weeklyReviewFull);

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailRequestedEvent(
          mocks.GenericWeeklyReviewExportByEmailRequestedEvent,
        ),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailFailedEvent]);
  });

  test("onWeeklyReviewExportByEmailRequestedEvent", async () => {
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(mocks.user);
    spyOn(Emotions.Queries.WeeklyReviewExportReadModel, "getFull").mockResolvedValue(mocks.weeklyReviewFull);

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailRequestedEvent(
          mocks.GenericWeeklyReviewExportByEmailRequestedEvent,
        ),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: `Weekly Review PDF - ${mocks.week.getStart()}`,
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

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailFailedEvent(mocks.GenericWeeklyReviewExportByEmailFailedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 2nd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailFailedEvent(
          mocks.GenericWeeklyReviewExportByEmailFailedEvent2nd,
        ),
    );

    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 3rd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailFailedEvent(
          mocks.GenericWeeklyReviewExportByEmailFailedEvent3rd,
        ),
    );

    expect(eventStoreSave).toHaveBeenCalled();
  });

  test("onWeeklyReviewExportByEmailFailedEvent - 4rd", async () => {
    spyOn(Bun, "sleep").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewExportByEmail(EventBus, Mailer, PdfGenerator);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () =>
        await saga.onWeeklyReviewExportByEmailFailedEvent(
          mocks.GenericWeeklyReviewExportByEmailFailedEvent4th,
        ),
    );

    expect(eventStoreSave).not.toHaveBeenCalled();
  });
});
