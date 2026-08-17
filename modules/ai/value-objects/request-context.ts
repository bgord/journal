import type * as tools from "@bgord/tools";
import type * as Auth from "../../auth/value-objects";
import { UsageCategory } from "./usage-category";

type CategoryDimensionMap = {
  [UsageCategory.INSPECT]: Record<string, never>;
  [UsageCategory.EMOTIONS_ALARM_ENTRY]: { entryId: string };
  [UsageCategory.EMOTIONS_ALARM_INACTIVITY]: Record<string, never>;
  [UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT]: Record<string, never>;
};

type DimensionsOf<Category extends UsageCategory> = CategoryDimensionMap[Category];

export type RequestContext<Category extends UsageCategory = UsageCategory> = {
  category: Category;
  userId: Auth.UserIdType;
  timestamp: tools.TimestampValueType;
  dimensions: DimensionsOf<Category>;
};
