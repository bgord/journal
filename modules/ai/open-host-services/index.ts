import { BucketCounterDrizzleRepository } from "+ai/repositories";
import { AiClient } from "+infra/ai-client";
import { AiGateway } from "./ai-gateway";

export const aiGateway = new AiGateway(AiClient, new BucketCounterDrizzleRepository());
