import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { EventStore } from "../../../infra/event-store";
import * as Emotions from "../";

export const handleRequestWeeklyReviewCommand = async (
  command: Emotions.Commands.RequestWeeklyReviewCommandType,
) => {
  const entriesFromTheWeekCount = await Emotions.Repos.EmotionJournalEntryRepository.countInWeek(
    command.payload.weekStart.get(),
  );
  const weeklyReviewId = bg.NewUUID.generate();
  const weeklyReview = Emotions.Aggregates.WeeklyReview.create(weeklyReviewId);

  if (Emotions.Policies.JournalEntriesForWeekExist.fails({ count: entriesFromTheWeekCount })) {
    return EventStore.save([
      Emotions.Events.WeeklyReviewSkippedEvent.parse({
        id: bg.NewUUID.generate(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Timestamp.parse(Date.now()),
        name: Emotions.Events.WEEKLY_REVIEW_SKIPPED_EVENT,
        stream: "weekly_review_skipped",
        version: 1,
        payload: { weekStartedAt: command.payload.weekStart.get() },
      } satisfies Emotions.Events.WeeklyReviewSkippedEventType),
    ]);
  }

  await weeklyReview.request(command.payload.weekStart);

  await EventStore.save(weeklyReview.pullEvents());
};
