import { describe, expect, spyOn, test } from "bun:test";
import * as Adapters from "+infra/adapters";
import { auth } from "+infra/auth";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/api/profile-avatar/get";

describe(`GET ${url}`, () => {
  test("AccessDeniedAuthShieldError", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const body = await response.json();
    expect(response.status).toBe(403);
    expect(body._known).toBe(true);
  });

  test("404 when object does not exist (head.exists=false)", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    const headSpy = spyOn(Adapters.RemoteFileStorage, "head").mockResolvedValue({ exists: false });
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    expect(headSpy).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(404);
  });

  test("304 when If-None-Match matches current ETag", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.RemoteFileStorage, "head").mockResolvedValue(mocks.head);
    const getStreamSpy = spyOn(Adapters.RemoteFileStorage, "getStream");

    const response = await server.request(
      url,
      { method: "GET", headers: { "If-None-Match": mocks.head.etag } },
      mocks.ip,
    );

    expect(response.status).toBe(304);
    expect(getStreamSpy).not.toHaveBeenCalled();
  });

  test("200 streams avatar with correct headers", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.RemoteFileStorage, "head").mockResolvedValue(mocks.head);

    const fakeStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3, 4, 5]));
        controller.close();
      },
    });
    spyOn(Adapters.RemoteFileStorage, "getStream").mockResolvedValue(fakeStream);

    const response = await server.request(url, { method: "GET" }, mocks.ip);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/webp");
    expect(response.headers.get("ETag")).toBe(mocks.head.etag);
    expect(response.headers.get("Content-Length")).toBe(mocks.head.size.toBytes().toString());
    expect(response.headers.get("Last-Modified")).toBe(new Date(mocks.head.lastModified).toUTCString());
    +expect(response.headers.get("Cache-Control")).toBe("private, max-age=0, must-revalidate");

    const arrBuf = await response.arrayBuffer();
    expect(new Uint8Array(arrBuf)).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
  });

  test("404 when stream is not available even if head.exists=true", async () => {
    spyOn(auth.api, "getSession").mockResolvedValue(mocks.auth);
    spyOn(Adapters.RemoteFileStorage, "head").mockResolvedValue(mocks.head);
    spyOn(Adapters.RemoteFileStorage, "getStream").mockResolvedValue(null);

    const response = await server.request(url, { method: "GET" }, mocks.ip);
    expect(response.status).toBe(404);
  });
});
