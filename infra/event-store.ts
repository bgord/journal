import * as bg from "@bgord/bun";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import {
  JournalEntryEvent,
  JournalEntryEventType,
} from "../modules/emotions/aggregates/emotion-journal-entry";
import { db } from "./db";
import * as schema from "./schema";

type AcceptedEvent = JournalEntryEvent;
type AcceptedEventType = JournalEntryEventType;

export class EventStore {
  static async find<T extends AcceptedEvent[]>(
    acceptedEvents: T,
    stream: bg.EventType["stream"],
  ): Promise<z.infer<T[number]>[]> {
    const acceptedEventNames = acceptedEvents.flatMap((acceptedEvent) =>
      acceptedEvent.def.shape.name.def.values.flat(),
    );

    const events = await db
      .select()
      .from(schema.events)
      .orderBy(asc(schema.events.createdAt))
      .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventNames)));

    return events
      .map((event) => ({ ...event, payload: JSON.parse(event.payload) }))
      .map((event) => {
        const parser = acceptedEvents.find((acceptedEvent) => acceptedEvent.shape.name.value === event.name);

        return parser ? parser.parse(event) : undefined;
      })
      .filter((event): event is z.infer<T[number]> => event !== undefined);
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
