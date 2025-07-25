import * as Emotions from "+emotions";

export const onWeeklyReviewRequestedEvent = async (event: Emotions.Events.WeeklyReviewRequestedEventType) => {
  await Emotions.Repos.WeeklyReviewRepository.create(event);
};
