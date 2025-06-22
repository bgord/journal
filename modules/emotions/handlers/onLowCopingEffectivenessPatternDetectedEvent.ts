import type * as Events from "../events";

export const onLowCopingEffectivenessPatternDetectedEvent = async (
  event: Events.LowCopingEffectivenessPatternDetectedEventType,
) => {
  console.log("event to be done");
  console.log(event);
};
