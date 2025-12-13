import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import * as mocks from "./mocks";

describe("WeeklyReviewProcessing", async () => {
  const di = await bootstrap(mocks.Env);
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const saga = new Emotions.Sagas.WeeklyReviewProcessing({
    ...di.Adapters.System,
    AiGateway: di.Adapters.AI.AiGateway,
    EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    UserContact: di.Adapters.Auth.UserContact,
    UserLanguage: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });

  test("onWeeklyReviewSkippedEvent", async () => {
    spyOn(di.Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(mocks.contact);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );
    expect(mailerSend).toHaveBeenCalledWith({
      from: di.Env.EMAIL_FROM,
      to: mocks.email,
      subject: "JOURNAL - weekly review 2024/12/23 - 2024/12/29",
      html: "Come back and journal",
    });
  });

  test("onWeeklyReviewSkippedEvent - no email", async () => {
    spyOn(di.Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(undefined);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewSkippedEvent - mailer failed", async () => {
    spyOn(di.Adapters.Auth.UserContact, "getPrimary").mockResolvedValue(undefined);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockRejectedValue(new Error("MAILER_FAILED"));

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );
    expect(mailerSend).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewRequestedEvent - en", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    const aiGatewayQuery = spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.insights);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );
    expect(aiGatewayQuery).toHaveBeenCalledWith(new AI.Prompt("Generate insights for these 1 entries."), {
      category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
      userId: mocks.userId,
      timestamp: mocks.aiRequestRegisteredTimestamp.ms,
      dimensions: {},
    });
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    ]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericWeeklyReviewCompletedEvent]);
  });

  test("onWeeklyReviewRequestedEvent - pl", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.pl);
    const aiGatewayQuery = spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.insights);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );
    expect(aiGatewayQuery).toHaveBeenCalledWith(new AI.Prompt("Podsumuj te 1 wpisów."), {
      category: AI.UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT,
      userId: mocks.userId,
      timestamp: mocks.aiRequestRegisteredTimestamp.ms,
      dimensions: {},
    });
    expect(eventStoreSave).toHaveBeenNthCalledWith(1, [
      mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent,
    ]);
    expect(eventStoreSave).toHaveBeenNthCalledWith(2, [mocks.GenericWeeklyReviewCompletedEvent]);
  });

  test("onWeeklyReviewRequestedEvent - failed", async () => {
    spyOn(di.Adapters.System.EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    spyOn(di.Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]);
    spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en);
    spyOn(di.Adapters.AI.AiGateway, "query").mockRejectedValue(new Error("Failure"));
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);
  });

  test("onWeeklyReviewCompletedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview);
    spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate() as any);
    const eventStoreSave = spyOn(di.Adapters.System.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
