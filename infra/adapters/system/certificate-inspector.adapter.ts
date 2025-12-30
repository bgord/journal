import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { EnvironmentType } from "+infra/env";

type Dependencies = { Clock: bg.ClockPort };

export function createCertificateInspector(
  Env: EnvironmentType,
  deps: Dependencies,
): bg.CertificateInspectorPort {
  return {
    [bg.NodeEnvironmentEnum.local]: new bg.CertificateInspectorTLSAdapter(deps),
    [bg.NodeEnvironmentEnum.test]: new bg.CertificateInspectorNoopAdapter(tools.Duration.Days(30)),
    [bg.NodeEnvironmentEnum.staging]: new bg.CertificateInspectorTLSAdapter(deps),
    [bg.NodeEnvironmentEnum.production]: new bg.CertificateInspectorTLSAdapter(deps),
  }[Env.type];
}
