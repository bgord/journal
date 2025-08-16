import { AiClientAdapter, Env } from "+infra/env";
import { AiClientAnthropicAdapter } from "./ai-client-antrhopic.adapter";
import { AiClientNoopAdapter } from "./ai-client-noop.adapter";
import { AiClientOpenAiAdapter } from "./ai-client-open-ai.adapter";

export const AiClient = {
  [AiClientAdapter.anthropic]: new AiClientAnthropicAdapter(),
  [AiClientAdapter.open_ai]: new AiClientOpenAiAdapter(),
  [AiClientAdapter.noop]: new AiClientNoopAdapter(),
}[Env.AI_CLIENT_ADAPTER];
