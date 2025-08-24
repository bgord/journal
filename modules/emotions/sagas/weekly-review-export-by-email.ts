import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import type { SUPPORTED_LANGUAGES } from "+languages";

type AcceptedEvent =
  | Emotions.Events.WeeklyReviewExportByEmailRequestedEventType
  | Emotions.Events.WeeklyReviewExportByEmailFailedEventType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandler;
  EventStore: bg.EventStoreLike<AcceptedEvent>;
  Mailer: bg.MailerPort;
  PdfGenerator: Emotions.Ports.PdfGeneratorPort;
  UserContact: Auth.OHQ.UserContactOHQ;
  WeeklyReviewExport: Emotions.Queries.WeeklyReviewExport;
  UserLanguage: bg.Preferences.OHQ.UserLanguagePort<typeof SUPPORTED_LANGUAGES>;
  EMAIL_FROM: bg.EmailFromType;
};

export class WeeklyReviewExportByEmail {
  constructor(private readonly DI: Dependencies) {
    DI.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
      DI.EventHandler.handle(this.onWeeklyReviewExportByEmailRequestedEvent.bind(this)),
    );
    DI.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT,
      DI.EventHandler.handle(this.onWeeklyReviewExportByEmailFailedEvent.bind(this)),
    );
  }

  async onWeeklyReviewExportByEmailRequestedEvent(
    event: Emotions.Events.WeeklyReviewExportByEmailRequestedEventType,
  ) {
    try {
      const contact = await this.DI.UserContact.getPrimary(event.payload.userId);
      if (!contact?.address) return;

      const weeklyReview = await this.DI.WeeklyReviewExport.getFull(event.payload.weeklyReviewId);
      if (!weeklyReview) return;
      const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);

      const language = await this.DI.UserLanguage.get(event.payload.userId);

      const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(this.DI.PdfGenerator, weeklyReview);
      const attachment = await pdf.toAttachment();

      const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
      const notification = composer.compose(week, language).get();

      await this.DI.Mailer.send({
        from: this.DI.EMAIL_FROM,
        to: contact.address,
        attachments: [attachment],
        ...notification,
      });
    } catch {
      await this.DI.EventStore.save([
        Emotions.Events.WeeklyReviewExportByEmailFailedEvent.parse({
          ...bg.createEventEnvelope(`weekly_review_export_by_email_${event.payload.weeklyReviewExportId}`),
          name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT,
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

    await this.DI.EventStore.saveAfter(
      [
        Emotions.Events.WeeklyReviewExportByEmailRequestedEvent.parse({
          ...bg.createEventEnvelope(event.stream),
          name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
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
