import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as mocks from "./mocks";

describe("ACCOUNT_CREATED_EVENT", () => {
  test("happy path", () => {
    const input = {
      id: mocks.correlationId,
      correlationId: mocks.correlationId,
      name: "ACCOUNT_CREATED_EVENT",
      payload: { userId: mocks.userId, timestamp: mocks.T0.ms },
      createdAt: mocks.T0.ms,
      stream: v.parse(bg.EventStream, `user_${mocks.userId}`),
      version: 1,
      commit: mocks.commit,
    } as const;

    const event = v.safeParse(
      Auth.Events.AccountCreatedEvent,
      input satisfies Auth.Events.AccountCreatedEventType,
    );

    expect(event.success).toEqual(true);
    expect(event.output).toEqual(input);
  });
});
