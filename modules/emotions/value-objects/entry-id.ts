import * as bg from "@bgord/bun";
import type * as z from "zod/v4";

export const EntryId = bg.UUID;
export type EntryIdType = z.infer<typeof EntryId>;
