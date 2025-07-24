import * as Emotions from "+emotions";

export const onPositiveEmotionWithMaladaptiveReactionPatternDetectedEvent = async (
  event: Emotions.Events.PositiveEmotionWithMaladaptiveReactionPatternDetectedEventType,
) => {
  await Emotions.Repos.PatternsRepository.create(event);
};
