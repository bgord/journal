import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Policies from "+emotions/policies";
import * as VO from "+emotions/value-objects";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

export type AlarmEvent = (typeof Alarm)["events"][number];
type AlarmEventType = z.infer<AlarmEvent>;

export class Alarm {
  static events = [
    Events.AlarmGeneratedEvent,
    Events.AlarmAdviceSavedEvent,
    Events.AlarmNotificationSentEvent,
    Events.AlarmCancelledEvent,
  ];

  private readonly id: VO.AlarmIdType;
  private userId?: Auth.VO.UserIdType;
  private status: VO.AlarmStatusEnum = VO.AlarmStatusEnum.started;
  // @ts-expect-error
  private generatedAt?: VO.AlarmGeneratedAtType;

  private detection?: VO.AlarmDetection;
  private advice?: VO.Advice;

  private readonly pending: AlarmEventType[] = [];

  private constructor(id: VO.AlarmIdType) {
    this.id = id;
  }

  static create(id: VO.AlarmIdType): Alarm {
    return new Alarm(id);
  }

  static build(id: VO.AlarmIdType, events: AlarmEventType[]): Alarm {
    const entry = new Alarm(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  async _generate(detection: VO.AlarmDetection, requesterId: Auth.VO.UserIdType) {
    Policies.AlarmGeneratedOnce.perform({ status: this.status });

    const event = Events.AlarmGeneratedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.ALARM_GENERATED_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: {
        alarmId: this.id,
        alarmName: detection.name,
        trigger: detection.trigger,
        userId: requesterId,
      },
    } satisfies Events.AlarmGeneratedEventType);

    this.record(event);
  }

  async saveAdvice(advice: VO.Advice) {
    Policies.AlarmAlreadyGenerated.perform({ status: this.status });

    const event = Events.AlarmAdviceSavedEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.ALARM_ADVICE_SAVED_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: {
        alarmId: this.id,
        advice: advice.get(),
        userId: this.userId as Auth.VO.UserIdType,
      },
    } satisfies Events.AlarmAdviceSavedEventType);

    this.record(event);
  }

  async notify() {
    Policies.AlarmAdviceAvailable.perform({
      advice: this.advice,
      status: this.status,
    });

    const event = Events.AlarmNotificationSentEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.ALARM_NOTIFICATION_SENT_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: {
        alarmId: this.id,
        alarmName: this.detection?.name as VO.AlarmNameType,
        trigger: this.detection?.trigger as VO.AlarmTriggerType,
        userId: this.userId as Auth.VO.UserIdType,
      },
    } satisfies Events.AlarmNotificationSentEventType);

    this.record(event);
  }

  async cancel() {
    Policies.AlarmIsCancellable.perform({ status: this.status });

    const event = Events.AlarmCancelledEvent.parse({
      id: bg.NewUUID.generate(),
      correlationId: bg.CorrelationStorage.get(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.ALARM_CANCELLED_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: { alarmId: this.id, userId: this.userId as Auth.VO.UserIdType },
    } satisfies Events.AlarmCancelledEventType);

    this.record(event);
  }

  pullEvents(): AlarmEventType[] {
    const events = [...this.pending];

    this.pending.length = 0;

    return events;
  }

  private record(event: AlarmEventType): void {
    this.apply(event);
    this.pending.push(event);
  }

  private apply(event: AlarmEventType): void {
    switch (event.name) {
      case Events.ALARM_GENERATED_EVENT: {
        this.detection = new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName);
        this.userId = event.payload.userId;
        this.status = VO.AlarmStatusEnum.generated;
        this.generatedAt = event.createdAt;
        break;
      }

      case Events.ALARM_ADVICE_SAVED_EVENT: {
        this.advice = new VO.Advice(event.payload.advice);
        this.status = VO.AlarmStatusEnum.advice_saved;
        break;
      }

      case Events.ALARM_NOTIFICATION_SENT_EVENT: {
        this.status = VO.AlarmStatusEnum.notification_sent;
        break;
      }

      case Events.ALARM_CANCELLED_EVENT: {
        this.status = VO.AlarmStatusEnum.cancelled;
        break;
      }
    }
  }

  static getStream(id: VO.AlarmIdType) {
    return `alarm_${id}`;
  }
}
