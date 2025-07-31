import * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Ports from "+emotions/ports";
import * as Repos from "+emotions/repositories";
import * as Services from "+emotions/services";
import { Env } from "+infra/env";
import type { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
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
    this.eventBus.on(
      Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT,
      this.onWeeklyReviewExportByEmailFailedEvent.bind(this),
    );
  }

  async onWeeklyReviewExportByEmailRequestedEvent(event: Events.WeeklyReviewExportByEmailRequestedEventType) {
    try {
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
    } catch (error) {
      await EventStore.save([
        Events.WeeklyReviewExportByEmailFailedEvent.parse({
          id: crypto.randomUUID(),
          correlationId: bg.CorrelationStorage.get(),
          createdAt: tools.Timestamp.parse(Date.now()),
          name: Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT,
          stream: `weekly_review_export_by_email_${event.payload.weeklyReviewExportId}`,
          version: 1,
          payload: {
            weeklyReviewId: event.payload.weeklyReviewId,
            userId: event.payload.userId,
            weeklyReviewExportId: event.payload.weeklyReviewExportId,
            attempt: event.payload.attempt,
          },
        } satisfies Events.WeeklyReviewExportByEmailFailedEventType),
      ]);
    }
  }

  async onWeeklyReviewExportByEmailFailedEvent(event: Events.WeeklyReviewExportByEmailFailedEventType) {
    if (event.payload.attempt > 3) return;

    // TODO: after a timeout
    await EventStore.save([
      Events.WeeklyReviewExportByEmailRequestedEvent.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
        stream: event.stream,
        version: 1,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
          weeklyReviewExportId: event.payload.weeklyReviewExportId,
          attempt: event.payload.attempt + 1,
        },
      } satisfies Events.WeeklyReviewExportByEmailRequestedEventType),
    ]);
  }
}
