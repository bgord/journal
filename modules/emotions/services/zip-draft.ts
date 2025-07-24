import { Readable } from "node:stream";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { ZipFile } from "yazl";

export class ZipDraft extends bg.FileDraft {
  private readonly parts: bg.FileDraft[];

  constructor(config: { filename: string; parts: bg.FileDraft[] }) {
    super({ filename: config.filename, mime: new tools.Mime("application/zip") });
    this.parts = config.parts;
  }

  async create(): Promise<Buffer> {
    const zip = new ZipFile();
    const chunks: Buffer[] = [];

    for (const part of this.parts) {
      zip.addReadStream((await part.create()) as Readable, part.config.filename);
    }
    zip.end();

    zip.outputStream.on("data", (buffer: Buffer) => chunks.push(buffer));

    return new Promise<Buffer>((resolve, reject) => {
      zip.outputStream.on("end", () => resolve(Buffer.concat(chunks)));
      zip.outputStream.on("error", reject);
    });
  }
}
