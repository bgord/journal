import * as VO from "+auth/value-objects";

export interface UserDirectoryPort {
  listActiveUserIds(): Promise<VO.UserIdType[]>;
}
