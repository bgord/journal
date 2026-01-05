import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { GetLatestEntryTimestampForUser } from "+emotions/queries";

// Stryker disable all
class NoEntriesInTheLastWeekError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NoEntriesInTheLastWeekError.prototype);
  }
}
// Stryker restore all

type NoEntriesInTheLastWeekConfigType = {
  lastEntryTimestamp: Awaited<ReturnType<GetLatestEntryTimestampForUser["execute"]>>;
  now: tools.TimestampValueType;
};

class NoEntriesInTheLastWeekFactory extends bg.Invariant<NoEntriesInTheLastWeekConfigType> {
  fails(config: NoEntriesInTheLastWeekConfigType) {
    if (!config.lastEntryTimestamp) return true;

    return tools.Timestamp.fromValue(config.lastEntryTimestamp).isAfter(
      tools.Timestamp.fromValue(config.now).subtract(tools.Duration.Days(7)),
    );
  }

  // Stryker disable all
  message = "no.entries.in.the.last.week";
  // Stryker restore all
  error = NoEntriesInTheLastWeekError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const NoEntriesInTheLastWeek = new NoEntriesInTheLastWeekFactory();
