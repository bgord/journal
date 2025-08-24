import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as AI from "+ai";
import type * as Auth from "+auth";
import * as Emotions from "+emotions";
import type { SUPPORTED_LANGUAGES } from "+languages";

type AcceptedEvent =
  | Emotions.Events.WeeklyReviewSkippedEventType
  | Emotions.Events.WeeklyReviewRequestedEventType
  | Emotions.Events.WeeklyReviewCompletedEventType;

type AcceptedCommand =
  | Emotions.Commands.DetectWeeklyPatternsCommandType
  | Emotions.Commands.CompleteWeeklyReviewCommandType
  | Emotions.Commands.ExportWeeklyReviewByEmailCommandType
  | Emotions.Commands.ExportWeeklyReviewByEmailCommandType
  | Emotions.Commands.MarkWeeklyReviewAsFailedCommandType;

type Dependencies = {
  EventBus: bg.EventBusLike<AcceptedEvent>;
  EventHandler: bg.EventHandler;
  CommandBus: bg.CommandBusLike<AcceptedCommand>;
  AiGateway: AI.AiGatewayPort;
  Mailer: bg.MailerPort;
  EntrySnapshot: Emotions.Ports.EntrySnapshotPort;
  UserContact: Auth.OHQ.UserContactOHQ;
  UserLanguage: bg.Preferences.OHQ.UserLanguagePort<typeof SUPPORTED_LANGUAGES>;
  EMAIL_FROM: bg.EmailFromType;
};

export class WeeklyReviewProcessing {
  constructor(private readonly DI: Dependencies) {
    DI.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
      DI.EventHandler.handle(this.onWeeklyReviewSkippedEvent.bind(this)),
    );
    DI.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      DI.EventHandler.handle(this.onWeeklyReviewRequestedEvent.bind(this)),
    );
    DI.EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_COMPLETED_EVENT,
      DI.EventHandler.handle(this.onWeeklyReviewCompletedEvent.bind(this)),
    );
  }

  async onWeeklyReviewSkippedEvent(event: Emotions.Events.WeeklyReviewSkippedEventType) {
    const contact = await this.DI.UserContact.getPrimary(event.payload.userId);
    const language = await this.DI.UserLanguage.get(event.payload.userId);

    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();

    const notification = composer.compose(week, language);

    if (!contact?.address) return;

    try {
      await this.DI.Mailer.send({ from: this.DI.EMAIL_FROM, to: contact?.address, ...notification.get() });
    } catch {}
  }

  async onWeeklyReviewRequestedEvent(event: Emotions.Events.WeeklyReviewRequestedEventType) {
    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const entries = await this.DI.EntrySnapshot.getByWeekForUser(week, event.payload.userId);

    const language = await this.DI.UserLanguage.get(event.payload.userId);
    const prompt = new Emotions.ACL.AiPrompts.WeeklyReviewInsightsPromptBuilder(entries, language).generate();

    try {
      const insights = await this.DI.AiGateway.query(
        prompt,
        Emotions.ACL.createWeeklyReviewInsightRequestContext(event.payload.userId),
      );

      const detectWeeklyPatterns = Emotions.Commands.DetectWeeklyPatternsCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.DETECT_WEEKLY_PATTERNS_COMMAND,
        payload: { userId: event.payload.userId, week },
      } satisfies Emotions.Commands.DetectWeeklyPatternsCommandType);

      await this.DI.CommandBus.emit(detectWeeklyPatterns.name, detectWeeklyPatterns);

      const completeWeeklyReview = Emotions.Commands.CompleteWeeklyReviewCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.COMPLETE_WEEKLY_REVIEW_COMMAND,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          insights,
          userId: event.payload.userId,
        },
      } satisfies Emotions.Commands.CompleteWeeklyReviewCommandType);

      await this.DI.CommandBus.emit(completeWeeklyReview.name, completeWeeklyReview);
    } catch (_error) {
      const command = Emotions.Commands.MarkWeeklyReviewAsFailedCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
        },
      } satisfies Emotions.Commands.MarkWeeklyReviewAsFailedCommandType);

      await this.DI.CommandBus.emit(command.name, command);
    }
  }

  async onWeeklyReviewCompletedEvent(event: Emotions.Events.WeeklyReviewCompletedEventType) {
    const command = Emotions.Commands.ExportWeeklyReviewByEmailCommand.parse({
      ...bg.createCommandEnvelope(),
      name: Emotions.Commands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
      payload: { userId: event.payload.userId, weeklyReviewId: event.payload.weeklyReviewId },
    } satisfies Emotions.Commands.ExportWeeklyReviewByEmailCommandType);

    await this.DI.CommandBus.emit(command.name, command);
  }
}
