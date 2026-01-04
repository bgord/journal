import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";
import { bootstrap } from "+infra/bootstrap";
import { registerCommandHandlers } from "+infra/register-command-handlers";
import { registerEventHandlers } from "+infra/register-event-handlers";
import { createServer } from "../server";
import * as mocks from "./mocks";
import * as testcases from "./testcases";

const url = "/api/preferences/profile-avatar/update";
const boundary = "----bun-test-boundary";
const content = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="file"; filename="image.png"',
  "Content-Type: image/png",
  "",
  "dummy-content",
  `--${boundary}--`,
  "",
].join("\r\n");
const form = { "Content-Type": `multipart/form-data; boundary=${boundary}` };
const file = new TextEncoder().encode(content);

describe(`POST ${url}`, async () => {
  const di = await bootstrap();
  registerEventHandlers(di);
  registerCommandHandlers(di);
  const server = createServer(di);

  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();

    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.ShieldAuthStrategyError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST" }, mocks.ip);

    expect(response.status).toEqual(500);
  });

  test("ProfileAvatarConstraints - maxSide", async () => {
    spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(3100),
      height: tools.ImageHeight.parse(3100),
      mime: tools.MIMES.png,
      size: tools.Size.fromKb(100),
    });
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    const temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");

    const response = await server.request(url, { method: "POST", body: file, headers: form }, mocks.ip);

    await testcases.assertInvariantError(response, Preferences.Invariants.ProfileAvatarConstraints);
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("ProfileAvatarConstraints - size", async () => {
    spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: tools.MIMES.png,
      size: tools.Size.fromMB(100),
    });
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    const temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");

    const response = await server.request(url, { method: "POST", body: file, headers: form }, mocks.ip);

    await testcases.assertInvariantError(response, Preferences.Invariants.ProfileAvatarConstraints);
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("ProfileAvatarConstraints - mime", async () => {
    spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: tools.MIMES.text,
      size: tools.Size.fromKb(100),
    });
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const temporaryFileWrite = spyOn(di.Adapters.System.TemporaryFile, "write");
    const temporaryFileCleanup = spyOn(di.Adapters.System.TemporaryFile, "cleanup");

    const response = await server.request(url, { method: "POST", body: file, headers: form }, mocks.ip);

    await testcases.assertInvariantError(response, Preferences.Invariants.ProfileAvatarConstraints);
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("happy path - png", async () => {
    spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: tools.MIMES.png,
      size: tools.Size.fromKb(100),
    });
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const imageProcessorProcess = spyOn(di.Adapters.System.ImageProcessor, "process");
    const remoteFileStoragePutFromPath = spyOn(di.Adapters.System.RemoteFileStorage, "putFromPath");
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: file, headers: { ...form, ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
    expect(imageProcessorProcess).toHaveBeenCalledWith({
      maxSide: 256,
      strategy: "in_place",
      to: "webp",
      // @ts-expect-error
      input: expect.any(tools.FilePathAbsolute),
    });
    expect(remoteFileStoragePutFromPath).toHaveBeenCalledWith({
      key: mocks.objectKey,
      // @ts-expect-error
      path: expect.any(tools.FilePathAbsolute),
    });
  });

  test("happy path - jpeg", async () => {
    spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: tools.MIMES.jpeg,
      size: tools.Size.fromKb(100),
    });
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: file, headers: { ...form, ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
  });

  test("happy path - webp", async () => {
    spyOn(di.Adapters.System.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: tools.MIMES.jpeg,
      size: tools.Size.fromKb(100),
    });
    spyOn(di.Tools.Auth.config.api, "getSession").mockResolvedValue(mocks.auth);
    const eventStoreSave = spyOn(di.Tools.EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: file, headers: { ...form, ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
  });
});
