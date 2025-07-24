import type * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";
import { stringify } from "csv";

class FileDraft {
  constructor(
    readonly filename: string,
    readonly mime: tools.Mime,
  ) {}

  getHeaders(): Headers {
    return new Headers({
      "Content-Type": this.mime.raw,
      "Content-Disposition": `attachment; filename="${this.filename}"`,
    });
  }
}

export class EntryExportFile extends FileDraft {
  constructor(private readonly entries: Schema.SelectEntries[]) {
    const filename = `entry-export-${Date.now()}.csv`;

    super(filename, new tools.Mime("text/csv"));
  }

  private static COLUMNS = ["id", "situationDescription"];

  generate() {
    return stringify(this.entries, { header: true, columns: EntryExportFile.COLUMNS });
  }
}
