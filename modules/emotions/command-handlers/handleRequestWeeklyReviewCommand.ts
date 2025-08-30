import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";

type AcceptedEvent = Emotions.Events.WeeklyReviewSkippedEventType;

type Dependencies = {
  EventStore: bg.EventStoreLike<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  repo: Emotions.Ports.WeeklyReviewRepositoryPort;
  EntriesPerWeekCountQuery: Emotions.Queries.EntriesPerWeekCountQuery;
};

export const handleRequestWeeklyReviewCommand =
  (deps: Dependencies) => async (command: Emotions.Commands.RequestWeeklyReviewCommandType) => {
    const entriesPerWeekForUserCount = await deps.EntriesPerWeekCountQuery.execute(
      command.payload.userId,
      command.payload.week,
    );

    if (
      Emotions.Invariants.EntriesForWeekExist.fails({
        count: entriesPerWeekForUserCount,
        userId: command.payload.userId,
      })
    ) {
      await deps.EventStore.save([
        Emotions.Events.WeeklyReviewSkippedEvent.parse({
          ...bg.createEventEnvelope("weekly_review_skipped", deps),
          name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
          payload: { weekIsoId: command.payload.week.toIsoId(), userId: command.payload.userId },
        } satisfies Emotions.Events.WeeklyReviewSkippedEventType),
      ]);

      return;
    }

    const weeklyReview = Emotions.Aggregates.WeeklyReview.request(
      deps.IdProvider.generate(),
      command.payload.week,
      command.payload.userId,
      deps,
    );

    await deps.repo.save(weeklyReview);
  };
