import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import type { EventStore as EventStoreType } from "+infra/event-store";

export const handleRequestWeeklyReviewCommand =
  (
    EventStore: typeof EventStoreType,
    repo: Emotions.Ports.WeeklyReviewRepositoryPort,
    EntriesPerWeekCountQuery: Emotions.Queries.EntriesPerWeekCountQuery,
  ) =>
  async (command: Emotions.Commands.RequestWeeklyReviewCommandType) => {
    const entriesPerWeekForUserCount = await EntriesPerWeekCountQuery.execute(
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
          createdAt: tools.Time.Now().value,
          name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
          stream: "weekly_review_skipped",
          version: 1,
          payload: { weekIsoId: command.payload.week.toIsoId(), userId: command.payload.userId },
        } satisfies Emotions.Events.WeeklyReviewSkippedEventType),
      ]);

      return;
    }

    const weeklyReview = Emotions.Aggregates.WeeklyReview.request(
      crypto.randomUUID(),
      command.payload.week,
      command.payload.userId,
    );

    await repo.save(weeklyReview);
  };
