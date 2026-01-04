import { describe, expect, test } from "bun:test";
import * as Auth from "+auth";
import * as mocks from "./mocks";

describe("ACCOUNT_DELETED_EVENT", () => {
  test("happy path", () => {
    const input = {
      id: mocks.correlationId,
      correlationId: mocks.correlationId,
      name: "ACCOUNT_DELETED_EVENT",
      payload: { userId: mocks.userId, timestamp: mocks.T0.ms },
      createdAt: mocks.T0.ms,
      stream: `user_${mocks.userId}`,
      version: 1,
    } as const;

    const event = Auth.Events.AccountDeletedEvent.safeParse(
      input satisfies Auth.Events.AccountDeletedEventType,
    );

    expect(event.success).toEqual(true);
    expect(event.data).toEqual(input);
  });
});
