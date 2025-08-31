import * as AI from "+ai";
import { Clock } from "../clock.adapter";
import { IdProvider } from "../id-provider.adapter";
import { AiClient } from "./ai-client.adapter";
import { AiEventStorePublisher } from "./ai-event-publisher.adapter";
import { BucketCounter } from "./bucket-counter.adapter";

export const AiGateway = new AI.OHS.AiGateway({
  Publisher: AiEventStorePublisher,
  AiClient,
  IdProvider,
  Clock,
  BucketCounter: BucketCounter,
});
