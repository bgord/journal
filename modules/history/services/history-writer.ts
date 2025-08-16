import * as History from "+history";

export interface HistoryWriterPort {
  populate(history: Omit<History.VO.HistoryType, "id">): Promise<void>;
  clear(subject: History.VO.HistorySubjectType): Promise<void>;
}
