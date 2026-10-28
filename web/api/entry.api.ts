import type * as tools from "@bgord/tools";
import * as bg from "@bgord/ui";
import type { EntryListResponse } from "../../app/http/emotions/list-entries";
import type { HistoryType } from "../../app/http/history";
import type { types } from "../../app/services/home-entry-list-form";
import type { EntrySnapshotFormatted } from "../../modules/emotions/ports";
import type { EntryListCursorType } from "../../modules/emotions/value-objects/entry-list-cursor";

export class Entry {
  static async getList(
    request: Request | null,
    deps: { filter: types.EntryListFilterType; query: string },
  ): Promise<EntryListResponse> {
    return bg.ApiClient.json<EntryListResponse>(
      "/api/entry/list",
      request,
      { data: { entries: [], next: null }, count: 0 as tools.IntegerNonNegativeType },
      { method: "QUERY", body: JSON.stringify({ filter: deps.filter, query: deps.query ?? "" }) },
    );
  }

  static async getListPage(
    request: Request | null,
    deps: { filter: types.EntryListFilterType; query: string; cursor?: EntryListCursorType },
  ): Promise<EntryListResponse | null> {
    return bg.ApiClient.json<EntryListResponse | null>("/api/entry/list", request, null, {
      method: "QUERY",
      body: JSON.stringify({ filter: deps.filter, query: deps.query ?? "", cursor: deps.cursor }),
    });
  }

  static async getSharedEntries(
    request: Request | null,
    shareableLinkId: string,
  ): Promise<ReadonlyArray<EntrySnapshotFormatted>> {
    return bg.ApiClient.json<ReadonlyArray<EntrySnapshotFormatted>>(
      `/api/shared/entries/${shareableLinkId}`,
      request,
      [],
    );
  }

  static async getHistory(request: Request | null, entryId: string): Promise<ReadonlyArray<HistoryType>> {
    return bg.ApiClient.json<ReadonlyArray<HistoryType>>(`/api/history/${entryId}/list`, request, []);
  }
}

export type { EntrySnapshotFormatted } from "../../app/http/emotions/list-entries";
