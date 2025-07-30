import * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Ports from "+emotions/ports";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export class WeeklyReviewExportByEmail {
  constructor(
    private readonly eventBus: typeof EventBus,
    private readonly mailer: bg.MailerPort,
    private readonly pdfGenerator: Ports.PdfGeneratorPort,
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

    const weeklyReview = await Repos.WeeklyReviewRepository.getById(event.payload.weeklyReviewId);
    if (!weeklyReview) return;

    const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);

    const composer = new Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(week).get();

    const pdf = new Services.WeeklyReviewExportPdfFile(this.pdfGenerator, weeklyReview);
    const attachment = await pdf.toAttachment();

    await this.mailer.send({
      from: Env.EMAIL_FROM,
      to: contact.email,
      attachments: [attachment],
      ...notification,
    });
  }
}
