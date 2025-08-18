import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "../../auth/value-objects";
import type { PatternNameOption } from "./pattern-name-option";

export type PatternDetectionSnapshot = {
  id: bg.UUIDType;
  name: PatternNameOption;
  createdAt: tools.TimestampType;
  userId: Auth.UserIdType;
  weekIsoId: tools.WeekIsoIdType;
};
