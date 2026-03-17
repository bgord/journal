import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+emotions/value-objects";

type Dependencies = { Clock: bg.ClockPort };

export class EntryExportFileMarkdown extends bg.FileDraft {
  constructor(
    private readonly entries: ReadonlyArray<VO.EntrySnapshot>,
    deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `entry-export-${deps.Clock.now().ms}`),
      v.parse(tools.Extension, "md"),
      tools.Mimes.markdown.mime,
    );
  }

  async create() {
    return this.entries.map((entry) => `# Situation description: ${entry.situationDescription}`).join("\n");
  }
}
