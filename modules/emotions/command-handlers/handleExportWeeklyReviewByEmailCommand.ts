import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Emotions from "+emotions";
import { WeeklyReviewExportByEmailRequestedEvent } from "../events/WEEKLY_REVIEW_EXPORT_BY_EMAIL_REQUESTED_EVENT";
import { RequesterOwnsWeeklyReview } from "../invariants/requester-owns-weekly-review";
import { WeeklyReviewExists } from "../invariants/weekly-review-exists";
import { WeeklyReviewIsCompleted } from "../invariants/weekly-review-is-completed";

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

    WeeklyReviewExists.enforce({ weeklyReview });
    WeeklyReviewIsCompleted.enforce({ status: weeklyReview?.status });
    RequesterOwnsWeeklyReview.enforce({
      requesterId: command.payload.userId,
      ownerId: weeklyReview?.userId,
    });

    const weeklyReviewExportId = deps.IdProvider.generate();

    const event = bg.event(
      WeeklyReviewExportByEmailRequestedEvent,
      `weekly_review_export_by_email_${weeklyReviewExportId}`,
      {
        weeklyReviewId: command.payload.weeklyReviewId,
        userId: command.payload.userId,
        weeklyReviewExportId,
        attempt: tools.Int.positive(1),
      },
      deps,
    );

    await deps.EventStore.save([event]);
  };
