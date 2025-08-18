import type { Alarm } from "+emotions/aggregates";
import type * as VO from "+emotions/value-objects";

export interface AlarmRepositoryPort {
  load(id: VO.AlarmIdType): Promise<Alarm>;
  save(aggregate: Alarm): Promise<void>;
}
