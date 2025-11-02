import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Publishing from "+publishing";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = `/api/publishing/link/${mocks.shareableLinkId}/revoke`;

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - incorrect id", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(
      "/api/publishing/link/id/revoke",
      { method: "POST", headers: mocks.revisionHeaders() },
      mocks.ip,
    );
    const json = await response.json();
    expect(response.status).toEqual(400);
    expect(json).toEqual({ message: "payload.invalid.error", _known: true });
  });

  test("validation - ShareableLinkIsActive - already expired", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkExpiredEvent,
    ]);
    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(2) },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Publishing.Invariants.ShareableLinkIsActive);
  });

  test("validation - ShareableLinkIsActive - already revoked", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([
      mocks.GenericShareableLinkCreatedEvent,
      mocks.GenericShareableLinkRevokedEvent,
    ]);
    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(2) },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Publishing.Invariants.ShareableLinkIsActive);
  });

  test("validation - RequesterOwnsShareableLink", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.anotherAuth);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    const response = await server.request(
      url,
      { method: "POST", headers: mocks.revisionHeaders(1) },
      mocks.ip,
    );
    await testcases.assertInvariantError(response, Publishing.Invariants.RequesterOwnsShareableLink);
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(EventStore, "find").mockResolvedValue([mocks.GenericShareableLinkCreatedEvent]);
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());
    const response = await server.request(
      url,
      {
        method: "POST",
        headers: mocks.correlationIdAndRevisionHeaders(),
      },
      mocks.ip,
    );
    expect(response.status).toEqual(200);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericShareableLinkRevokedEvent]);
  });
});
