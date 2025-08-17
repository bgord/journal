import * as bg from "@bgord/bun";
import { PatternNameOption } from "./pattern-name-option";

export type PatternDetectionSnapshot = {
  id: bg.UUIDType;
  name: PatternNameOption;
};
