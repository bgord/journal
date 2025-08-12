import * as AI from "+ai";
import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { AiClient } from "../infra/ai-client";
import { AiGateway } from "../infra/ai-gateway";
import { Env } from "../infra/env";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import { Mailer } from "../infra/mailer";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewProcessing", () => {
  test("onWeeklyReviewSkippedEvent", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Weekly Review - come back and journal",
      html: `Week you missed ${mocks.week.getStart()}`,
    });
  });

  test("onWeeklyReviewSkippedEvent - no email", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(undefined);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewSkippedEvent - mailer failed", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(undefined);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(() => {
      throw new Error("MAILER_FAILED");
    });

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewRequestedEvent - en", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    const openAiClientRequest = spyOn(AiClient, "request").mockResolvedValue(new AI.Advice("Good job"));
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(openAiClientRequest).toHaveBeenCalledWith(new AI.Prompt("Generate insights for these 1 entries."));
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    ]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericWeeklyReviewCompletedEvent]);
  });

  test("onWeeklyReviewRequestedEvent - pl", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntryPl]);
    const openAiClientRequest = spyOn(AiClient, "request").mockResolvedValue(new AI.Advice("Good job"));
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(openAiClientRequest).toHaveBeenCalledWith(new AI.Prompt("Podsumuj te 1 wpisów."));
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    ]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericWeeklyReviewCompletedEvent]);
  });

  test("onWeeklyReviewRequestedEvent - failed", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(AiClient, "request").mockImplementation(() => {
      throw new Error("Failure");
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);
  });

  test("onWeeklyReviewCompletedEvent", async () => {
    spyOn(Emotions.Repos.WeeklyReviewRepository, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(crypto, "randomUUID").mockReturnValue(mocks.weeklyReviewExportId);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, AiGateway, Mailer);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
