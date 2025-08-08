import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export const EntryScheduledForErrors = { invalid: "entry.scheduled.for.invalid" };

export const EntryScheduledFor = tools.Timestamp.refine((value) => value > Date.now(), {
  message: EntryScheduledForErrors.invalid,
});

export type EntryScheduledForType = z.infer<typeof EntryScheduledFor>;
