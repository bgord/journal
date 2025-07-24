import * as Emotions from "+emotions";

export const onPatternDetectedEvent = async (event: Emotions.Services.Patterns.PatternDetectionEventType) => {
  await Emotions.Repos.PatternsRepository.create(event);
};
