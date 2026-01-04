import * as bg from "@bgord/bun";
import { z } from "zod/v4";

// Stryker disable all
export const REMOVE_PROFILE_AVATAR_COMMAND = "REMOVE_PROFILE_AVATAR_COMMAND";
// Stryker restore all

export const RemoveProfileAvatarCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(REMOVE_PROFILE_AVATAR_COMMAND),
  payload: z.object({ userId: bg.UUID }),
});

export type RemoveProfileAvatarCommandType = z.infer<typeof RemoveProfileAvatarCommand>;
