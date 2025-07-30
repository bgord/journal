import * as Emotions from "+emotions";

export const handleExportWeeklyReviewByEmailCommand = async (
  command: Emotions.Commands.ExportWeeklyReviewByEmailCommand,
) => {
  const weeklyReview = await Emotions.Repos.WeeklyReviewRepository.getById(command.payload.weeklyReviewId);

  Emotions.Policies.WeeklyReviewExists.perform({ weeklyReview });
  Emotions.Policies.WeeklyReviewIsCompleted.perform({ status: weeklyReview?.status });
  Emotions.Policies.RequesterOwnsWeeklyReview.perform({
    requesterId: command.payload.userId,
    ownerId: weeklyReview?.userId,
  });
};
