import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { Env } from "../infra/env";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import { Mailer } from "../infra/mailer";
import { PdfGenerator } from "../infra/pdf-generator";
import * as Emotions from "../modules/emotions";
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

  test("onWeeklyReviewExportByEmailRequestedEvent - no weeklyReview", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(mocks.user);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(undefined);

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

  test("onWeeklyReviewExportByEmailRequestedEvent", async () => {
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());
    spyOn(EventStore, "save").mockImplementation(jest.fn());
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(mocks.user);
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);

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
});
