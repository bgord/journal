import * as tools from "@bgord/tools";
import * as VO from "+history/value-objects";

export interface HistoryRepositoryPort {
  append(data: VO.HistoryType, createdAt: tools.TimestampType): Promise<void>;

  clear(subject: VO.HistoryType["subject"]): Promise<void>;
}
