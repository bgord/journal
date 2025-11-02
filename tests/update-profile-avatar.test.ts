import { describe, expect, jest, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";
import * as Adapters from "+infra/adapters";
import { auth } from "+infra/auth";
import { EventStore } from "+infra/event-store";
import { TemporaryFile } from "+infra/temporary-file.adapter";
import { server } from "../server";
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

const file = new TextEncoder().encode(content);

const form = { "Content-Type": `multipart/form-data; boundary=${boundary}` };

describe(`POST ${url}`, () => {
  test("validation - AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    const json = await response.json();
    expect(response.status).toEqual(403);
    expect(json).toEqual({ message: bg.AccessDeniedAuthShieldError.message, _known: true });
  });

  test("validation - empty payload", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const response = await server.request(url, { method: "POST" }, mocks.ip);
    expect(response.status).toEqual(500);
  });

  test("ProfileAvatarConstraints - maxSide", async () => {
    const temporaryFileWrite = spyOn(TemporaryFile, "write");
    const temporaryFileCleanup = spyOn(TemporaryFile, "cleanup");
    spyOn(Adapters.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(3100),
      height: tools.ImageHeight.parse(3100),
      mime: new tools.Mime("image/png"),
      size: tools.Size.fromKb(100),
    });
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: file, headers: form }, mocks.ip);
    await testcases.assertInvariantError(response, Preferences.Invariants.ProfileAvatarConstraints);
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("ProfileAvatarConstraints - size", async () => {
    const temporaryFileWrite = spyOn(TemporaryFile, "write");
    const temporaryFileCleanup = spyOn(TemporaryFile, "cleanup");
    spyOn(Adapters.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: new tools.Mime("image/png"),
      size: tools.Size.fromMB(100),
    });
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: file, headers: form }, mocks.ip);
    await testcases.assertInvariantError(response, Preferences.Invariants.ProfileAvatarConstraints);
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("ProfileAvatarConstraints - mime", async () => {
    const temporaryFileWrite = spyOn(TemporaryFile, "write");
    const temporaryFileCleanup = spyOn(TemporaryFile, "cleanup");
    spyOn(Adapters.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: new tools.Mime("text/plain"),
      size: tools.Size.fromKb(100),
    });
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);

    const response = await server.request(url, { method: "POST", body: file, headers: form }, mocks.ip);
    await testcases.assertInvariantError(response, Preferences.Invariants.ProfileAvatarConstraints);
    expect(temporaryFileWrite.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
    expect(temporaryFileCleanup.mock.calls?.[0]?.[0].get()).toEqual(`${mocks.userId}.png`);
  });

  test("happy path - png", async () => {
    spyOn(Adapters.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: new tools.Mime("image/png"),
      size: tools.Size.fromKb(100),
    });
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: file, headers: { ...form, ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
  });

  test("happy path - jpeg", async () => {
    spyOn(Adapters.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: new tools.Mime("image/jpeg"),
      size: tools.Size.fromKb(100),
    });
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: file, headers: { ...form, ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
  });

  test("happy path - webp", async () => {
    spyOn(Adapters.ImageInfo, "inspect").mockResolvedValue({
      width: tools.ImageWidth.parse(100),
      height: tools.ImageHeight.parse(100),
      mime: new tools.Mime("image/jpeg"),
      size: tools.Size.fromKb(100),
    });
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const response = await server.request(
      url,
      { method: "POST", body: file, headers: { ...form, ...mocks.correlationIdHeaders } },
      mocks.ip,
    );

    expect(response.status);
    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericProfileAvatarUpdatedEvent]);
  });
});
