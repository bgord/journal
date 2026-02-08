import * as bg from "@bgord/bun";
import * as Events from "+ai/events";
import type * as Ports from "+ai/ports";
import * as Specs from "+ai/specifications";
import type * as VO from "+ai/value-objects";

/** @public */
export class AiQuotaExceededError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, AiQuotaExceededError.prototype);
  }
}

type Dependencies = {
  Publisher: Ports.AiEventPublisherPort;
  AiClient: Ports.AiClientPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  BucketCounter: Ports.BucketCounterPort;
};

export class AiGateway implements Ports.AiGatewayPort {
  private readonly specification: Specs.QuotaSpecification;

  constructor(private readonly deps: Dependencies) {
    this.specification = new Specs.QuotaSpecification(deps.BucketCounter);
  }

  async check<C extends VO.UsageCategory>(
    context: VO.RequestContext<C>,
  ): Promise<{ violations: ReadonlyArray<Specs.QuotaViolation> }> {
    return this.specification.verify(context);
  }

  async query<C extends VO.UsageCategory>(
    prompt: VO.Prompt,
    context: VO.RequestContext<C>,
  ): Promise<VO.Advice> {
    const verification = await this.check(context);

    if (verification.violations.length) {
      const event = Events.AiQuotaExceededEvent.parse({
        ...bg.createEventEnvelope(`user_ai_usage_${context.userId}`, this.deps),
        name: Events.AI_QUOTA_EXCEEDED_EVENT,
        payload: { userId: context.userId, timestamp: context.timestamp },
      } satisfies Events.AiQuotaExceededEventType);

      await this.deps.Publisher.publish([event]);

      throw new AiQuotaExceededError();
    }

    const advice = await this.deps.AiClient.request(prompt);

    const event = Events.AiRequestRegisteredEvent.parse({
      ...bg.createEventEnvelope(`user_ai_usage_${context.userId}`, this.deps),
      name: Events.AI_REQUEST_REGISTERED_EVENT,
      payload: context,
    } satisfies Events.AiRequestRegisteredEventType);

    await this.deps.Publisher.publish([event]);

    return advice;
  }
}
