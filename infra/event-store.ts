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

type InferEvents<T extends readonly GenericEventSchema[]> = z.infer<T[number]>;

export class EventStore<AllEvents extends readonly GenericEventSchema[]> {
  constructor() {}

  async find<Subset extends readonly AllEvents[number][]>(
    acceptedEvents: Subset,
    stream: bg.EventType["stream"],
  ): Promise<z.infer<Subset[number]>[]> {
    const acceptedEventsNames = acceptedEvents.map((s) => s.shape.name.value as string);

    const rows = await db
      .select()
      .from(schema.events)
      .orderBy(asc(schema.events.createdAt))
      .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, acceptedEventsNames)));

    return rows
      .map((row) => ({ ...row, payload: JSON.parse(row.payload) }))
      .map((row) => acceptedEvents.find((s) => s.shape.name.value === row.name)?.parse(row))
      .filter((e): e is z.infer<Subset[number]> => e !== undefined);
  }

  async save(events: InferEvents<AllEvents>[]) {
    await db.insert(schema.events).values(
      events.map((event) => ({
        ...event,
        payload: JSON.stringify(event.payload),
      })),
    );
  }
}
