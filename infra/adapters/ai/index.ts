import type * as bg from "@bgord/bun";
import type * as AI from "+ai";
import type { EnvironmentResultType } from "+infra/env";
import { createAiClient } from "./ai-client.adapter";
import { createAiEventPublisher } from "./ai-event-publisher.adapter";
import { createAiGateway } from "./ai-gateway.adapter";
import { BucketCounter } from "./bucket-counter.adapter";
import { createRuleInspector } from "./rule-inspector.adapter";

type Dependencies = {
  EventStore: bg.EventStorePort<AI.Ports.AIEvents>;
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  Logger: bg.LoggerPort;
};

export function createAuthAdapter(Env: EnvironmentResultType, deps: Dependencies) {
  const AiClient = createAiClient(Env, deps);
  const AiEventPublisher = createAiEventPublisher(deps);
  const RuleInspector = createRuleInspector(deps);

  return {
    AiClient,
    AiEventPublisher,
    BucketCounter,
    RuleInspector,
    AiGateway: createAiGateway({ ...deps, Publisher: AiEventPublisher, AiClient, BucketCounter }),
  };
}
