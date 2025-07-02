import * as Emotions from "+emotions";
import { EventStore } from "+infra";

export const handleCompleteWeeklyReviewCommand = async (
  command: Emotions.Commands.CompleteWeeklyReviewCommandType,
) => {
  const history = await EventStore.find(
    Emotions.Aggregates.WeeklyReview.events,
    Emotions.Aggregates.WeeklyReview.getStream(command.payload.weeklyReviewId),
  );

  const weeklyReview = Emotions.Aggregates.WeeklyReview.build(command.payload.weeklyReviewId, history);
  await weeklyReview.complete(command.payload.insights);

  await EventStore.save(weeklyReview.pullEvents());
};
