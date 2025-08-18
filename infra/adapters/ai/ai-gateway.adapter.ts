import * as AI from "+ai";
import { EventStore } from "+infra/event-store";
import { AiClient } from "./ai-client.adapter";
import { BucketCounterDrizzle } from "./bucket-counter-drizzle.adapter";

export const AiGateway = new AI.OHS.AiGateway(EventStore, AiClient, new BucketCounterDrizzle());
