import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "../infra/env";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import { Mailer } from "../infra/mailer";
import { OpenAiAdapter } from "../infra/open-ai-adapter";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const openAiClient = new OpenAiAdapter();

describe("WeeklyReviewProcessing", () => {
  test("onWeeklyReviewSkippedEvent", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
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

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
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

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
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
    const openAiClientRequest = spyOn(openAiClient, "request").mockResolvedValue(
      new Emotions.VO.Advice("Good job"),
    );
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(openAiClientRequest).toHaveBeenCalledWith(
      new Emotions.VO.Prompt("Generate insights for these 1 entries."),
    );
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
    const openAiClientRequest = spyOn(openAiClient, "request").mockResolvedValue(
      new Emotions.VO.Advice("Good job"),
    );
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(openAiClientRequest).toHaveBeenCalledWith(new Emotions.VO.Prompt("Podsumuj te 1 wpisów."));
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
    spyOn(openAiClient, "request").mockImplementation(() => {
      throw new Error("Failure");
    });
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);
  });

  test("onWeeklyReviewCompletedEvent", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([mocks.patternDetection]);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    const week = tools.Week.fromIsoId(mocks.GenericWeeklyReviewCompletedEvent.payload.weekIsoId);

    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: `Weekly Review - ${week.getStart()}`,
      html: `Weekly review: ${week.getStart()}`,
    });
  });

  test("onWeeklyReviewCompletedEvent - contact missing", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue(undefined);
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([mocks.patternDetection]);
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalledWith();
  });

  test("onWeeklyReviewCompletedEvent - mailer failed", async () => {
    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockImplementation(() => {
      throw new Error("Failed");
    });
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([mocks.patternDetection]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalledWith();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);
  });
});
