import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export function createFileInspection(Env: EnvironmentResultType): bg.FileInspectionPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.FileInspectionAdapter(),
    [bg.NodeEnvironmentEnum.test]: new bg.FileInspectionNoopAdapter({ exists: true }),
    [bg.NodeEnvironmentEnum.staging]: new bg.FileInspectionNoopAdapter({ exists: true }),
    [bg.NodeEnvironmentEnum.production]: new bg.FileInspectionAdapter(),
  }[Env.type];
}
