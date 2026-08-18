import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";

class EntriesForWeekExistError extends Error {}

type EntriesForWeekExistConfigType = { count: tools.IntegerNonNegativeType; userId: Auth.VO.UserIdType };

class EntriesForWeekExistFactory extends bg.Invariant<EntriesForWeekExistConfigType> {
  passes(config: EntriesForWeekExistConfigType) {
    return config.count > 0;
  }

  // Stryker disable next-line StringLiteral
  message = "entries.for.week.exist";
  error = EntriesForWeekExistError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const EntriesForWeekExist = new EntriesForWeekExistFactory();
