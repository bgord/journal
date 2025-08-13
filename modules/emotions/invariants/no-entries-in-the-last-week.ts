import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { GetLatestEntryTimestampForUser } from "+emotions/queries";

class NoEntriesInTheLastWeekError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NoEntriesInTheLastWeekError.prototype);
  }
}

type NoEntriesInTheLastWeekConfigType = {
  lastEntryTimestamp: Awaited<ReturnType<typeof GetLatestEntryTimestampForUser.execute>>;
};

class NoEntriesInTheLastWeekFactory extends bg.Invariant<NoEntriesInTheLastWeekConfigType> {
  fails(config: NoEntriesInTheLastWeekConfigType) {
    if (!config.lastEntryTimestamp) return true;
    return config.lastEntryTimestamp > tools.Time.Now().Minus(tools.Time.Days(7)).ms;
  }

  message = "no.entries.in.the.last.week";

  error = NoEntriesInTheLastWeekError;

  code = 403 as ContentfulStatusCode;
}

export const NoEntriesInTheLastWeek = new NoEntriesInTheLastWeekFactory();
