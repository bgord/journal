import * as Emotions from "+emotions";

export const onMultipleMaladaptiveReactionsPatternDetectedEvent = async (
  event: Emotions.Events.MultipleMaladaptiveReactionsPatternDetectedEventType,
) => {
  console.log("event to be done");
  console.log(event);
};
