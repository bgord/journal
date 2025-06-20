import * as bg from "@bgord/bun";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import * as Entities from "../entities";

class EntryHasBenStartedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EntryHasBenStartedError.prototype);
  }
}

type EntryHasBenStartedConfigType = { situation?: Entities.Situation };

class EntryHasBenStartedFactory extends bg.Policy<EntryHasBenStartedConfigType> {
  fails(config: EntryHasBenStartedConfigType) {
    return config.situation === undefined;
  }

  message = "entry.has.been.started";

  error = EntryHasBenStartedError;

  code = 403 as ContentfulStatusCode;
}

export const EntryHasBenStarted = new EntryHasBenStartedFactory();
