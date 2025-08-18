import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import type { EventBus } from "+infra/event-bus";
import type { EventStore as EventStoreType } from "+infra/event-store";

export class WeeklyReviewExportByEmail {
  constructor(
    eventBus: typeof EventBus,
    EventHandler: bg.EventHandler,
    private readonly EventStore: typeof EventStoreType,
    private readonly mailer: bg.MailerPort,
    private readonly pdfGenerator: Emotions.Ports.PdfGeneratorPort,
    private readonly userContact: Auth.OHQ.UserContactOHQ,
    private readonly weeklyReviewExport: Emotions.Queries.WeeklyReviewExport,
    private readonly EMAIL_FROM: bg.EmailFromType,
  ) {
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
      EventHandler.handle(this.onWeeklyReviewExportByEmailRequestedEvent.bind(this)),
    );
    eventBus.on(
      Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT,
      EventHandler.handle(this.onWeeklyReviewExportByEmailFailedEvent.bind(this)),
    );
  }

  async onWeeklyReviewExportByEmailRequestedEvent(
    event: Emotions.Events.WeeklyReviewExportByEmailRequestedEventType,
  ) {
    try {
      const contact = await this.userContact.getPrimary(event.payload.userId);
      if (!contact?.address) return;

      const weeklyReview = await this.weeklyReviewExport.getFull(event.payload.weeklyReviewId);
      if (!weeklyReview) return;

      const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(this.pdfGenerator, weeklyReview);
      const attachment = await pdf.toAttachment();

      const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
      const notification = composer.compose(weeklyReview).get();

      await this.mailer.send({
        from: this.EMAIL_FROM,
        to: contact.address,
        attachments: [attachment],
        ...notification,
      });
    } catch {
      await this.EventStore.save([
        Emotions.Events.WeeklyReviewExportByEmailFailedEvent.parse({
          id: crypto.randomUUID(),
          correlationId: bg.CorrelationStorage.get(),
          createdAt: tools.Time.Now().value,
          name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT,
          stream: `weekly_review_export_by_email_${event.payload.weeklyReviewExportId}`,
          version: 1,
          payload: {
            weeklyReviewId: event.payload.weeklyReviewId,
            userId: event.payload.userId,
            weeklyReviewExportId: event.payload.weeklyReviewExportId,
            attempt: event.payload.attempt,
          },
        } satisfies Emotions.Events.WeeklyReviewExportByEmailFailedEventType),
      ]);
    }
  }

  async onWeeklyReviewExportByEmailFailedEvent(
    event: Emotions.Events.WeeklyReviewExportByEmailFailedEventType,
  ) {
    if (event.payload.attempt > 3) return;

    await this.EventStore.saveAfter(
      [
        Emotions.Events.WeeklyReviewExportByEmailRequestedEvent.parse({
          id: crypto.randomUUID(),
          correlationId: bg.CorrelationStorage.get(),
          createdAt: tools.Time.Now().value,
          name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
          stream: event.stream,
          version: 1,
          payload: {
            weeklyReviewId: event.payload.weeklyReviewId,
            userId: event.payload.userId,
            weeklyReviewExportId: event.payload.weeklyReviewExportId,
            attempt: event.payload.attempt + 1,
          },
        } satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType),
      ],
      tools.Time.Minutes(1),
    );
  }
}
