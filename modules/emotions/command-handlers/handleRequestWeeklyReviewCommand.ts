import type * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as wip from "+infra/build";

type AcceptedEvent = Emotions.Events.WeeklyReviewSkippedEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
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
      !Emotions.Invariants.EntriesForWeekExist.passes({
        count: entriesPerWeekForUserCount,
        userId: command.payload.userId,
      })
    ) {
      const event = wip.event(
        Emotions.Events.WeeklyReviewSkippedEvent,
        "weekly_review_skipped",
        { weekIsoId: command.payload.week.toIsoId(), userId: command.payload.userId },
        deps,
      );

      await deps.EventStore.save([event]);

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
