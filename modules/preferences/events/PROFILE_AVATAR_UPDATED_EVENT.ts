import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

export const PROFILE_AVATAR_UPDATED_EVENT = "PROFILE_AVATAR_UPDATED_EVENT";

export const ProfileAvatarUpdatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PROFILE_AVATAR_UPDATED_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, key: tools.ObjectKey, etag: bg.HashValue }),
});

export type ProfileAvatarUpdatedEventType = v.InferOutput<typeof ProfileAvatarUpdatedEvent>;
