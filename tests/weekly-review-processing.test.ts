import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { Mailer } from "../infra";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import { OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const openAiClient = new OpenAiClient();

describe("WeeklyReviewProcessing", () => {
  test("onWeeklyReviewSkippedEvent", async () => {
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Weekly Review - come back and journal",
      html: `Week you missed ${mocks.weekStartedAt}`,
    });

    jest.restoreAllMocks();
  });

  test("onWeeklyReviewRequestedEvent", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Repos.EmotionJournalEntryRepository, "findInWeek").mockResolvedValue([mocks.fullEntry]);
    spyOn(openAiClient, "request").mockResolvedValue("Good job");

    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewCompletedEvent]);

    jest.restoreAllMocks();
  });

  test("onWeeklyReviewRequestedEvent - failed", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Repos.EmotionJournalEntryRepository, "findInWeek").mockResolvedValue([mocks.fullEntry]);
    spyOn(openAiClient, "request").mockImplementation(() => {
      throw new Error("Failure");
    });

    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);

    jest.restoreAllMocks();
  });

  test("onWeeklyReviewCompletedEvent", async () => {
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    spyOn(Emotions.Repos.EmotionJournalEntryRepository, "findInWeek").mockResolvedValue([mocks.fullEntry]);

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: `Weekly Review - ${mocks.GenericWeeklyReviewCompletedEvent.payload.weekStartedAt}`,
      html: `Weekly review: ${mocks.GenericWeeklyReviewCompletedEvent.payload.weekStartedAt}`,
    });

    jest.restoreAllMocks();
  });
});
