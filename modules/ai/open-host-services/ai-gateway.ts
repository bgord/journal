import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Events from "+ai/events";
import * as Ports from "+ai/ports";
import * as Services from "+ai/services";
import * as Specs from "+ai/specifications";
import * as VO from "+ai/value-objects";
import { EventStore } from "+infra/event-store";

/** @public */
export class AiQuotaExceededError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AiQuotaExceededError.prototype);
  }
}

export class AiGateway implements Ports.AiGatewayPort {
  private readonly specification: Specs.QuotaSpecification;

  constructor(
    private readonly AiClient: Ports.AiClientPort,
    bucketCounter: Ports.BucketCounterPort,
  ) {
    this.specification = new Specs.QuotaSpecification(
      new Services.QuotaRuleSelector(VO.RULES),
      bucketCounter,
    );
  }

  async check<C extends VO.UsageCategory>(
    context: VO.RequestContext<C>,
  ): Promise<{ violations: Specs.QuotaViolation[] }> {
    return this.specification.verify(context);
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
