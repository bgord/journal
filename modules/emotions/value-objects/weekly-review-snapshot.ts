import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as AI from "+ai";
import type * as Auth from "+auth";
import type * as VO from "+emotions/value-objects";

export type WeeklyReviewSnapshot = {
  id: bg.UUIDType;
  createdAt: tools.TimestampType;
  weekIsoId: tools.WeekIsoIdType;
  userId: Auth.VO.UserIdType;
  insights: AI.AdviceType | null;
  status: VO.WeeklyReviewStatusEnum;
};
