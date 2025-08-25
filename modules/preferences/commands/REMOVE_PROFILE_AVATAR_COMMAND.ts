import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const REMOVE_PROFILE_AVATAR_COMMAND = "REMOVE_PROFILE_AVATAR_COMMAND";

export const RemoveProfileAvatarCommand = z.object({
  ...bg.CommandEnvelopeSchema,
  name: z.literal(REMOVE_PROFILE_AVATAR_COMMAND),
  payload: z.object({ userId: bg.UUID, extension: z.string().min(1).max(4), sizeBytes: tools.SizeValue }),
});

export type RemoveProfileAvatarCommandType = z.infer<typeof RemoveProfileAvatarCommand>;
