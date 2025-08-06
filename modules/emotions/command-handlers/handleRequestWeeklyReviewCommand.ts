import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const handleRequestWeeklyReviewCommand = async (
  command: Emotions.Commands.RequestWeeklyReviewCommandType,
) => {
  const entriesPerWeekForUserCount = await Emotions.Queries.CountEntriesPerWeekForUser.execute(
    command.payload.userId,
    command.payload.week,
  );

  if (
    Emotions.Invariants.EntriesForWeekExist.fails({
      count: entriesPerWeekForUserCount,
      userId: command.payload.userId,
    })
  ) {
    await EventStore.save([
      Emotions.Events.WeeklyReviewSkippedEvent.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
        stream: "weekly_review_skipped",
        version: 1,
        payload: { weekIsoId: command.payload.week.toIsoId(), userId: command.payload.userId },
      } satisfies Emotions.Events.WeeklyReviewSkippedEventType),
    ]);

    return;
  }

  const weeklyReviewId = crypto.randomUUID();

  const weeklyReview = Emotions.Aggregates.WeeklyReview.request(
    weeklyReviewId,
    command.payload.week,
    command.payload.userId,
  );

  await EventStore.save(weeklyReview.pullEvents());
};
