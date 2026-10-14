import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as AI from "+ai";
import type * as Auth from "+auth";
import * as Events from "+emotions/events";
import * as Invariants from "+emotions/invariants";
import * as VO from "+emotions/value-objects";

export type AlarmEventType =
  | Events.AlarmGeneratedEventType
  | Events.AlarmAdviceSavedEventType
  | Events.AlarmNotificationRequestedEventType
  | Events.AlarmNotificationSentEventType
  | Events.AlarmCancelledEventType;

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
};

export class Alarm {
  // Stryker disable all
  static readonly registry = new bg.EventValidatorRegistryAdapter<AlarmEventType>({
    [Events.ALARM_GENERATED_EVENT]: Events.AlarmGeneratedEvent,
    [Events.ALARM_ADVICE_SAVED_EVENT]: Events.AlarmAdviceSavedEvent,
    [Events.ALARM_NOTIFICATION_REQUESTED_EVENT]: Events.AlarmNotificationRequestedEvent,
    [Events.ALARM_NOTIFICATION_SENT_EVENT]: Events.AlarmNotificationSentEvent,
    [Events.ALARM_CANCELLED_EVENT]: Events.AlarmCancelledEvent,
  });
  // Stryker restore all

  readonly id: VO.AlarmIdType;
  private status: VO.AlarmStatusEnum = VO.AlarmStatusEnum.started;

  private state?: { userId: Auth.VO.UserIdType; detection: VO.AlarmDetection };
  private advice?: AI.Advice;

  private readonly pending: Array<AlarmEventType> = [];

  private constructor(
    id: VO.AlarmIdType,
    private readonly deps: Dependencies,
  ) {
    this.id = id;
  }

  static build(id: VO.AlarmIdType, events: ReadonlyArray<AlarmEventType>, deps: Dependencies): Alarm {
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

    const event = bg.event(
      Events.AlarmGeneratedEvent,
      Alarm.getStream(id),
      {
        alarmId: id,
        alarmName: detection.name,
        trigger: detection.trigger,
        userId: requesterId,
      },
      deps,
    );

    alarm.record(event);

    return alarm;
  }

  saveAdvice(advice: AI.Advice) {
    Invariants.AlarmAlreadyGenerated.enforce({ status: this.status });
    const { alarm } = Invariants.AlarmExists.enforce({ alarm: this.state });

    const event = bg.event(
      Events.AlarmAdviceSavedEvent,
      Alarm.getStream(this.id),
      { alarmId: this.id, advice: advice.get(), userId: alarm.userId },
      this.deps,
    );

    this.record(event);
  }

  notify() {
    const { advice } = Invariants.AlarmAdviceAvailable.enforce({ status: this.status, advice: this.advice });
    const { alarm } = Invariants.AlarmExists.enforce({ alarm: this.state });

    const event = bg.event(
      Events.AlarmNotificationRequestedEvent,
      Alarm.getStream(this.id),
      {
        alarmId: this.id,
        alarmName: alarm.detection.name,
        trigger: alarm.detection.trigger,
        userId: alarm.userId,
        advice: advice.get(),
      },
      this.deps,
    );

    this.record(event);
  }

  complete() {
    Invariants.AlarmNotificationRequested.enforce({ status: this.status });

    const event = bg.event(
      Events.AlarmNotificationSentEvent,
      Alarm.getStream(this.id),
      { alarmId: this.id },
      this.deps,
    );

    this.record(event);
  }

  cancel() {
    Invariants.AlarmIsCancellable.enforce({ status: this.status });
    const { alarm } = Invariants.AlarmExists.enforce({ alarm: this.state });

    const event = bg.event(
      Events.AlarmCancelledEvent,
      Alarm.getStream(this.id),
      { alarmId: this.id, userId: alarm.userId },
      this.deps,
    );

    this.record(event);
  }

  toSnapshot() {
    return {
      id: this.id,
      userId: this.state?.userId,
      status: this.status,
      detection: this.state?.detection,
      advice: this.advice,
    };
  }

  pullEvents(): ReadonlyArray<AlarmEventType> {
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
        this.state = {
          userId: event.payload.userId,
          detection: new VO.AlarmDetection(event.payload.trigger, event.payload.alarmName),
        };
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

  static getStream(id: VO.AlarmIdType): bg.EventStreamType {
    return v.parse(bg.EventStream, `alarm_${id}`);
  }
}
