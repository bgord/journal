import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as VO from "+emotions/value-objects";

type Dependencies = { Clock: bg.ClockPort };

export class EntryExportFileMarkdown extends bg.FileDraft {
  constructor(
    private readonly entries: VO.EntrySnapshot[],
    deps: Dependencies,
  ) {
    super({ filename: `entry-export-${deps.Clock.nowMs()}.md`, mime: tools.MIMES.markdown });
  }

  create() {
    return this.entries.map((entry) => `# Situation description: ${entry.situationDescription}`).join("\n");
  }
}
