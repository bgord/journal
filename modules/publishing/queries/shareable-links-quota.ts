import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";

export interface ShareableLinksQuotaQuery {
  execute(ownerid: Auth.VO.UserIdType): Promise<{ count: tools.IntegerNonNegativeType }>;
}
