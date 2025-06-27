import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as Emotions from "../";

export type AlarmEvent = (typeof Alarm)["events"][number];
type AlarmEventType = z.infer<AlarmEvent>;

export class Alarm {
  static events = [
    Emotions.Events.AlarmGeneratedEvent,
    Emotions.Events.AlarmAdviceSavedEvent,
    Emotions.Events.AlarmNotificationSentEvent,
    Emotions.Events.AlarmCancelledEvent,
  ];

  private readonly id: Emotions.VO.AlarmIdType;
  private status: Emotions.VO.AlarmStatusEnum = Emotions.VO.AlarmStatusEnum.started;
  // @ts-expect-error
  private generatedAt?: Emotions.VO.AlarmGeneratedAtType;

  private emotionJournalEntryId?: Emotions.VO.EmotionJournalEntryIdType;
  // @ts-expect-error
  private name?: Emotions.VO.AlarmNameOption;
  private advice?: Emotions.VO.EmotionalAdvice;

  private readonly pending: AlarmEventType[] = [];

  private constructor(id: Emotions.VO.AlarmIdType) {
    this.id = id;
  }

  static create(id: Emotions.VO.AlarmIdType): Alarm {
    return new Alarm(id);
  }

  static build(id: Emotions.VO.AlarmIdType, events: AlarmEventType[]): Alarm {
    const entry = new Alarm(id);

    events.forEach((event) => entry.apply(event));

    return entry;
  }

  async _generate(
    emotionJournalEntryId: Emotions.VO.EmotionJournalEntryIdType,
    alarmName: Emotions.VO.AlarmNameType,
  ) {
    await Emotions.Policies.AlarmGeneratedOnce.perform({ status: this.status });

    const event = Emotions.Events.AlarmGeneratedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.ALARM_GENERATED_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: {
        alarmId: this.id,
        alarmName,
        emotionJournalEntryId,
      },
    } satisfies Emotions.Events.AlarmGeneratedEventType);

    this.record(event);
  }

  async saveAdvice(advice: Emotions.VO.EmotionalAdvice) {
    await Emotions.Policies.AlarmAlreadyGenerated.perform({ status: this.status });

    const event = Emotions.Events.AlarmAdviceSavedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.ALARM_ADVICE_SAVED_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: {
        alarmId: this.id,
        advice: advice.get(),
        emotionJournalEntryId: this.emotionJournalEntryId as Emotions.VO.EmotionJournalEntryIdType,
      },
    } satisfies Emotions.Events.AlarmAdviceSavedEventType);

    this.record(event);
  }

  async notify() {
    await Emotions.Policies.AlarmAdviceAvailable.perform({
      advice: this.advice,
      status: this.status,
    });

    const event = Emotions.Events.AlarmNotificationSentEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: {
        alarmId: this.id,
        emotionJournalEntryId: this.emotionJournalEntryId as Emotions.VO.EmotionJournalEntryIdType,
      },
    } satisfies Emotions.Events.AlarmNotificationSentEventType);

    this.record(event);
  }

  async cancel() {
    await Emotions.Policies.AlarmIsCancellable.perform({ status: this.status });

    const event = Emotions.Events.AlarmCancelledEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Emotions.Events.ALARM_CANCELLED_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: { alarmId: this.id },
    } satisfies Emotions.Events.AlarmCancelledEventType);

    this.record(event);
  }

  getAdvice(): Emotions.VO.EmotionalAdvice | undefined {
    return this.advice;
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
      case Emotions.Events.ALARM_GENERATED_EVENT: {
        this.emotionJournalEntryId = event.payload.emotionJournalEntryId;
        this.name = event.payload.alarmName;
        this.status = Emotions.VO.AlarmStatusEnum.generated;
        this.generatedAt = event.createdAt;
        break;
      }

      case Emotions.Events.ALARM_ADVICE_SAVED_EVENT: {
        this.advice = new Emotions.VO.EmotionalAdvice(event.payload.advice);
        this.status = Emotions.VO.AlarmStatusEnum.advice_saved;
        break;
      }

      case Emotions.Events.ALARM_NOTIFICATION_SENT_EVENT: {
        this.status = Emotions.VO.AlarmStatusEnum.notification_sent;
        break;
      }

      case Emotions.Events.ALARM_CANCELLED_EVENT: {
        this.status = Emotions.VO.AlarmStatusEnum.cancelled;
        break;
      }

      default:
        break;
    }
  }

  static getStream(id: Emotions.VO.AlarmIdType) {
    return `alarm_${id}`;
  }
}
