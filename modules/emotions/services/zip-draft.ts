import { Readable } from "node:stream";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import yazl from "yazl";

export class ZipDraft extends bg.FileDraft {
  constructor(private readonly parts: bg.FileDraft[]) {
    super({ filename: `export-${Date.now()}.zip`, mime: new tools.Mime("application/zip") });
  }

  public async create(): Promise<bg.DraftBody> {
    const zip = new yazl.ZipFile();

    for (const part of this.parts) {
      const content = await part.create();
      const filename = part.config.filename;

      if (content instanceof Readable) {
        zip.addReadStream(content, filename);
        continue;
      }

      if (this.isWebReadableStream(content)) {
        zip.addReadStream(Readable.fromWeb(content as any), filename);
        continue;
      }

      let buffer: Buffer;

      if (typeof content === "string") {
        buffer = Buffer.from(content, "utf8");
      } else if (this.isBlob(content)) {
        buffer = Buffer.from(await content.arrayBuffer());
      } else if (this.isArrayBufferView(content)) {
        buffer = Buffer.from(content.buffer, content.byteOffset, content.byteLength);
      } else if (content instanceof ArrayBuffer) {
        buffer = Buffer.from(content);
      } else {
        throw new TypeError(`Unsupported DraftBody subtype for ${filename}`);
      }

      zip.addBuffer(buffer, filename);
    }

    zip.end();

    return zip.outputStream;
  }

  private isWebReadableStream(x: unknown): x is ReadableStream<unknown> {
    return typeof (x as ReadableStream<unknown>)?.getReader === "function";
  }

  private isBlob(x: unknown): x is Blob {
    return typeof (x as Blob)?.arrayBuffer === "function";
  }

  private isArrayBufferView(x: unknown): x is ArrayBufferView {
    return ArrayBuffer.isView(x);
  }
}
