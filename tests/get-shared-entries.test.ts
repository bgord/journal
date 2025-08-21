import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { EntriesSharing } from "+infra/adapters/emotions";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";

const url = `/shared/entries/${mocks.shareableLinkId}`;

describe(`GET ${url}`, () => {
  test("validation - incorrect id", async () => {
    const response = await server.request(
      "/shared/entries/id",
      { method: "GET", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - expired", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    spyOn(Date, "now").mockReturnValue(mocks.accessContext.timestamp);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        {
          method: "GET",
          headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
        },
        mocks.ip,
      );

      expect(response.status).toBe(403);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedExpiredEvent]);
    });
  });

  test("validation - revoked", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    spyOn(Date, "now").mockReturnValue(mocks.accessContext.timestamp);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        {
          method: "GET",
          headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
        },
        mocks.ip,
      );
      expect(response.status).toBe(403);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedRevokedEvent]);
    });
  });

  test("happy path", async () => {
    spyOn(EntriesSharing, "listForOwnerInRange").mockResolvedValue([]);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    spyOn(Date, "now").mockReturnValue(mocks.accessContext.timestamp);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const response = await server.request(
        url,
        {
          method: "GET",
          headers: new Headers({ "x-correlation-id": mocks.correlationId, ...mocks.revisionHeaders() }),
        },
        mocks.ip,
      );
      expect(response.status).toBe(200);
      expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkAccessedAcceptedEvent]);
    });
  });
});
