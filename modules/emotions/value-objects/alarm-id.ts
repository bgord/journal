import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const AlarmId = v.pipe(bg.UUID, v.brand("AlarmId"));
export type AlarmIdType = v.InferOutput<typeof AlarmId>;
