import { BucketCounterDrizzleRepository } from "+ai/repositories";
import { AiClient } from "+infra/ai-client";
import * as Gateway from "./ai-gateway";

export const AiGateway = new Gateway.AiGateway(AiClient, new BucketCounterDrizzleRepository());
