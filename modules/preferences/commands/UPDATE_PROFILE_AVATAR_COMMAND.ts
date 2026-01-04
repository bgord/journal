import * as bg from "@bgord/bun";
import { z } from "zod/v4";

// Stryker disable all
export const UPDATE_PROFILE_AVATAR_COMMAND = "UPDATE_PROFILE_AVATAR_COMMAND";
// Stryker restore all

export const UpdateProfileAvatarCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(UPDATE_PROFILE_AVATAR_COMMAND),
  payload: z.object({ userId: bg.UUID, absoluteFilePath: z.string().min(1) }),
});

export type UpdateProfileAvatarCommandType = z.infer<typeof UpdateProfileAvatarCommand>;
