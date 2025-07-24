import * as Auth from "+auth";
import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { Env } from "../infra/env";
import { EventBus } from "../infra/event-bus";
import { EventStore } from "../infra/event-store";
import { Mailer } from "../infra/mailer";
import { OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const openAiClient = new OpenAiClient();

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

    jest.restoreAllMocks();
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

    jest.restoreAllMocks();
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

    jest.restoreAllMocks();
  });

  test("onWeeklyReviewRequestedEvent", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(openAiClient, "request").mockResolvedValue(new Emotions.VO.Advice("Good job"));

    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    ]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericWeeklyReviewCompletedEvent]);

    jest.restoreAllMocks();
  });

  test("onWeeklyReviewRequestedEvent - failed", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
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
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockResolvedValue({ email: mocks.email });
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([mocks.patternDetection]);

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

    jest.restoreAllMocks();
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

    jest.restoreAllMocks();
  });

  test("onWeeklyReviewCompletedEvent - mailer failed", async () => {
    spyOn(Auth.Repos.UserRepository, "getEmailFor").mockImplementation(() => {
      throw new Error("Failed");
    });
    spyOn(Emotions.Repos.EntryRepository, "findInWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Emotions.Repos.PatternsRepository, "findInWeekForUser").mockResolvedValue([mocks.patternDetection]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const mailerSend = spyOn(Mailer, "send").mockImplementation(jest.fn());

    const weeklyReview = Emotions.Aggregates.WeeklyReview.build(mocks.weeklyReviewId, [
      mocks.GenericWeeklyReviewRequestedEvent,
    ]);
    spyOn(Emotions.Aggregates.WeeklyReview, "build").mockReturnValue(weeklyReview);

    const saga = new Emotions.Sagas.WeeklyReviewProcessing(EventBus, openAiClient);
    await bg.CorrelationStorage.run(
      mocks.correlationId,
      async () => await saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalledWith();
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);

    jest.restoreAllMocks();
  });
});
