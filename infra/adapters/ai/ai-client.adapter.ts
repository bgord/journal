import type * as AI from "+ai";
import { AiClientAdapter, type EnvironmentType } from "+infra/env";
import { AiClientAnthropicAdapter } from "./ai-client-anthropic.adapter";
import { AiClientNoopAdapter } from "./ai-client-noop.adapter";
import { AiClientOpenAiAdapter } from "./ai-client-open-ai.adapter";

export function createAiClient(Env: EnvironmentType): AI.AiClientPort {
  return {
    [AiClientAdapter.anthropic]: new AiClientAnthropicAdapter(),
    [AiClientAdapter.open_ai]: new AiClientOpenAiAdapter(),
    [AiClientAdapter.noop]: new AiClientNoopAdapter(),
  }[Env.AI_CLIENT_ADAPTER];
}
