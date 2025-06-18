import { JournalEntryEventType } from "../modules/emotions/aggregates/emotion-journal-entry";

export class EventStore {
  static async find(_stream: string): Promise<JournalEntryEventType[]> {
    return [];
  }
}
