import * as Emotions from "+emotions";

export const onMoreNegativeThanPositiveEmotionsPatternDetectedEvent = async (
  event: Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType,
) => {
  await Emotions.Repos.PatternsRepository.create(event);
};
