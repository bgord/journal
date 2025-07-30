import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const handleExportWeeklyReviewByEmailCommand = async (
  command: Emotions.Commands.ExportWeeklyReviewByEmailCommand,
) => {
  const weeklyReview = await Emotions.Repos.WeeklyReviewRepository.getById(command.payload.weeklyReviewId);

  Emotions.Policies.WeeklyReviewExists.perform({ weeklyReview });
  Emotions.Policies.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
  Emotions.Policies.RequesterOwnsWeeklyReview.perform({
    requesterId: command.payload.userId,
    ownerId: weeklyReview?.userId,
  });

  const event = Emotions.Events.WeeklyReviewExportByEmailRequestedEvent.parse({
    id: crypto.randomUUID(),
    correlationId: bg.CorrelationStorage.get(),
    createdAt: tools.Timestamp.parse(Date.now()),
    name: Emotions.Events.WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT,
    // TODO: establish stream - event sourced entity?
    stream: `weely_review_export_by_email_${command.payload.weeklyReviewId}`,
    version: 1,
    payload: { weeklyReviewId: command.payload.weeklyReviewId, userId: command.payload.userId },
  } satisfies Emotions.Events.WeeklyReviewExportByEmailRequestedEventType);

  await EventStore.save([event]);
};
