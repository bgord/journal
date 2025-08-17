import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import { PatternNameOption } from "./pattern-name-option";

export type PatternDetectionSnapshot = {
  id: bg.UUIDType;
  name: PatternNameOption;
  createdAt: tools.TimestampType;
  userId: Auth.VO.UserIdType;
  weekIsoId: tools.WeekIsoIdType;
};
