import * as Emotions from "+emotions";

export const onLowCopingEffectivenessPatternDetectedEvent = async (
  event: Emotions.Events.LowCopingEffectivenessPatternDetectedEventType,
) => {
  await Emotions.Repos.PatternsRepository.create(event);
};
