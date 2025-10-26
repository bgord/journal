import { Cookies } from "@bgord/ui";
import type { EntrySnapshot } from "../modules/emotions/value-objects";

async function getEntryListServer(request: Request) {
  const response = await fetch(new URL("/api/entry/list-entries", request.url), {
    headers: { cookie: Cookies.extractFrom(request) },
    credentials: "include",
  });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

async function getEntryListClient() {
  const response = await fetch("/api/entry/list-entries", { credentials: "include" });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

export async function getEntryList(request: Request | null): Promise<EntrySnapshot[]> {
  if (request) return getEntryListServer(request);
  return getEntryListClient();
}
