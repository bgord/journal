import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_EXPIRED_EVENT = "SHAREABLE_LINK_EXPIRED_EVENT";

export const ShareableLinkExpiredEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(SHAREABLE_LINK_EXPIRED_EVENT),
  payload: v.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ShareableLinkExpiredEventType = v.InferOutput<typeof ShareableLinkExpiredEvent>;
