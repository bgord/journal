import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { z } from "zod/v4";

import * as Events from "../events";
import * as VO from "../value-objects";

export type AlarmEvent = (typeof Alarm)["events"][number];
type AlarmEventType = z.infer<AlarmEvent>;

export class Alarm {
  static events = [Events.AlarmGeneratedEvent];

  private readonly id: VO.AlarmIdType;
  private status: VO.AlarmStatusEnum = VO.AlarmStatusEnum.started;

  private emotionJournalEntryId?: VO.EmotionJournalEntryIdType;
  private name?: VO.AlarmNameOption;

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

  async generate(emotionJournalEntryId: VO.EmotionJournalEntryIdType, alarmName: VO.AlarmNameType) {
    const event = Events.AlarmGeneratedEvent.parse({
      id: bg.NewUUID.generate(),
      createdAt: tools.Timestamp.parse(Date.now()),
      name: Events.ALARM_GENERATED_EVENT,
      stream: Alarm.getStream(this.id),
      version: 1,
      payload: {
        alarmId: this.id,
        alarmName,
        emotionJournalEntryId,
      },
    } satisfies Events.AlarmGeneratedEventType);

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
        this.emotionJournalEntryId = event.payload.emotionJournalEntryId;
        this.name = event.payload.alarmName;
        break;
      }

      default:
        break;
    }
  }

  static getStream(id: VO.AlarmIdType) {
    return `alarm_${id}`;
  }
}
