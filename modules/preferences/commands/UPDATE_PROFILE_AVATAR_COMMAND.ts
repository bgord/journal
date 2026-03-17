import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable all
export const UPDATE_PROFILE_AVATAR_COMMAND = "UPDATE_PROFILE_AVATAR_COMMAND";
// Stryker restore all

export const UpdateProfileAvatarCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(UPDATE_PROFILE_AVATAR_COMMAND),
  payload: v.object({ userId: bg.UUID, absoluteFilePath: v.pipe(v.string(), v.minLength(1)) }),
});

export type UpdateProfileAvatarCommandType = v.InferOutput<typeof UpdateProfileAvatarCommand>;
