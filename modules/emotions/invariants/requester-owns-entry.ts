import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class RequesterOwnsEntryError extends Error {}

type RequesterOwnsEntryConfigType = { requesterId: Auth.VO.UserIdType; ownerId?: Auth.VO.UserIdType };

class RequesterOwnsEntryFactory extends bg.Invariant<RequesterOwnsEntryConfigType> {
  passes(config: RequesterOwnsEntryConfigType) {
    return config.requesterId === config.ownerId;
  }

  message = "requester.owns.entry.error";
  error = RequesterOwnsEntryError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const RequesterOwnsEntry = new RequesterOwnsEntryFactory();
