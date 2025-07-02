import * as Emotions from "+emotions";

export const onLowCopingEffectivenessPatternDetectedEvent = async (
  event: Emotions.Events.LowCopingEffectivenessPatternDetectedEventType,
) => {
  console.log("event to be done");
  console.log(event);
};
