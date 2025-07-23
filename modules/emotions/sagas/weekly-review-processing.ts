import * as Auth from "+auth";
import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import { Mailer } from "+infra/mailer";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class WeeklyReviewProcessing {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly AiClient: Services.AiClient,
  ) {}

  register() {
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
      await Mailer.send({ from: Env.EMAIL_FROM, to: contact?.email, ...notification.get() });
    } catch (error) {}
  }

  async onWeeklyReviewRequestedEvent(event: Events.WeeklyReviewRequestedEventType) {
    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const entries = await Repos.EntryRepository.findInWeek(week);

    const prompt = new Services.WeeklyReviewInsightsPromptBuilder(entries).generate();

    try {
      const insights = await this.AiClient.request(prompt);

      const detectWeeklyPatterns = Commands.DetectWeeklyPatternsCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.DETECT_WEEKLY_PATTERNS_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: { userId: event.payload.userId, week },
      } satisfies Commands.DetectWeeklyPatternsCommandType);

      await CommandBus.emit(detectWeeklyPatterns.name, detectWeeklyPatterns);

      const completeWeeklyReview = Commands.CompleteWeeklyReviewCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.COMPLETE_WEEKLY_REVIEW_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          insights,
          userId: event.payload.userId,
        },
      } satisfies Commands.CompleteWeeklyReviewCommandType);

      await CommandBus.emit(completeWeeklyReview.name, completeWeeklyReview);
    } catch (_error) {
      const command = Commands.MarkWeeklyReviewAsFailedCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
        },
      } satisfies Commands.MarkWeeklyReviewAsFailedCommandType);

      await CommandBus.emit(command.name, command);
    }
  }

  async onWeeklyReviewCompletedEvent(event: Events.WeeklyReviewCompletedEventType) {
    try {
      const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);

      if (!contact?.email) return;

      const week = tools.Week.fromIsoId(event.payload.weekIsoId);
      const entries = await Repos.EntryRepository.findInWeek(week);

      const insights = new VO.Advice(event.payload.insights);

      const composer = new Services.WeeklyReviewNotificationComposer();

      const notification = composer.compose(week, entries, insights);

      await Mailer.send({ from: Env.EMAIL_FROM, to: contact.email, ...notification.get() });
    } catch (error) {
      const command = Commands.MarkWeeklyReviewAsFailedCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
        },
      } satisfies Commands.MarkWeeklyReviewAsFailedCommandType);

      await CommandBus.emit(command.name, command);
    }
  }
}
