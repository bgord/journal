import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as AI from "../../ai/value-objects";
import type * as Auth from "../../auth/value-objects";
import type { WeeklyReviewStatusEnum } from "./weekly-review-status";

export type WeeklyReviewSnapshot = {
  id: bg.UUIDType;
  createdAt: tools.TimestampType;
  weekIsoId: tools.WeekIsoIdType;
  userId: Auth.UserIdType;
  insights: AI.AdviceType | null;
  status: WeeklyReviewStatusEnum;
};
