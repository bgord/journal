import * as AI from "+ai";
import { AiClient } from "./ai-client.adapter";
import { AiEventStorePublisher } from "./ai-event-publisher.adapter";
import { BucketCounter } from "./bucket-counter.adapter";

export const AiGateway = new AI.OHS.AiGateway(AiEventStorePublisher, AiClient, BucketCounter);
