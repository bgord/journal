import * as AI from "+ai";
import { BucketCounterDrizzleRepository } from "+ai/repositories";
import { AiClient } from "+infra/adapters/ai";

export const AiGateway = new AI.OHS.AiGateway(AiClient, new BucketCounterDrizzleRepository());
