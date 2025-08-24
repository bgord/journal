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

export class WeeklyReviewProcessing {
  constructor(
    EventBus: bg.EventBusLike<AcceptedEvent>,
    EventHandler: bg.EventHandler,
    private readonly CommandBus: bg.CommandBusLike<AcceptedCommand>,
    private readonly AiGateway: AI.AiGatewayPort,
    private readonly mailer: bg.MailerPort,
    private readonly entrySnapshot: Emotions.Ports.EntrySnapshotPort,
    private readonly userContact: Auth.OHQ.UserContactOHQ,
    private readonly userLanguage: bg.Preferences.OHQ.UserLanguagePort<typeof SUPPORTED_LANGUAGES>,
    private readonly EMAIL_FROM: bg.EmailFromType,
  ) {
    EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
      EventHandler.handle(this.onWeeklyReviewSkippedEvent.bind(this)),
    );
    EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_REQUESTED_EVENT,
      EventHandler.handle(this.onWeeklyReviewRequestedEvent.bind(this)),
    );
    EventBus.on(
      Emotions.Events.WEEKLY_REVIEW_COMPLETED_EVENT,
      EventHandler.handle(this.onWeeklyReviewCompletedEvent.bind(this)),
    );
  }

  async onWeeklyReviewSkippedEvent(event: Emotions.Events.WeeklyReviewSkippedEventType) {
    const contact = await this.userContact.getPrimary(event.payload.userId);
    const language = await this.userLanguage.get(event.payload.userId);

    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();

    const notification = composer.compose(week, language);

    if (!contact?.address) return;

    try {
      await this.mailer.send({ from: this.EMAIL_FROM, to: contact?.address, ...notification.get() });
    } catch {}
  }

  async onWeeklyReviewRequestedEvent(event: Emotions.Events.WeeklyReviewRequestedEventType) {
    const week = tools.Week.fromIsoId(event.payload.weekIsoId);
    const entries = await this.entrySnapshot.getByWeekForUser(week, event.payload.userId);

    const language = await this.userLanguage.get(event.payload.userId);
    const prompt = new Emotions.ACL.AiPrompts.WeeklyReviewInsightsPromptBuilder(entries, language).generate();

    try {
      const insights = await this.AiGateway.query(
        prompt,
        Emotions.ACL.createWeeklyReviewInsightRequestContext(event.payload.userId),
      );

      const detectWeeklyPatterns = Emotions.Commands.DetectWeeklyPatternsCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.DETECT_WEEKLY_PATTERNS_COMMAND,
        payload: { userId: event.payload.userId, week },
      } satisfies Emotions.Commands.DetectWeeklyPatternsCommandType);

      await this.CommandBus.emit(detectWeeklyPatterns.name, detectWeeklyPatterns);

      const completeWeeklyReview = Emotions.Commands.CompleteWeeklyReviewCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.COMPLETE_WEEKLY_REVIEW_COMMAND,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          insights,
          userId: event.payload.userId,
        },
      } satisfies Emotions.Commands.CompleteWeeklyReviewCommandType);

      await this.CommandBus.emit(completeWeeklyReview.name, completeWeeklyReview);
    } catch (_error) {
      const command = Emotions.Commands.MarkWeeklyReviewAsFailedCommand.parse({
        ...bg.createCommandEnvelope(),
        name: Emotions.Commands.MARK_WEEKLY_REVIEW_AS_FAILED_COMMAND,
        payload: {
          weeklyReviewId: event.payload.weeklyReviewId,
          userId: event.payload.userId,
        },
      } satisfies Emotions.Commands.MarkWeeklyReviewAsFailedCommandType);

      await this.CommandBus.emit(command.name, command);
    }
  }

  async onWeeklyReviewCompletedEvent(event: Emotions.Events.WeeklyReviewCompletedEventType) {
    const command = Emotions.Commands.ExportWeeklyReviewByEmailCommand.parse({
      ...bg.createCommandEnvelope(),
      name: Emotions.Commands.EXPORT_WEEKLY_REVIEW_BY_EMAIL_COMMAND,
      payload: { userId: event.payload.userId, weeklyReviewId: event.payload.weeklyReviewId },
    } satisfies Emotions.Commands.ExportWeeklyReviewByEmailCommandType);

    await this.CommandBus.emit(command.name, command);
  }
}
