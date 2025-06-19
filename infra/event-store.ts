import * as bg from "@bgord/bun";
import { z } from "zod/v4";

type GenericEventSchema = z.ZodObject<{
  id: z.ZodType<string>;
  createdAt: z.ZodType<number>;
  stream: z.ZodString;
  name: z.ZodLiteral<string>;
  version: z.ZodLiteral<number>;
  payload: z.ZodType<any>;
}>;

type GenericParsedEventSchema = z.ZodObject<{
  id: z.ZodType<string>;
  createdAt: z.ZodType<number>;
  stream: z.ZodString;
  name: z.ZodLiteral<string>;
  version: z.ZodLiteral<number>;
  payload: z.ZodType<string>;
}>;

type FindEventsHandler = (
  stream: bg.EventType["stream"],
  acceptedEventsNames: string[],
) => Promise<z.infer<GenericEventSchema>[]>;

type InserterEventsHandler = (events: z.infer<GenericParsedEventSchema>[]) => Promise<void>;

type EventStoreConfigType = {
  finder: FindEventsHandler;
  inserter: InserterEventsHandler;
};

export class EventStore<AllEvents extends GenericEventSchema> {
  constructor(private readonly config: EventStoreConfigType) {}

  async find<AcceptedEvents extends readonly AllEvents[]>(
    acceptedEvents: AcceptedEvents,
    stream: bg.EventType["stream"],
  ): Promise<z.infer<AcceptedEvents[number]>[]> {
    const acceptedEventsNames = acceptedEvents.map((event) => event.shape.name.value);

    const rows = await this.config.finder(stream, acceptedEventsNames);

    return rows
      .map((row) => ({ ...row, payload: JSON.parse(row.payload) }))
      .map((row) => acceptedEvents.find((event) => event.shape.name.value === row.name)?.parse(row))
      .filter((event): event is z.infer<AcceptedEvents[number]> => event !== undefined);
  }

  async save(events: z.infer<AllEvents>[]) {
    await this.config.inserter(
      events.map((event) => ({
        ...event,
        payload: JSON.stringify(event.payload),
      })),
    );
  }
}
