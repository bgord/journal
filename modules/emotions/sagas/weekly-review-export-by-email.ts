import * as Auth from "+auth";
import * as Events from "+emotions/events";
import type { EventBus } from "+infra/event-bus";

export class WeeklyReviewExportByEmail {
  constructor(private readonly eventBus: typeof EventBus) {}

  register() {
    this.eventBus.on(
      Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
      this.onWeeklyReviewExportByEmailRequestedEvent.bind(this),
    );
  }

  async onWeeklyReviewExportByEmailRequestedEvent(event: Events.WeeklyReviewExportByEmailRequestedEventType) {
    const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);

    if (!contact?.email) return;
  }
}
