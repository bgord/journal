import * as bg from "@bgord/bun";
import type * as v from "valibot";

export const EntryId = bg.UUID;
export type EntryIdType = v.InferOutput<typeof EntryId>;
