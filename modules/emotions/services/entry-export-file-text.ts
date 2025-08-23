import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

export class EntryExportFileText extends bg.FileDraft {
  constructor(private readonly entries: VO.EntrySnapshot[]) {
    super({ filename: `entry-export-${Date.now()}.txt`, mime: tools.MIMES.text });
  }

  create() {
    return this.entries.map((entry) => `Situation description: ${entry.situationDescription}`).join("\n");
  }
}
