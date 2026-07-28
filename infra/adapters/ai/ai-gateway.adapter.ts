import type * as bg from "@bgord/bun";
import * as AI from "+ai";

type Dependencies = {
  Publisher: AI.Ports.AiEventPublisherPort;
  AiClient: AI.Ports.AiClientPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  BucketCounter: AI.Ports.BucketCounterPort;
};

export function createAiGateway(deps: Dependencies): AI.Ports.AiGatewayPort {
  return new AI.OHS.AiGateway(deps);
}
