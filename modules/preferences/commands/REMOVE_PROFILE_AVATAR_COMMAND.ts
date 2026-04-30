import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const REMOVE_PROFILE_AVATAR_COMMAND = "REMOVE_PROFILE_AVATAR_COMMAND";

export const RemoveProfileAvatarCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(REMOVE_PROFILE_AVATAR_COMMAND),
  payload: v.object({ userId: bg.UUID }),
});

export type RemoveProfileAvatarCommandType = v.InferOutput<typeof RemoveProfileAvatarCommand>;
