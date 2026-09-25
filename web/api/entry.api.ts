import * as bg from "@bgord/ui";
import type { HistoryType } from "../../app/http/history";
import type { types } from "../../app/services/home-entry-list-form";
import type { EntrySnapshotFormatted } from "../../modules/emotions/ports";

export class Entry {
  static async getList(
    request: Request | null,
    deps: { filter: types.EntryListFilterType; query: string },
  ): Promise<ReadonlyArray<EntrySnapshotFormatted>> {
    return bg.ApiClient.json<ReadonlyArray<EntrySnapshotFormatted>>("/api/entry/list", request, [], {
      method: "QUERY",
      body: JSON.stringify({ filter: deps.filter, query: deps.query ?? "" }),
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
