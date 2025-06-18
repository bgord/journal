import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import { server } from "../server";
import * as mocks from "./mocks";

describe("POST /log-situation", () => {
  test("validation - empty payload", async () => {
    const response = await server.request("/emotions/log-situation", { method: "POST" }, mocks.ip);

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationDescription.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing kind and location", async () => {
    const response = await server.request(
      "/emotions/log-situation",
      {
        method: "POST",
        body: JSON.stringify({ description: "Something happened" }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationLocation.Errors.invalid,
      _known: true,
    });
  });

  test("validation - missing kind", async () => {
    const response = await server.request(
      "/emotions/log-situation",
      {
        method: "POST",
        body: JSON.stringify({
          description: "Something happened",
          location: "work",
        }),
      },
      mocks.ip,
    );

    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      message: Emotions.VO.SituationKind.Errors.invalid,
      _known: true,
    });
  });
});
