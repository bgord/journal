import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { ShareableLinkAccess } from "+infra/adapters/publishing";
import { EventStore } from "+infra/event-store";
import * as mocks from "./mocks";

describe("ShareableLinkAccess", () => {
  test.only("true", async () => {
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const result = (await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext))
        .valid;
      expect(result).toEqual(true);
    });

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedAcceptedEvent]);
  });

  test("false - not found", async () => {
    spyOn(EventStore, "find").mockResolvedValue([]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - expired", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - revoked", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "entries", mocks.accessContext)).toEqual({
      valid: false,
    });
  });

  test("isValid - false - specification", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);

    expect(await ShareableLinkAccess.check(mocks.shareableLinkId, "other", mocks.accessContext)).toEqual({
      valid: false,
    });
  });
});
