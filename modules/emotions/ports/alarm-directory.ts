import * as Auth from "+auth";
import * as VO from "+emotions/value-objects";

export interface AlarmDirectoryPort {
  listForUser(userId: Auth.VO.UserIdType): Promise<VO.AlarmSnapshot[]>;
}
