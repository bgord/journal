import * as Emotions from "../";

export const onLowCopingEffectivenessPatternDetectedEvent = async (
  event: Emotions.Events.LowCopingEffectivenessPatternDetectedEventType,
) => {
  console.log("event to be done");
  console.log(event);
};
