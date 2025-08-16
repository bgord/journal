import * as History from "+history";

export interface HistoryWriterPort {
  populate(history: History.VO.HistoryType): Promise<void>;
  clear(subject: History.VO.HistorySubjectType): Promise<void>;
}
