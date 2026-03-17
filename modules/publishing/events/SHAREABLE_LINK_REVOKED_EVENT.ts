import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_REVOKED_EVENT = "SHAREABLE_LINK_REVOKED_EVENT";

export const ShareableLinkRevokedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(SHAREABLE_LINK_REVOKED_EVENT),
  payload: v.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ShareableLinkRevokedEventType = v.InferOutput<typeof ShareableLinkRevokedEvent>;
