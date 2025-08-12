import * as Events from "+ai/events";
import * as Ports from "+ai/ports";
import * as VO from "+ai/value-objects";
import { EventStore } from "+infra/event-store";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { AiClientPort } from "../ports/ai-client";
import { BucketCounter } from "../ports/bucket-counter";
import { QuotaRuleSelector } from "../services/quota-rule-selector";
import { AIQuotaSpecification } from "../specifications/ai-quota-specification";

export class AiQuotaExceededError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AiQuotaExceededError.prototype);
  }
}

export class AiGateway implements Ports.AiGatewayPort {
  private readonly specification: AIQuotaSpecification;

  constructor(
    private readonly AiClient: AiClientPort,
    bucketCounter: BucketCounter,
  ) {
    this.specification = new AIQuotaSpecification(new QuotaRuleSelector(VO.RULES), bucketCounter);
  }

  async query<C extends VO.UsageCategory>(
    prompt: VO.Prompt,
    context: VO.RequestContext<C>,
  ): Promise<VO.Advice> {
    const verification = await this.specification.verify(context);

    if (verification.violations.length) {
      const event = Events.AiQuotaExceededEvent.parse({
        id: crypto.randomUUID(),
        correlationId: bg.CorrelationStorage.get(),
        createdAt: tools.Time.Now().value,
        name: Events.AI_QUOTA_EXCEEDED_EVENT,
        stream: `user_ai_usage_${context.userId}`,
        version: 1,
        payload: { userId: context.userId, timestamp: context.timestamp },
      } satisfies Events.AiQuotaExceededEventType);

      await EventStore.save([event]);

      throw new AiQuotaExceededError();
    }

    const advice = this.AiClient.request(prompt);

    const event = Events.AiRequestRegisteredEvent.parse({
      id: crypto.randomUUID(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Time.Now().value,
      name: Events.AI_REQUEST_REGISTERED_EVENT,
      stream: `user_ai_usage_${context.userId}`,
      version: 1,
      payload: context,
    } satisfies Events.AiRequestRegisteredEventType);

    await EventStore.save([event]);

    return advice;
  }
}
