import * as Events from "+ai/events";
import type * as Ports from "+ai/ports";
import * as Specs from "+ai/specifications";
import type * as VO from "+ai/value-objects";
import { createEventEnvelope } from "../../../base";

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
    private readonly publisher: Ports.AiEventPublisherPort,
    private readonly AiClient: Ports.AiClientPort,
    bucketCounter: Ports.BucketCounterPort,
  ) {
    this.specification = new Specs.QuotaSpecification(bucketCounter);
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
    const verification = await this.check(context);

    if (verification.violations.length) {
      const event = Events.AiQuotaExceededEvent.parse({
        ...createEventEnvelope(`user_ai_usage_${context.userId}`),
        name: Events.AI_QUOTA_EXCEEDED_EVENT,
        payload: { userId: context.userId, timestamp: context.timestamp },
      } satisfies Events.AiQuotaExceededEventType);

      await this.publisher.publish([event]);

      throw new AiQuotaExceededError();
    }

    const advice = await this.AiClient.request(prompt);

    const event = Events.AiRequestRegisteredEvent.parse({
      ...createEventEnvelope(`user_ai_usage_${context.userId}`),
      name: Events.AI_REQUEST_REGISTERED_EVENT,
      payload: context,
    } satisfies Events.AiRequestRegisteredEventType);

    await this.publisher.publish([event]);

    return advice;
  }
}
