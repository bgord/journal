import type * as Events from "../events";

export const onMultipleMaladaptiveReactionsPatternDetectedEvent = async (
  event: Events.MultipleMaladaptiveReactionsPatternDetectedEventType,
) => {
  console.log("event to be done");
  console.log(event);
};
