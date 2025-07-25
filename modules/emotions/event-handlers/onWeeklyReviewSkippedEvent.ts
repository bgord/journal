import * as Emotions from "+emotions";

export const onWeeklyReviewSkippedEvent = async (event: Emotions.Events.WeeklyReviewSkippedEventType) => {
  await Emotions.Repos.WeeklyReviewRepository.createSkipped(event);
};
