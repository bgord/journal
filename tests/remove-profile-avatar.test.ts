import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Adapters from "+infra/adapters";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/api/preferences/profile-avatar";

describe(`DELETE ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const remoteFileStorageDelete = spyOn(Adapters.RemoteFileStorage, "delete").mockImplementation(jest.fn());
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "DELETE", headers: mocks.correlationIdHeaders },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarRemovedEvent]);
    expect(remoteFileStorageDelete).toHaveBeenCalledWith(mocks.objectKey);
  });
});
