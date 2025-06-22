import * as bg from "@bgord/bun";
import { z } from "zod/v4";

/** @public */
export const AlarmId = bg.UUID;
export type AlarmIdType = z.infer<typeof AlarmId>;
