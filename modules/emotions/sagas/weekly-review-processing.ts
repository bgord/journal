import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as AI from "+ai";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import type { LanguagesType } from "+languages";
import { WeeklyReviewInsightsPromptBuilder } from "../acl/ai-prompts/weekly-review-insights-prompt-builder";
import { createWeeklyReviewInsightRequestContext } from "../acl/ai-request-creator";
import { CompleteWeeklyReviewCommand } from "../commands/COMPLETE_WEEKLY_REVIEW_COMMAND";
import { DetectWeeklyPatternsCommand } from "../commands/DETECT_WEEKLY_PATTERNS_COMMAND";
import { ExportWeeklyReviewByEmailCommand } from "../commands/EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND";
import { MarkWeeklyReviewAsFailedCommand } from "../commands/MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND";
import { WEEKLY_REVIEW_COMPLETED_EVENT } from "../events/WEEKLY_REVIEW_COMPLETED_EVENT";
import { WEEKLY_REVIEW_REQUESTED_EVENT } from "../events/WEEKLY_REVIEW_REQUESTED_EVENT";
import { WEEKLY_REVIEW_SKIPPED_EVENT } from "../events/WEEKLY_REVIEW_SKIPPED_EVENT";
import { WeeklyReviewSkippedNotificationComposer } from "../services/weekly-review-skipped-notification-composer";

type AcceptedEvent =
  | Emotions.Events.WeeklyReviewSkippedEventType
  | Emotions.Events.WeeklyReviewRequestedEventType
  | Emotions.Events.WeeklyReviewCompletedEventType;

type AcceptedCommand =
  | Emotions.Commands.DetectWeeklyPatternsCommandType
  | Emotions.Commands.CompleteWeeklyReviewCommandType
  | Emotions.Commands.ExportWeeklyReviewByEmailCommandType
  | Emotions.Commands.ExportWeeklyReviewByEmailCommandType
  | Emotions.Commands.MarkWeeklyReviewAsFailedCommandType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  CommandBus: bg.CommandBusPort<AcceptedCommand>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  Logger: bg.LoggerPort;
  AiGateway: AI.AiGatewayPort;
  Mailer: bg.MailerPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<LanguagesType>;
  EMAIL_FROM: tools.EmailType;
};

export class WeeklyReviewProcessing {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      WEEKLY_REVIEW_SKIPPED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewSkippedEvent.bind(this)),
    );
    deps.EventBus.on(
      WEEKLY_REVIEW_REQUESTED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewRequestedEvent.bind(this)),
    );
    deps.EventBus.on(
      WEEKLY_REVIEW_COMPLETED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewCompletedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onWeeklyReviewSkippedEvent(event: Emotions.Events.WeeklyReviewSkippedEventType) {
    const contact = await this.deps.UserContactOHQ.getPrimary(event.payload.userId);

    if (!contact?.address) return;

    const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);

    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const composer = new WeeklyReviewSkippedNotificationComposer();

    const config = { to: contact.address, from: this.deps.EMAIL_FROM };
    const notification = composer.compose(week, language);

    try {
      await this.deps.Mailer.send(new bg.MailerTemplate(config, notification));
    } catch (error) {
      this.deps.Logger.error({
        message: "Mailer failure",
        component: "emotions",
        operation: "weekly_review_processing_on_weekly_review_skipped_event",
        error,
        correlationId: event.correlationId,
        metadata: event.payload,
      });
    }
  }

  async onWeeklyReviewRequestedEvent(event: Emotions.Events.WeeklyReviewRequestedEventType) {
    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const entries = await this.deps.EntrySnapshot.getByWeekForUser(week, event.payload.userId);

    const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);
    const prompt = new WeeklyReviewInsightsPromptBuilder(entries, language).generate();

    try {
      const insights = await this.deps.AiGateway.query(
        prompt,
        createWeeklyReviewInsightRequestContext(this.deps, event.payload.userId),
      );

      const detectWeeklyPatterns = bg.command(
        DetectWeeklyPatternsCommand,
        { payload: { userId: event.payload.userId, week } },
        this.deps,
      );

      await this.deps.CommandBus.emit(detectWeeklyPatterns);

      const completeWeeklyReview = bg.command(
        CompleteWeeklyReviewCommand,
        { payload: { weeklyReviewId: event.payload.weeklyReviewId, insights, userId: event.payload.userId } },
        this.deps,
      );

      await this.deps.CommandBus.emit(completeWeeklyReview);
    } catch (_error) {
      const command = bg.command(
        MarkWeeklyReviewAsFailedCommand,
        { payload: { weeklyReviewId: event.payload.weeklyReviewId, userId: event.payload.userId } },
        this.deps,
      );

      await this.deps.CommandBus.emit(command);
    }
  }

  async onWeeklyReviewCompletedEvent(event: Emotions.Events.WeeklyReviewCompletedEventType) {
    const command = bg.command(
      ExportWeeklyReviewByEmailCommand,
      { payload: { userId: event.payload.userId, weeklyReviewId: event.payload.weeklyReviewId } },
      this.deps,
    );

    await this.deps.CommandBus.emit(command);
  }
}
