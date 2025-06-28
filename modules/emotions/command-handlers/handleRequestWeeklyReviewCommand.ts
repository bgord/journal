import * as bg from "@bgord/bun";
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

  // TODO: Emit a WEEKLY_REVIEW_SKIPPED_EVENT
  await Emotions.Policies.JournalEntriesForWeekExist.perform({ count: entriesFromTheWeekCount });

  await weeklyReview.request(command.payload.weekStart);

  await EventStore.save(weeklyReview.pullEvents());
};
