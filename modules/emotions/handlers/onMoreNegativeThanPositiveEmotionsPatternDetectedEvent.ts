import * as Emotions from "../";

export const onMoreNegativeThanPositiveEmotionsPatternDetectedEvent = async (
  event: Emotions.Events.MoreNegativeThanPositiveEmotionsPatternDetectedEventType,
) => {
  console.log("event to be done");
  console.log(event);
};
