import * as Commands from "+emotions/commands";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import * as VO from "+emotions/value-objects";
import { CommandBus } from "+infra/command-bus";
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
    const weekStart = VO.WeekStart.fromTimestamp(event.payload.weekStartedAt);
    const composer = new Services.WeeklyReviewSkippedNotificationComposer();

    const notification = composer.compose(weekStart);

    await Mailer.send({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: "Weekly Review - come back and journal",
      html: notification,
    });
  }

  async onWeeklyReviewRequestedEvent(event: Events.WeeklyReviewRequestedEventType) {
    const entries = await Repos.EmotionJournalEntryRepository.findInWeek(event.payload.weekStartedAt);

    const prompt = new Services.WeeklyReviewInsightsPrompt(entries).generate();

    try {
      const insights = await this.AiClient.request(prompt);

      const command = Commands.CompleteWeeklyReviewCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.COMPLETE_WEEKLY_REVIEW_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          insights: new VO.EmotionalAdvice(insights),
        },
      } satisfies Commands.CompleteWeeklyReviewCommandType);

      await CommandBus.emit(command.name, command);
    } catch (_error) {
      const command = Commands.MarkWeeklyReviewAsFailedCommand.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        name: Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
        createdAt: tools.Timestamp.parse(Date.now()),
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
        },
      } satisfies Commands.MarkWeeklyReviewAsFailedCommandType);

      await CommandBus.emit(command.name, command);
    }
  }

  async onWeeklyReviewCompletedEvent(event: Events.WeeklyReviewCompletedEventType) {
    const entries = await Repos.EmotionJournalEntryRepository.findInWeek(event.payload.weekStartedAt);
    const insights = new VO.EmotionalAdvice(event.payload.insights);
    const weekStart = VO.WeekStart.fromTimestamp(event.payload.weekStartedAt);

    const composer = new Services.WeeklyReviewNotificationComposer();

    const notification = composer.compose(weekStart, entries, insights);

    await Mailer.send({
      from: "journal@example.com",
      to: "example@abc.com",
      subject: `Weekly Review - ${weekStart.get()}`,
      html: notification,
    });
  }
}
