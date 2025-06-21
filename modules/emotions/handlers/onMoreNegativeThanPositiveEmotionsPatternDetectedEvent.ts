import type * as Events from "../events";

export const onMoreNegativeThanPositiveEmotionsPatternDetectedEvent = async (
  event: Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType,
) => {
  console.log("event to be done");
  console.log(event);
};
