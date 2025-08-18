import * as Emotions from "+emotions";

export const handleMarkWeeklyReviewAsFailedCommand =
  (repo: Emotions.Ports.WeeklyReviewRepositoryPort) =>
  async (command: Emotions.Commands.MarkWeeklyReviewAsFailedCommandType) => {
    const weeklyReview = await repo.load(command.payload.weeklyReviewId);
    weeklyReview.fail();
    await repo.save(weeklyReview);
  };
