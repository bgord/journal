import { Cookies } from "@bgord/ui";
import type { HistoryType } from "../../app/http/history";
import type { types } from "../../app/services/home-entry-list-form";
import type { EntrySnapshotFormatted } from "../../modules/emotions/ports";
import type { ShareableLinkIdType } from "../../modules/publishing/value-objects/";
import { absoluteUrl } from "./url";

export class Entry {
  static async getList(
    request: Request | null,
    deps: { filter: types.EntryListFilterType; query: string },
  ): Promise<EntrySnapshotFormatted[]> {
    const BASE = `/api/entry/list?filter=${deps.filter}&query=${deps.query ?? ""}`;

    console.log({ BASE });
    const url = absoluteUrl(BASE, request);
    console.log({ url });
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;
    console.log({ headers });

    const response = await fetch(url, { headers, credentials: "include" });
    console.log(response);

    if (!response?.ok) return [];
    return response.json().catch();
  }

  static async getSharedEntries(
    request: Request | null,
    shareableLinkId: ShareableLinkIdType,
  ): Promise<Promise<EntrySnapshotFormatted[]>> {
    const BASE = `/api/shared/entries/${shareableLinkId}`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }

  static async getHistory(
    request: Request | null,
    entryId: EntrySnapshotFormatted["id"],
  ): Promise<HistoryType[]> {
    const BASE = `/api/history/${entryId}/list`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch(() => {});
  }
}

export type { EntrySnapshotFormatted } from "../../app/http/emotions/list-entries";
