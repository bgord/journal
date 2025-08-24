import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.WeeklyReviewSkippedEventType;

export const handleRequestWeeklyReviewCommand =
  (
    EventStore: bg.EventStoreLike<AcceptedEvent>,
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
          ...bg.createEventEnvelope("weekly_review_skipped"),
          name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
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
