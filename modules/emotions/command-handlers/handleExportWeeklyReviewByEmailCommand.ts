import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleExportWeeklyReviewByEmailCommand =
  (WeeklyReviewSnapshot: Emotions.Ports.WeeklyReviewSnapshotPort) =>
  async (command: Emotions.Commands.ExportWeeklyReviewByEmailCommand) => {
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
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Time.Now().value,
        name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
        stream: `weekly_review_export_by_email_${weeklyReviewExportId}`,
        version: 1,
        payload: {
          weeklyReviewId: command.payload.weeklyReviewId,
          userId: command.payload.userId,
          weeklyReviewExportId,
          attempt: 1,
        },
      } satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType),
    ]);
  };
