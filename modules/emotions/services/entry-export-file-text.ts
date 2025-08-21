import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

export class EntryExportFileText extends bg.FileDraft {
  constructor(private readonly entries: VO.EntrySnapshot[]) {
    // TODO: replace with tools
    super({ filename: `entry-export-${Date.now()}.txt`, mime: new tools.Mime("text/plain") });
  }

  create() {
    return this.entries.map((entry) => `Situation description: ${entry.situationDescription}`).join("\n");
  }
}
