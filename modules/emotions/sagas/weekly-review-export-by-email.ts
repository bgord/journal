import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import type { LanguagesType } from "+languages";
import * as wip from "+infra/build";

type AcceptedEvent =
  | Emotions.Events.WeeklyReviewExportByEmailRequestedEventType
  | Emotions.Events.WeeklyReviewExportByEmailFailedEventType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  Mailer: bg.MailerPort;
  PdfGenerator: bg.PdfGeneratorPort;
  Sleeper: bg.SleeperPort;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  WeeklyReviewExportQuery: Emotions.Queries.WeeklyReviewExport;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<LanguagesType>;
  RetryBackoffStrategy: bg.RetryBackoffStrategy;
  EMAIL_FROM: tools.EmailType;
};

export class WeeklyReviewExportByEmail {
  // Stryker disable all
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
  // Stryker restore all

  async onWeeklyReviewExportByEmailRequestedEvent(
    event: Emotions.Events.WeeklyReviewExportByEmailRequestedEventType,
  ) {
    try {
      const contact = await this.deps.UserContactOHQ.getPrimary(event.payload.userId);
      if (!contact?.address) return;

      const weeklyReview = await this.deps.WeeklyReviewExportQuery.getFull(event.payload.weeklyReviewId);
      if (!weeklyReview) return;
      const week = tools.Week.fromIsoId(weeklyReview.weekIsoId);

      const language = await this.deps.UserLanguageOHQ.get(event.payload.userId);

      const pdf = new Emotions.Services.WeeklyReviewExportPdfFile(weeklyReview, this.deps);
      const attachment = await pdf.toAttachment();

      const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();

      const config = { to: contact.address, from: this.deps.EMAIL_FROM };
      const message = composer.compose(week, language);

      await this.deps.Mailer.send(new bg.MailerTemplate(config, message, [attachment]));
    } catch {
      await this.deps.EventStore.save([
        wip.event(
          Emotions.Events.WeeklyReviewExportByEmailFailedEvent,
          `weekly_review_export_by_email_${event.payload.weeklyReviewExportId}`,
          {
            weeklyReviewId: event.payload.weeklyReviewId,
            userId: event.payload.userId,
            weeklyReviewExportId: event.payload.weeklyReviewExportId,
            attempt: event.payload.attempt,
          },
          this.deps,
        ),
      ]);
    }
  }

  async onWeeklyReviewExportByEmailFailedEvent(
    event: Emotions.Events.WeeklyReviewExportByEmailFailedEventType,
  ) {
    if (event.payload.attempt > 3) return;

    await this.deps.Sleeper.wait(this.deps.RetryBackoffStrategy.next(event.payload.attempt));
    await this.deps.EventStore.save([
      wip.event(
        Emotions.Events.WeeklyReviewExportByEmailRequestedEvent,
        event.stream,
        {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
          weeklyReviewExportId: event.payload.weeklyReviewExportId,
          attempt: tools.Int.positive(event.payload.attempt + 1),
        },
        this.deps,
      ),
    ]);
  }
}
