import * as Events from "+emotions/events";
// import * as Ports from "+emotions/ports";
import type { EventBus } from "+infra/event-bus";
// import * as bg from "@bgord/bun";

export class WeeklyReviewExportByEmail {
  constructor(
    private readonly eventBus: typeof EventBus,
    // private readonly mailer: bg.MailerPort,
    // private readonly pdfGenerator: Ports.PdfGeneratorPort,
  ) {}

  register() {
    this.eventBus.on(
      Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
      this.onWeeklyReviewExportByEmailRequestedEvent.bind(this),
    );
  }

  async onWeeklyReviewExportByEmailRequestedEvent(
    _event: Events.WeeklyReviewExportByEmailRequestedEventType,
  ) {}
}
