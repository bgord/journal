import type * as bg from "@bgord/bun";
import type * as AI from "+ai";
import { AiClientAdapter, type EnvironmentType } from "+infra/env";
import { AiClientAnthropicAdapter } from "./ai-client-anthropic.adapter";
import { AiClientNoopAdapter } from "./ai-client-noop.adapter";
import { AiClientOpenAiAdapter } from "./ai-client-open-ai.adapter";

type Dependencies = { Logger: bg.LoggerPort };

export function createAiClient(Env: EnvironmentType, deps: Dependencies): AI.AiClientPort {
  return {
    [AiClientAdapter.anthropic]: new AiClientAnthropicAdapter(Env.ANTHROPIC_AI_API_KEY),
    [AiClientAdapter.open_ai]: new AiClientOpenAiAdapter(Env.OPEN_AI_API_KEY),
    [AiClientAdapter.noop]: new AiClientNoopAdapter(deps),
  }[Env.AI_CLIENT_ADAPTER];
}
