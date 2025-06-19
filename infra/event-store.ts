import { JournalEntryEventType } from "../modules/emotions/aggregates/emotion-journal-entry";
import { db } from "./db";
import * as schema from "./schema";

type AcceptedEventType = JournalEntryEventType;

export class EventStore {
  static async find(_stream: string): Promise<JournalEntryEventType[]> {
    return [];
  }

  static async save(events: AcceptedEventType[]) {
    await db.insert(schema.events).values(
      events.map((event) => ({
        ...event,
        payload: JSON.stringify(event.payload),
      })),
    );
  }
}
