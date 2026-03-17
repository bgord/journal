import * as bg from "@bgord/bun";
import type * as v from "valibot";

export const UserId = bg.UUID;
export type UserIdType = v.InferOutput<typeof UserId>;
