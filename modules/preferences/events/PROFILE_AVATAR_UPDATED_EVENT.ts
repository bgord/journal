import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";
import * as Auth from "+auth";

export const PROFILE_AVATAR_UPDATED_EVENT = "PROFILE_AVATAR_UPDATED_EVENT";

export const ProfileAvatarUpdatedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(PROFILE_AVATAR_UPDATED_EVENT),
  payload: z.object({ userId: Auth.VO.UserId, key: tools.ObjectKey }),
});

export type ProfileAvatarUpdatedEventType = z.infer<typeof ProfileAvatarUpdatedEvent>;
