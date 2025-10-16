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
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  Mailer: bg.MailerPort;
  PdfGenerator: bg.PdfGeneratorPort;
  UserContact: Auth.OHQ.UserContactOHQ;
  WeeklyReviewExport: Emotions.Queries.WeeklyReviewExport;
  UserLanguage: bg.Preferences.OHQ.UserLanguagePort<typeof SUPPORTED_LANGUAGES>;
  EMAIL_FROM: bg.EmailFromType;
};

export class WeeklyReviewExportByEmail {
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewExportByEmailRequestedEvent.bind(this)),
    );
    deps.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_FAILED_EVENT,
      deps.EventHandler.handle(this.onWeeklyReviewExportByEmailFailedEvent.bind(this)),
    );
  }

  async onWeeklyReviewExportByEmailRequestedEvent(
    event: Emotions.Events.WeeklyReviewExportByEmailRequestedEventType,
  ) {
    try {
      const contact = await this.deps.UserContact.getPrimary(event.payload.userId);
      if (!contact?.address) return;

      const weeklyReview = await this.deps.WeeklyReviewExport.getFull(event.payload.weeklyReviewId);
      if (!weeklyReview) return;
      const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);

      const language = await this.deps.UserLanguage.get(event.payload.userId);

      const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(this.deps.PdfGenerator, weeklyReview);
      const attachment = await pdf.toAttachment();

      const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
      const notification = composer.compose(week, language).get();

      await this.deps.Mailer.send({
        from: this.deps.EMAIL_FROM,
        to: contact.address,
        // @ts-ignore
        attachments: [attachment],
        ...notification,
      });
    } catch {
      await this.deps.EventStore.save([
        Emotions.Events.WeeklyReviewExportByEmailFailedEvent.parse({
          ...bg.createEventEnvelope(
            `weekly_review_export_by_email_${event.payload.weeklyReviewExportId}`,
            this.deps,
          ),
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

    await this.deps.EventStore.saveAfter(
      [
        Emotions.Events.WeeklyReviewExportByEmailRequestedEvent.parse({
          ...bg.createEventEnvelope(event.stream, this.deps),
          name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
          payload: {
            weeklyReviewId: event.payload.weeklyReviewId,
            userId: event.payload.userId,
            weeklyReviewExportId: event.payload.weeklyReviewExportId,
            attempt: event.payload.attempt + 1,
          },
        } satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType),
      ],
      tools.Duration.Minutes(1),
    );
  }
}
