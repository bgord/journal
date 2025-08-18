import type * as VO from "+auth/value-objects";

export interface UserDirectoryOHQ {
  listActiveUserIds(): Promise<VO.UserIdType[]>;
}
