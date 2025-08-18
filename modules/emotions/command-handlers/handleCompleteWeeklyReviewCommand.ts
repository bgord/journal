import type * as Emotions from "+emotions";

export const handleCompleteWeeklyReviewCommand =
  (repo: Emotions.Ports.WeeklyReviewRepositoryPort) =>
  async (command: Emotions.Commands.CompleteWeeklyReviewCommandType) => {
    const weeklyReview = await repo.load(command.payload.weeklyReviewId);
    weeklyReview.complete(command.payload.insights);
    await repo.save(weeklyReview);
  };
