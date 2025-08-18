import type * as Auth from "+auth";

export interface ShareableLinksQuotaQuery {
  execute(ownerid: Auth.VO.UserIdType): Promise<{ count: number }>;
}
