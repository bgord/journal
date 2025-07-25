import * as Emotions from "+emotions";
import { EventStore } from "+infra/event-store";

export const handleMarkWeeklyReviewAsFailedCommand = async (
  command: Emotions.Commands.MarkWeeklyReviewAsFailedCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.WeeklyReview.events,
    Emotions.Aggregates.WeeklyReview.getStream(command.payload.weeklyReviewId),
  );

  const weeklyReview = Emotions.Aggregates.WeeklyReview.build(command.payload.weeklyReviewId, history);
  weeklyReview.fail();

  await EventStore.save(weeklyReview.pullEvents());
};
