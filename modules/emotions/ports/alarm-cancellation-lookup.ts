import type { VO } from "+emotions";

export interface AlarmCancellationLookupPort {
  listIdsForEntry(entryId: VO.EntryIdType): Promise<VO.AlarmIdType[]>;
}
