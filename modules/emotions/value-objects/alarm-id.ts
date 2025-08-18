import * as bg from "@bgord/bun";
import type { z } from "zod/v4";

export const AlarmId = bg.UUID;
export type AlarmIdType = z.infer<typeof AlarmId>;
