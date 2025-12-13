import * as bg from "@bgord/bun";

export function createImageInfo(): bg.ImageInfoPort {
  return new bg.ImageInfoSharpAdapter();
}
