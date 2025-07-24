import * as Emotions from "+emotions";

export const onMultipleMaladaptiveReactionsPatternDetectedEvent = async (
  event: Emotions.Events.MultipleMaladaptiveReactionsPatternDetectedEventType,
) => {
  await Emotions.Repos.PatternsRepository.create(event);
};
