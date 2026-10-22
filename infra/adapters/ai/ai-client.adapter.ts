import type * as bg from "@bgord/bun";
import type * as AI from "+ai";
import { AiClientAdapter, type EnvironmentResultType } from "+infra/env";
import { AiClientNoopAdapter } from "./ai-client-noop.adapter";

type Dependencies = { Logger: bg.LoggerPort };

export function createAiClient(Env: EnvironmentResultType, deps: Dependencies): AI.AiClientPort {
  return {
    [AiClientAdapter.noop]: new AiClientNoopAdapter(deps),
  }[Env.AI_CLIENT_ADAPTER];
}
