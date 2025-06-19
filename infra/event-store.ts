import * as bg from "@bgord/bun";
import { and, asc, eq, inArray } from "drizzle-orm";
import { z } from "zod/v4";

import { db } from "../infra";
import * as schema from "./schema";

type GenericEventSchema = z.ZodObject<{
  id: z.ZodType<string>;
  createdAt: z.ZodType<number>;
  stream: z.ZodString;
  name: z.ZodLiteral<string>;
  version: z.ZodLiteral<number>;
  payload: z.ZodType<any>;
}>;

export class EventStore<AllEvents extends GenericEventSchema> {
  constructor() {}

  async find<AcceptedEvents extends readonly AllEvents[]>(
    acceptedEvents: AcceptedEvents,
    stream: bg.EventType["stream"],
  ): Promise<z.infer<AcceptedEvents[number]>[]> {
    const acceptedEventsNames = acceptedEvents.map((event) => event.shape.name.value);

    const rows = await db
      .select()
      .from(schema.events)
      .orderBy(asc(schema.events.createdAt))
      .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames)));

    return rows
      .map((row) => ({ ...row, payload: JSON.parse(row.payload) }))
      .map((row) => acceptedEvents.find((event) => event.shape.name.value === row.name)?.parse(row))
      .filter((event): event is z.infer<AcceptedEvents[number]> => event !== undefined);
  }

  async save(events: z.infer<AllEvents>[]) {
    await db.insert(schema.events).values(
      events.map((event) => ({
        ...event,
        payload: JSON.stringify(event.payload),
      })),
    );
  }
}
