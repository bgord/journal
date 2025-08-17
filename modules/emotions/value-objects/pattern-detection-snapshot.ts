import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export type PatternDetectionSnapshot = {
  id: bg.UUIDType;
  name: VO.PatternNameOption;
  createdAt: tools.TimestampType;
  userId: Auth.VO.UserIdType;
  weekIsoId: tools.WeekIsoIdType;
};
