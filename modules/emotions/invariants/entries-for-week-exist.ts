import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type * as Auth from "+auth";

// Stryker disable all
class EntriesForWeekExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntriesForWeekExistError.prototype);
  }
}
// Stryker restore all

type EntriesForWeekExistConfigType = { count: tools.IntegerNonNegativeType; userId: Auth.VO.UserIdType };

class EntriesForWeekExistFactory extends bg.Invariant<EntriesForWeekExistConfigType> {
  fails(config: EntriesForWeekExistConfigType) {
    return config.count === 0;
  }

  // Stryker disable all
  message = "entries.for.week.exist";
  // Stryker restore all

  error = EntriesForWeekExistError;

  code = 403 as ContentfulStatusCode;
}

export const EntriesForWeekExist = new EntriesForWeekExistFactory();
