import * as bg from "@bgord/bun";
import { z } from "zod/v4";
import * as VO from "+publishing/value-objects";

export const SHAREABLE_LINK_EXPIRED_EVENT = "SHAREABLE_LINK_EXPIRED_EVENT";

export const ShareableLinkExpiredEvent = z.object({
  ...bg.BaseEventData,
  name: z.literal(SHAREABLE_LINK_EXPIRED_EVENT),
  payload: z.object({ shareableLinkId: VO.ShareableLinkId }),
});

export type ShareableLinkExpiredEventType = z.infer<typeof ShareableLinkExpiredEvent>;
