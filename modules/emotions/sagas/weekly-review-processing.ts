import type { EventBus } from "../../../infra/event-bus";
import { Mailer } from "../../../infra/mailer";
import * as Events from "../events";
import * as Services from "../services";
import * as VO from "../value-objects";

export class WeeklyReviewProcessing {
  constructor(private readonly eventBus: typeof EventBus) {}

  register() {
    this.eventBus.on(Events.WEEKLY_REVIEW_SKIPPED_EVENT, this.onWeeklyReviewSkippedEvent.bind(this));
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

  async onWeeklyReviewRequestedEvent(_event: Events.WeeklyReviewRequestedEventType) {}
}
