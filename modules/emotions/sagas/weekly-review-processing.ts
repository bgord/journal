import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as AI from "+ai";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import { SupportedLanguages } from "+infra/i18n";

export class WeeklyReviewProcessing {
  constructor(
    eventBus: typeof EventBus,
    EventHandler: bg.EventHandler,
    private readonly AiGateway: AI.AiGatewayPort,
    private readonly mailer: bg.MailerPort,
    private readonly entrySnapshot: Emotions.Ports.EntrySnapshotPort,
    private readonly userContact: Auth.Ports.UserContactPort,
  ) {
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
      EventHandler.handle(this.onWeeklyReviewSkippedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      EventHandler.handle(this.onWeeklyReviewRequestedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_COMPLETED_EVENT,
      EventHandler.handle(this.onWeeklyReviewCompletedEvent.bind(this)),
    );
  }

  async onWeeklyReviewSkippedEvent(event: Emotions.Events.WeeklyReviewSkippedEventType) {
    const contact = await this.userContact.getPrimaryEmail(event.payload.userId);

    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();

    const notification = composer.compose(week);

    if (!contact?.email) return;

    try {
      await this.mailer.send({ from: Env.EMAIL_FROM, to: contact?.email, ...notification.get() });
    } catch {}
  }

  async onWeeklyReviewRequestedEvent(event: Emotions.Events.WeeklyReviewRequestedEventType) {
    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const entries = await this.entrySnapshot.getByWeekForUser(week, event.payload.userId);

    const language = entries.at(-1)?.language as SupportedLanguages;
    const prompt = new Emotions.ACL.AiPrompts.WeeklyReviewInsightsPromptBuilder(entries, language).generate();

    try {
      const insights = await this.AiGateway.query(
        prompt,
        Emotions.ACL.createWeeklyReviewInsightRequestContext(event.payload.userId),
      );

      const detectWeeklyPatterns = Emotions.Commands.DetectWeeklyPatternsCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Emotions.Commands.DETECT_WEEKLY_PATTERNS_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { userId: event.payload.userId, week },
      } satisfies Emotions.Commands.DetectWeeklyPatternsCommandType);

      await CommandBus.emit(detectWeeklyPatterns.name, detectWeeklyPatterns);

      const completeWeeklyReview = Emotions.Commands.CompleteWeeklyReviewCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Emotions.Commands.COMPLETE_WEEKLY_REVIEW_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          insights,
          userId: event.payload.userId,
        },
      } satisfies Emotions.Commands.CompleteWeeklyReviewCommandType);

      await CommandBus.emit(completeWeeklyReview.name, completeWeeklyReview);
    } catch (_error) {
      const command = Emotions.Commands.MarkWeeklyReviewAsFailedCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Emotions.Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
        },
      } satisfies Emotions.Commands.MarkWeeklyReviewAsFailedCommandType);

      await CommandBus.emit(command.name, command);
    }
  }

  async onWeeklyReviewCompletedEvent(event: Emotions.Events.WeeklyReviewCompletedEventType) {
    const command = Emotions.Commands.ExportWeeklyReviewByEmailCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Emotions.Commands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
      createdAt: tools.Time.Now().value,
      payload: { userId: event.payload.userId, weeklyReviewId: event.payload.weeklyReviewId },
    } satisfies Emotions.Commands.ExportWeeklyReviewByEmailCommand);

    await CommandBus.emit(command.name, command);
  }
}
