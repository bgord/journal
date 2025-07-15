import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class EntriesForWeekExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntriesForWeekExistError.prototype);
  }
}

type EntriesForWeekExistConfigType = { count: number };

class EntriesForWeekExistFactory extends bg.Policy<EntriesForWeekExistConfigType> {
  fails(config: EntriesForWeekExistConfigType) {
    return config.count === 0;
  }

  message = "entries.for.week.exist";

  error = EntriesForWeekExistError;

  code = 403 as ContentfulStatusCode;
}

export const EntriesForWeekExist = new EntriesForWeekExistFactory();
