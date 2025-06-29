import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class JournalEntriesForWeekExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, JournalEntriesForWeekExistError.prototype);
  }
}

type JournalEntriesForWeekExistConfigType = {
  count: number;
};

class JournalEntriesForWeekExistFactory extends bg.Policy<JournalEntriesForWeekExistConfigType> {
  fails(config: JournalEntriesForWeekExistConfigType) {
    return config.count === 0;
  }

  message = "entries.for.week.exist";

  error = JournalEntriesForWeekExistError;

  code = 403 as ContentfulStatusCode;
}

export const JournalEntriesForWeekExist = new JournalEntriesForWeekExistFactory();
