import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as Adapters from "+infra/adapters";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

const EventHandler = new bg.EventHandler(Adapters.Logger);

const saga = new Emotions.Sagas.WeeklyReviewProcessing({
  EventBus,
  EventHandler,
  CommandBus,
  AiGateway: Adapters.AI.AiGateway,
  Mailer: Adapters.Mailer,
  EntrySnapshot: Adapters.Emotions.EntrySnapshot,
  UserContact: Adapters.Auth.UserContact,
  UserLanguage: Adapters.Preferences.UserLanguage,
  IdProvider: Adapters.IdProvider,
  Clock: Adapters.Clock,
  EMAIL_FROM: Env.EMAIL_FROM,
});

describe("WeeklyReviewProcessing", () => {
  test("onWeeklyReviewSkippedEvent", async () => {
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue({ type: "email", address: mocks.email });
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );
    expect(mailerSend).toHaveBeenCalledWith({
      from: Env.EMAIL_FROM,
      to: mocks.email,
      subject: "Weekly Review - come back and journal",
      html: `Week you missed ${mocks.previousWeek.getStart()}`,
    });
  });

  test("onWeeklyReviewSkippedEvent - no email", async () => {
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(undefined);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewSkippedEvent - mailer failed", async () => {
    spyOn(Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(undefined);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(Adapters.Mailer, "send").mockRejectedValue(new Error("MAILER_FAILED"));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewRequestedEvent - en", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    const aiGatewayQuery = spyOn(Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.insights);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );
    expect(aiGatewayQuery).toHaveBeenCalledWith(new AI.Prompt("Generate insights for these 1 entries."), {
      category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
      userId: mocks.userId,
      timestamp: mocks.aiRequestRegisteredTimestamp,
      dimensions: {},
    });
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    ]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericWeeklyReviewCompletedEvent]);
  });

  test("onWeeklyReviewRequestedEvent - pl", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.pl);
    const aiGatewayQuery = spyOn(Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.insights);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );
    expect(aiGatewayQuery).toHaveBeenCalledWith(new AI.Prompt("Podsumuj te 1 wpisów."), {
      category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
      userId: mocks.userId,
      timestamp: mocks.aiRequestRegisteredTimestamp,
      dimensions: {},
    });
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    ]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericWeeklyReviewCompletedEvent]);
  });

  test("onWeeklyReviewRequestedEvent - failed", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(Adapters.Preferences.UserLanguage, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(Adapters.AI.AiGateway, "query").mockRejectedValue(new Error("Failure"));
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);
  });

  test("onWeeklyReviewCompletedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    spyOn(Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(Adapters.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
