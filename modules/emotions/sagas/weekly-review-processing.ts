import * as AI from "+ai";
import * as Auth from "+auth";
import * as ACL from "+emotions/acl";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import { SupportedLanguages } from "+infra/i18n";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class WeeklyReviewProcessing {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly AiGateway: AI.AiGatewayPort,
    private readonly mailer: bg.MailerPort,
  ) {
    this.eventBus.on(Events.WEEKLY_REVIEW_SKIPPED_EVENT, this.onWeeklyReviewSkippedEvent.bind(this));
    this.eventBus.on(Events.WEEKLY_REVIEW_REQUESTED_EVENT, this.onWeeklyReviewRequestedEvent.bind(this));
    this.eventBus.on(Events.WEEKLY_REVIEW_COMPLETED_EVENT, this.onWeeklyReviewCompletedEvent.bind(this));
  }

  async onWeeklyReviewSkippedEvent(event: Events.WeeklyReviewSkippedEventType) {
    const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);

    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const composer = new Services.WeeklyReviewSkippedNotificationComposer();

    const notification = composer.compose(week);

    if (!contact?.email) return;

    try {
      await this.mailer.send({ from: Env.EMAIL_FROM, to: contact?.email, ...notification.get() });
    } catch (error) {}
  }

  async onWeeklyReviewRequestedEvent(event: Events.WeeklyReviewRequestedEventType) {
    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const entries = await Repos.EntryRepository.findInWeekForUser(week, event.payload.userId);

    const language = entries.at(-1)?.language as SupportedLanguages;
    const prompt = new Services.WeeklyReviewInsightsPromptBuilder(entries, language).generate();

    try {
      const insights = await this.AiGateway.query(
        prompt,
        ACL.createWeeklyReviewInsightRequestContext(event.payload.userId),
      );

      const detectWeeklyPatterns = Commands.DetectWeeklyPatternsCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.DETECT_WEEKLY_PATTERNS_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: { userId: event.payload.userId, week },
      } satisfies Commands.DetectWeeklyPatternsCommandType);

      await CommandBus.emit(detectWeeklyPatterns.name, detectWeeklyPatterns);

      const completeWeeklyReview = Commands.CompleteWeeklyReviewCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.COMPLETE_WEEKLY_REVIEW_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          insights,
          userId: event.payload.userId,
        },
      } satisfies Commands.CompleteWeeklyReviewCommandType);

      await CommandBus.emit(completeWeeklyReview.name, completeWeeklyReview);
    } catch (_error) {
      const command = Commands.MarkWeeklyReviewAsFailedCommand.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
        createdAt: tools.Time.Now().value,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
        },
      } satisfies Commands.MarkWeeklyReviewAsFailedCommandType);

      await CommandBus.emit(command.name, command);
    }
  }

  async onWeeklyReviewCompletedEvent(event: Events.WeeklyReviewCompletedEventType) {
    const command = Commands.ExportWeeklyReviewByEmailCommand.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      name: Commands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
      createdAt: tools.Time.Now().value,
      payload: { userId: event.payload.userId, weeklyReviewId: event.payload.weeklyReviewId },
    } satisfies Commands.ExportWeeklyReviewByEmailCommand);

    await CommandBus.emit(command.name, command);
  }
}
