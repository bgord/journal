import * as bg from "@bgord/bun";
import type { z } from "zod/v4";
import * as AI from "+ai";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Invariants from "+emotions/invariants";
import * as VO from "+emotions/value-objects";

export type AlarmEvent = (typeof Alarm)["events"][number];
type AlarmEventType = z.infer<AlarmEvent>;

type Dependencies = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export class Alarm {
  static events = [
    Events.AlarmGeneratedEvent,
    Events.AlarmAdviceSavedEvent,
    Events.AlarmNotificationRequestedEvent,
    Events.AlarmNotificationSentEvent,
    Events.AlarmCancelledEvent,
  ];

  readonly id: VO.AlarmIdType;
  private userId?: Auth.VO.UserIdType;
  private status: VO.AlarmStatusEnum = VO.AlarmStatusEnum.started;

  private detection?: VO.AlarmDetection;
  private advice?: AI.Advice;

  private readonly pending: AlarmEventType[] = [];

  private constructor(
    id: VO.AlarmIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(id: VO.AlarmIdType, events: AlarmEventType[], deps: Dependencies): Alarm {
    const entry = new Alarm(id, deps);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  static generate(
    id: VO.AlarmIdType,
    detection: VO.AlarmDetection,
    requesterId: Auth.VO.UserIdType,
    deps: Dependencies,
  ) {
    const alarm = new Alarm(id, deps);

    const event = Events.AlarmGeneratedEvent.parse({
      ...bg.createEventEnvelope(Alarm.getStream(id), deps),
      name: Events.ALARM_GENERATED_EVENT,
      payload: { alarmId: id, alarmName: detection.name, trigger: detection.trigger, userId: requesterId },
    } satisfies Events.AlarmGeneratedEventType);

    alarm.record(event);

    return alarm;
  }

  saveAdvice(advice: AI.Advice) {
    Invariants.AlarmAlreadyGenerated.perform({ status: this.status });

    const event = Events.AlarmAdviceSavedEvent.parse({
      ...bg.createEventEnvelope(Alarm.getStream(this.id), this.deps),
      name: Events.ALARM_ADVICE_SAVED_EVENT,
      payload: { alarmId: this.id, advice: advice.get(), userId: this.userId as Auth.VO.UserIdType },
    } satisfies Events.AlarmAdviceSavedEventType);

    this.record(event);
  }

  notify() {
    Invariants.AlarmAdviceAvailable.perform({
      advice: this.advice,
      status: this.status,
    });

    const event = Events.AlarmNotificationRequestedEvent.parse({
      ...bg.createEventEnvelope(Alarm.getStream(this.id), this.deps),
      name: Events.ALARM_NOTIFICATION_REQUESTED_EVENT,
      payload: {
        alarmId: this.id,
        alarmName: this.detection?.name as VO.AlarmNameType,
        trigger: this.detection?.trigger as VO.AlarmTriggerType,
        userId: this.userId as Auth.VO.UserIdType,
        advice: this.advice?.get() as AI.AdviceType,
      },
    } satisfies Events.AlarmNotificationRequestedEventType);

    this.record(event);
  }

  complete() {
    Invariants.AlarmNotificationRequested.perform({ status: this.status });

    const event = Events.AlarmNotificationSentEvent.parse({
      ...bg.createEventEnvelope(Alarm.getStream(this.id), this.deps),
      name: Events.ALARM_NOTIFICATION_SENT_EVENT,
      payload: { alarmId: this.id },
    } satisfies Events.AlarmNotificationSentEventType);

    this.record(event);
  }

  cancel() {
    Invariants.AlarmIsCancellable.perform({ status: this.status });

    const event = Events.AlarmCancelledEvent.parse({
      ...bg.createEventEnvelope(Alarm.getStream(this.id), this.deps),
      name: Events.ALARM_CANCELLED_EVENT,
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
        break;
      }

      case Events.ALARM_ADVICE_SAVED_EVENT: {
        this.advice = new AI.Advice(event.payload.advice);
        this.status = VO.AlarmStatusEnum.advice_saved;
        break;
      }

      case Events.ALARM_NOTIFICATION_REQUESTED_EVENT: {
        this.status = VO.AlarmStatusEnum.notification_requested;
        break;
      }

      case Events.ALARM_NOTIFICATION_SENT_EVENT: {
        this.status = VO.AlarmStatusEnum.completed;
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
