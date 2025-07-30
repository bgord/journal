import * as Emotions from "+emotions";

export const handleExportWeeklyReviewByEmailCommand = async (
  command: Emotions.Commands.ExportWeeklyReviewByEmailCommand,
) => {
  await Emotions.Repos.WeeklyReviewRepository.getById(command.payload.weeklyReviewId);
};
