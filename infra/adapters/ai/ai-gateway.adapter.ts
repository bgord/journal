import * as AI from "+ai";
import { AiClient } from "./ai-client.adapter";
import { BucketCounterDrizzle } from "./bucket-counter-drizzle.adapter";

export const AiGateway = new AI.OHS.AiGateway(AiClient, new BucketCounterDrizzle());
