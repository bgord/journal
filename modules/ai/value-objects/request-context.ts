import type { UserIdType } from "+auth/value-objects";
import type * as tools from "@bgord/tools";
import { UsageCategory } from "./usage-category";

export type CategoryDimensionMap = {
  [UsageCategory.EMOTIONS_ALARM_ENTRY]: { entryId: string };
  [UsageCategory.EMOTIONS_ALARM_INACTIVITY]: Record<string, never>;
  [UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT]: Record<string, never>;
};

export type RequestContext<Category extends UsageCategory = UsageCategory> = {
  category: Category;
  userId: UserIdType;
  timestamp: tools.TimestampType;
  dimensions: CategoryDimensionMap[Category];
};
