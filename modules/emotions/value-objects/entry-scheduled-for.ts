import * as tools from "@bgord/tools";

export const EntryScheduledForErrors = { invalid: "entry.scheduled.for.invalid" };

export const EntryScheduledFor = tools.Timestamp.refine((value) => value > Date.now(), {
  message: EntryScheduledForErrors.invalid,
});
