import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const EntryId = v.pipe(bg.UUID, v.brand("EntryId"));
export type EntryIdType = v.InferOutput<typeof EntryId>;
