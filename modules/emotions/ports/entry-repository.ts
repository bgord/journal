import type { Entry } from "+emotions/aggregates";
import type * as VO from "+emotions/value-objects";

export interface EntryRepositoryPort {
  load(id: VO.EntryIdType): Promise<Entry>;
  save(aggregate: Entry): Promise<void>;
}
