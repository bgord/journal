import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as wip from "+infra/build";

type AcceptedEvent = Emotions.Events.WeeklyReviewExportByEmailRequestedEventType;

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
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

    const event = wip.event(
      Emotions.Events.WeeklyReviewExportByEmailRequestedEvent,
      `weekly_review_export_by_email_${weeklyReviewExportId}`,
      {
        payload: {
          weeklyReviewId: command.payload.weeklyReviewId,
          userId: command.payload.userId,
          weeklyReviewExportId,
          attempt: tools.Int.positive(1),
        },
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
