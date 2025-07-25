import * as Emotions from "+emotions";

export const onWeeklyReviewFailedEvent = async (event: Emotions.Events.WeeklyReviewFailedEventType) => {
  await Emotions.Repos.WeeklyReviewRepository.fail(event);
};
