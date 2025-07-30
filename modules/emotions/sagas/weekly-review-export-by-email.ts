import * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Repos from "+emotions/repositories";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import * as bg from "@bgord/bun";

export class WeeklyReviewExportByEmail {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly mailer: bg.MailerPort,
  ) {}

  register() {
    this.eventBus.on(
      Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
      this.onWeeklyReviewExportByEmailRequestedEvent.bind(this),
    );
  }

  async onWeeklyReviewExportByEmailRequestedEvent(event: Events.WeeklyReviewExportByEmailRequestedEventType) {
    const contact = await Auth.Repos.UserRepository.getEmailFor(event.payload.userId);
    if (!contact?.email) return;

    const weeklyReview = await Repos.AlarmRepository.getById(event.payload.userId);
    if (!weeklyReview) return;

    await this.mailer.send({ from: Env.EMAIL_FROM, to: contact.email });
  }
}
