import * as Emotions from "+emotions";

export const onWeeklyReviewCompletedEvent = async (event: Emotions.Events.WeeklyReviewCompletedEventType) => {
  await Emotions.Repos.WeeklyReviewRepository.complete(event);
};
