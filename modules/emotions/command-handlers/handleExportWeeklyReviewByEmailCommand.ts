import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.WeeklyReviewExportByEmailRequestedEventType;

type Dependencies = {
  EventStore: bg.EventStoreLike<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  WeeklyReviewSnapshot: Emotions.Ports.WeeklyReviewSnapshotPort;
};

export const handleExportWeeklyReviewByEmailCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.ExportWeeklyReviewByEmailCommandType) => {
    const weeklyReview = await deps.WeeklyReviewSnapshot.getById(command.payload.weeklyReviewId);

    Emotions.Invariants.WeeklyReviewExists.enforce({ weeklyReview });
    // Stryker disable all
    Emotions.Invariants.WeeklyReviewIsCompleted.enforce({ status: weeklyReview?.status });
    Emotions.Invariants.RequesterOwnsWeeklyReview.enforce({
      requesterId: command.payload.userId,
      ownerId: weeklyReview?.userId,
    });
    // Stryker restore all

    const weeklyReviewExportId = deps.IdProvider.generate();

    await deps.EventStore.save([
      Emotions.Events.WeeklyReviewExportByEmailRequestedEvent.parse({
        ...bg.createEventEnvelope(`weekly_review_export_by_email_${weeklyReviewExportId}`, deps),
        name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
        payload: {
          weeklyReviewId: command.payload.weeklyReviewId,
          userId: command.payload.userId,
          weeklyReviewExportId,
          attempt: tools.IntegerPositive.parse(1),
        },
      } satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType),
    ]);
  };
