import type { UserIdType } from "+auth/value-objects";
import type * as tools from "@bgord/tools";
import { UsageCategory } from "./usage-category";

export type RequestContext = {
  category: UsageCategory;
  userId: UserIdType;
  timestamp: tools.TimestampType;
  dimension: string;
};
