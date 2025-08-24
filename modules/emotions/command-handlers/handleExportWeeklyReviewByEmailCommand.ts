import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.WeeklyReviewExportByEmailRequestedEventType;

export const handleExportWeeklyReviewByEmailCommand =
  (
    EventStore: bg.EventStoreLike<AcceptedEvent>,
    WeeklyReviewSnapshot: Emotions.Ports.WeeklyReviewSnapshotPort,
  ) =>
  async (command: Emotions.Commands.ExportWeeklyReviewByEmailCommandType) => {
    const weeklyReview = await WeeklyReviewSnapshot.getById(command.payload.weeklyReviewId);

    Emotions.Invariants.WeeklyReviewExists.perform({ weeklyReview });
    Emotions.Invariants.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
    Emotions.Invariants.RequesterOwnsWeeklyReview.perform({
      requesterId: command.payload.userId,
      ownerId: weeklyReview?.userId,
    });

    const weeklyReviewExportId = crypto.randomUUID();

    await EventStore.save([
      Emotions.Events.WeeklyReviewExportByEmailRequestedEvent.parse({
        ...bg.createEventEnvelope(`weekly_review_export_by_email_${weeklyReviewExportId}`),
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
