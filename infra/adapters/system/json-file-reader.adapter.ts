import * as bg from "@bgord/bun";

export function createJsonFileReader(): bg.JsonFileReaderPort {
  return new bg.JsonFileReaderBunForgivingAdapter();
}
