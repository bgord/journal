import * as bg from "@bgord/bun";
import * as v from "valibot";

type EnvelopeDeps = { IdProvider: bg.IdProviderPort; Clock: bg.ClockPort };

export function command<Schema extends v.ObjectSchema<any, any>>(
  schema: Schema,
  fields: Omit<v.InferOutput<Schema>, "id" | "correlationId" | "createdAt" | "name">,
  deps: EnvelopeDeps,
): v.InferOutput<Schema> {
  return v.parse(schema, {
    ...bg.createCommandEnvelope(deps),
    name: (schema.entries as { name: { literal: string } }).name.literal,
    ...fields,
  });
}

export function event<Schema extends v.ObjectSchema<any, any>>(
  schema: Schema,
  stream: bg.EventStreamType,
  payload: v.InferOutput<Schema>["payload"],
  deps: EnvelopeDeps,
): v.InferOutput<Schema> {
  return v.parse(schema, {
    ...bg.createEventEnvelope(stream, deps),
    name: (schema.entries as { name: { literal: string } }).name.literal,
    payload,
  });
}
