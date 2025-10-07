import * as bg from "@bgord/bun";
import { Clock } from "+infra/adapters";
import { Env } from "+infra/env";

export const CertificateInspector = {
  [bg.NodeEnvironmentEnum.local]: new bg.CertificateInspectorTLSAdapter({ Clock }),
  [bg.NodeEnvironmentEnum.test]: new bg.CertificateInspectorNoopAdapter(30),
  [bg.NodeEnvironmentEnum.staging]: new bg.CertificateInspectorTLSAdapter({ Clock }),
  [bg.NodeEnvironmentEnum.production]: new bg.CertificateInspectorTLSAdapter({ Clock }),
}[Env.type];
