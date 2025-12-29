import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/api/preferences/profile-avatar";

describe(`DELETE ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "DELETE" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("happy path", async () => {
    spyOn(di.Adapters.System.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const remoteFileStorageDelete = spyOn(di.Adapters.System.RemoteFileStorage, "delete").mockImplementation(
      jest.fn(),
    );
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

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
