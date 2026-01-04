import { expect } from "bun:test";

export async function assertInvariantError(response: Response, code: number, message: string) {
  const json = await response.json();

  expect(response.status).toEqual(code);
  expect(json).toEqual({ message, _known: true });
}
