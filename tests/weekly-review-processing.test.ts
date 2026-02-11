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
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);

  const saga = new Emotions.Sagas.WeeklyReviewProcessing({
    ...di.Adapters.System,
    ...di.Tools,
    AiGateway: di.Adapters.AI.AiGateway,
    EntrySnapshot: di.Adapters.Emotions.EntrySnapshot,
    UserContactOHQ: di.Adapters.Auth.UserContactOHQ,
    UserLanguageOHQ: di.Adapters.Preferences.UserLanguageOHQ,
    EMAIL_FROM: di.Env.EMAIL_FROM,
  });

  const config = { from: di.Env.EMAIL_FROM, to: mocks.email };

  test("onWeeklyReviewSkippedEvent", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(mailerSend).toHaveBeenCalledWith({
      config,
      message: {
        subject: "JOURNAL - weekly review 2024/12/23 - 2024/12/29",
        html: "Come back and journal",
      },
    });
  });

  test("onWeeklyReviewSkippedEvent - no email", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(undefined));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using loggerError = spyOn(di.Adapters.System.Logger, "error");
    using mailerSend = spyOn(di.Adapters.System.Mailer, "send").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(mailerSend).not.toHaveBeenCalled();
    expect(loggerError).not.toHaveBeenCalled();
  });

  test("onWeeklyReviewSkippedEvent - mailer failed", async () => {
    using spies = new DisposableStack();
    spies.use(spyOn(di.Adapters.Auth.UserContactOHQ, "getPrimary").mockResolvedValue(mocks.contact));
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    spies.use(spyOn(di.Adapters.System.Mailer, "send").mockImplementation(mocks.throwIntentionalErrorAsync));
    using loggerError = spyOn(di.Adapters.System.Logger, "error");

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewSkippedEvent(mocks.GenericWeeklyReviewSkippedEvent),
    );

    expect(loggerError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Mailer failure",
        component: "emotions",
        operation: "weekly_review_processing_on_weekly_review_skipped_event",
        correlationId: mocks.GenericWeeklyReviewSkippedEvent.correlationId,
        metadata: mocks.GenericWeeklyReviewSkippedEvent.payload,
      }),
    );
  });

  test("onWeeklyReviewRequestedEvent - en", async () => {
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]),
    );
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]),
    );
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    using aiGatewayQuery = spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.insights);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

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
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]),
    );
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]),
    );
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.pl));
    using aiGatewayQuery = spyOn(di.Adapters.AI.AiGateway, "query").mockResolvedValue(mocks.insights);
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

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
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Tools.EventStore, "find").mockResolvedValue([mocks.GenericWeeklyReviewRequestedEvent]),
    );
    spies.use(spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision));
    spies.use(
      spyOn(di.Adapters.Emotions.EntrySnapshot, "getByWeekForUser").mockResolvedValue([mocks.fullEntry]),
    );
    spies.use(spyOn(di.Adapters.Preferences.UserLanguageOHQ, "get").mockResolvedValue(SupportedLanguages.en));
    spies.use(spyOn(di.Adapters.AI.AiGateway, "query").mockImplementation(mocks.throwIntentionalErrorAsync));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewRequestedEvent(mocks.GenericWeeklyReviewRequestedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewFailedEvent]);
  });

  test("onWeeklyReviewCompletedEvent", async () => {
    const ids = new bg.IdProviderDeterministicAdapter([mocks.weeklyReviewExportId]);
    using spies = new DisposableStack();
    spies.use(
      spyOn(di.Adapters.Emotions.WeeklyReviewSnapshot, "getById").mockResolvedValue(mocks.weeklyReview),
    );
    spies.use(spyOn(di.Adapters.System.IdProvider, "generate").mockReturnValue(ids.generate()));
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      saga.onWeeklyReviewCompletedEvent(mocks.GenericWeeklyReviewCompletedEvent),
    );

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericWeeklyReviewExportByEmailRequestedEvent]);
  });
});
