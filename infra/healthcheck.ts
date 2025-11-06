import * as bg from "@bgord/bun";
import { prerequisites } from "+infra/prerequisites";

export const healthcheck = [
  new bg.PrerequisiteSelf({ label: "self" }),
  new bg.PrerequisiteBinary({ label: "httpie", binary: bg.Binary.parse("http") }),
  new bg.PrerequisiteBinary({ label: "sqlite3", binary: bg.Binary.parse("sqlite3") }),
  new bg.PrerequisiteBinary({ label: "tar", binary: bg.Binary.parse("tar") }),
  ...prerequisites.filter((prerequisite) => prerequisite.label !== "port"),
];
