import { z } from "zod/v4";
import * as VO from "+publishing/value-objects";
import { BaseEventData } from "../../../base";

export const SHAREABLE_LINK_REVOKED_EVENT = "SHAREABLE_LINK_REVOKED_EVENT";

export const ShareableLinkRevokedEvent = z.object({
  ...BaseEventData,
  name: z.literal(SHAREABLE_LINK_REVOKED_EVENT),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ShareableLinkRevokedEventType = z.infer<typeof ShareableLinkRevokedEvent>;
