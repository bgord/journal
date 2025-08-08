import type { UserIdType } from "+auth/value-objects";
import type * as tools from "@bgord/tools";
import { UsageCategoryType } from "./usage-category";

export type RequestContext = {
  category: UsageCategoryType;
  userId: UserIdType;
  timestamp: tools.TimestampType;
};
