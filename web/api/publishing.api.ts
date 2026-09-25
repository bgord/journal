import * as bg from "@bgord/ui";
import type { ShareableLinkSnapshot } from "../../modules/publishing/value-objects";

export class Publishing {
  static async listShareableLinks(request: Request | null): Promise<ReadonlyArray<ShareableLinkSnapshot>> {
    return bg.ApiClient.json<ReadonlyArray<ShareableLinkSnapshot>>("/api/publishing/links/list", request, []);
  }
}

export type { ShareableLinkSnapshot } from "../../modules/publishing/value-objects";
