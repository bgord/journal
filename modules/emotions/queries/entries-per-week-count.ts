import * as tools from "@bgord/tools";
import type * as Auth from "+auth";

export interface EntriesPerWeekCountQuery {
  execute(userId: Auth.VO.UserIdType, week: tools.Week): Promise<number>;
}
