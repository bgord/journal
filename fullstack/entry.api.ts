import { Cookies } from "@bgord/ui";
import type { AlarmSnapshot, EntrySnapshot } from "../modules/emotions/value-objects";
import type { ShareableLinkIdType } from "../modules/publishing/value-objects/";

export type EntryType = EntrySnapshot & { alarms: AlarmSnapshot[] };

export type HistoryParsedType = {
  id: string;
  operation: string;
  payload: Record<string, any>;
  subject: string;
  createdAt: number;
};

export class Entry {
  static async getList(request: Request | null): Promise<EntryType[]> {
    const BASE = "/api/entry/list";

    const url = request ? new URL(BASE, request.url) : BASE;
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }

  static async getSharedEntries(
    request: Request | null,
    shareableLinkId: ShareableLinkIdType,
  ): Promise<Promise<EntryType[]>> {
    const BASE = `/api/shared/entries/${shareableLinkId}`;

    const url = request ? new URL(BASE, request.url) : BASE;
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }

  static async getHistory(
    request: Request | null,
    entryId: EntrySnapshot["id"],
  ): Promise<HistoryParsedType[]> {
    const BASE = `/api/history/${entryId}/list`;

    const url = request ? new URL(BASE, request.url) : BASE;
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch(() => {});
  }
}
