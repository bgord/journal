import * as bg from "@bgord/bun";
import type * as v from "valibot";

export const AlarmId = bg.UUID;
export type AlarmIdType = v.InferOutput<typeof AlarmId>;
