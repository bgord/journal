import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

class EntryAlarmLimitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryAlarmLimitError.prototype);
  }
}

type EntryAlarmLimitConfigType = { count: number };

class EntryAlarmLimitFactory extends bg.Policy<EntryAlarmLimitConfigType> {
  fails(config: EntryAlarmLimitConfigType) {
    return config.count >= 2;
  }

  message = "entry.alarm.limit";

  error = EntryAlarmLimitError;

  code = 403 as ContentfulStatusCode;
}

export const EntryAlarmLimit = new EntryAlarmLimitFactory();
