import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";

export const PROFILE_AVATAR_REMOVED_EVENT = "PROFILE_AVATAR_REMOVED_EVENT";

export const ProfileAvatarRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PROFILE_AVATAR_REMOVED_EVENT),
  payload: v.object({ userId: Auth.VO.UserId }),
});

export type ProfileAvatarRemovedEventType = v.InferOutput<typeof ProfileAvatarRemovedEvent>;
