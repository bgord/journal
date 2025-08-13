import * as Auth from "+auth";
import type * as tools from "@bgord/tools";
import { UsageCategory } from "./usage-category";

const CategoryDimensionMap = {
  [UsageCategory.EMOTIONS_ALARM_ENTRY]: { entryId: "" as string },
  [UsageCategory.EMOTIONS_ALARM_INACTIVITY]: {} as Record<string, never>,
  [UsageCategory.EMOTIONS_WEEKLY_REVIEW_INSIGHT]: {} as Record<string, never>,
} as const satisfies Record<UsageCategory, unknown>;

type DimensionsOf<Category extends UsageCategory> = (typeof CategoryDimensionMap)[Category];

export type RequestContext<Category extends UsageCategory = UsageCategory> = {
  category: Category;
  userId: Auth.VO.UserIdType;
  timestamp: tools.TimestampType;
  dimensions: DimensionsOf<Category>;
};
