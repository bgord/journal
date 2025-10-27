import { Cookies } from "@bgord/ui";
import type { AlarmSnapshot, EntrySnapshot } from "../modules/emotions/value-objects";
import type { ShareableLinkIdType } from "../modules/publishing/value-objects/";

export type EntryType = EntrySnapshot & { alarms: AlarmSnapshot[] };

async function getEntryListServer(request: Request) {
  const response = await fetch(new URL("/api/entry/list", request.url), {
    headers: { cookie: Cookies.extractFrom(request) },
    credentials: "include",
  });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

async function getEntryListClient() {
  const response = await fetch("/api/entry/list", { credentials: "include" });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

export async function getEntryList(request: Request | null): Promise<EntryType[]> {
  if (request) return getEntryListServer(request);
  return getEntryListClient();
}

async function getEntryHistoryServer(request: Request, entryId: EntrySnapshot["id"]) {
  const response = await fetch(new URL(`/api/history/${entryId}/list`, request.url), {
    headers: { cookie: Cookies.extractFrom(request) },
    credentials: "include",
  });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

async function getEntryHistoryClient(entryId: EntrySnapshot["id"]) {
  const response = await fetch(`/api/history/${entryId}/list`, { credentials: "include" });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

export async function getEntryHistory(
  request: Request | null,
  entryId: EntrySnapshot["id"],
): Promise<HistoryParsedType[]> {
  if (request) return getEntryHistoryServer(request, entryId);
  return getEntryHistoryClient(entryId);
}

export type HistoryParsedType = {
  id: string;
  operation: string;
  payload: Record<string, any>;
  subject: string;
  createdAt: number;
};

async function getSharedEntriesServer(request: Request, shareableLinkId: ShareableLinkIdType) {
  const response = await fetch(new URL(`/api/shared/entries/${shareableLinkId}`, request.url), {
    headers: { cookie: Cookies.extractFrom(request) },
    credentials: "include",
  });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

async function getSharedEntriesClient(shareableLinkId: ShareableLinkIdType) {
  const response = await fetch(`/api/shared/entries/${shareableLinkId}`, { credentials: "include" });

  if (!response?.ok) return [];

  return response.json().catch(() => {});
}

export async function getSharedEntries(
  request: Request | null,
  shareableLinkId: ShareableLinkIdType,
): Promise<EntryType[]> {
  if (request) return getSharedEntriesServer(request, shareableLinkId);
  return getSharedEntriesClient(shareableLinkId);
}
