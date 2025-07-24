import type * as Schema from "+infra/schema";
import type { ReadableStream } from "node:stream/web";
import * as tools from "@bgord/tools";
import { stringify } from "csv";

export type DraftBody = BodyInit | NodeJS.ReadableStream | ReadableStream;

abstract class FileDraft {
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

  protected abstract create(): DraftBody | Promise<DraftBody>;

  async toResponse(): Promise<Response> {
    const body = await this.create();

    return new Response(body as BodyInit, { headers: this.getHeaders() });
  }
}

export class EntryExportFile extends FileDraft {
  constructor(private readonly entries: Schema.SelectEntries[]) {
    super(`entry-export-${Date.now()}.csv`, new tools.Mime("text/csv"));
  }

  private static COLUMNS = ["id", "situationDescription"];

  create() {
    return stringify(this.entries, { header: true, columns: EntryExportFile.COLUMNS });
  }
}
