import * as bg from "@bgord/bun";
import { z } from "zod/v4";

export const UPDATE_PROFILE_AVATAR_COMMAND = "UPDATE_PROFILE_AVATAR_COMMAND";

export const UpdateProfileAvatarCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(UPDATE_PROFILE_AVATAR_COMMAND),
  payload: z.object({ userId: bg.UUID, extension: z.string().min(1).max(4) }),
});

export type UpdateProfileAvatarCommandType = z.infer<typeof UpdateProfileAvatarCommand>;
