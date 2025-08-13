import * as Repos from "+emotions/repositories";
import { EventStore } from "+infra/event-store";
import { describe, expect, spyOn, test } from "bun:test";
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
    const response = await server.request(url, { method: "GET", headers: mocks.revisionHeaders() }, mocks.ip);

    expect(response.status).toBe(403);
  });

  test("validation - revoked", async () => {
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const response = await server.request(url, { method: "GET", headers: mocks.revisionHeaders() }, mocks.ip);

    expect(response.status).toBe(403);
  });

  test("happy path", async () => {
    spyOn(Repos.EntryRepository, "listShared").mockResolvedValue([]);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const response = await server.request(url, { method: "GET", headers: mocks.revisionHeaders() }, mocks.ip);

    expect(response.status).toBe(200);
  });
});
