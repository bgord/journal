import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.WeeklyReviewExportByEmailRequestedEventType;

type Dependencies = {
  EventStore: bg.EventStoreLike<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  WeeklyReviewSnapshot: Emotions.Ports.WeeklyReviewSnapshotPort;
};

export const handleExportWeeklyReviewByEmailCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.ExportWeeklyReviewByEmailCommandType) => {
    const weeklyReview = await deps.WeeklyReviewSnapshot.getById(command.payload.weeklyReviewId);

    Emotions.Invariants.WeeklyReviewExists.perform({ weeklyReview });
    Emotions.Invariants.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
    Emotions.Invariants.RequesterOwnsWeeklyReview.perform({
      requesterId: command.payload.userId,
      ownerId: weeklyReview?.userId,
    });

    const weeklyReviewExportId = deps.IdProvider.generate();

    await deps.EventStore.save([
      Emotions.Events.WeeklyReviewExportByEmailRequestedEvent.parse({
        ...bg.createEventEnvelope(deps.IdProvider, `weekly_review_export_by_email_${weeklyReviewExportId}`),
        name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
        payload: {
          weeklyReviewId: command.payload.weeklyReviewId,
          userId: command.payload.userId,
          weeklyReviewExportId,
          attempt: 1,
        },
      } satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType),
    ]);
  };
