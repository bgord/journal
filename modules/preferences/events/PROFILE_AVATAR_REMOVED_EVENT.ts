import * as bg from "@bgord/bun";
import * as z from "zod/v4";
import * as Auth from "+auth";

export const PROFILE_AVATAR_REMOVED_EVENT = "PROFILE_AVATAR_REMOVED_EVENT";

export const ProfileAvatarRemovedEvent = z.object({
  ...bg.EventEnvelopeSchema,
  name: z.literal(PROFILE_AVATAR_REMOVED_EVENT),
  payload: z.object({ userId: Auth.VO.UserId }),
});

export type ProfileAvatarRemovedEventType = z.infer<typeof ProfileAvatarRemovedEvent>;
