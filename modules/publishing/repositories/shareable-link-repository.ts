import * as Schema from "+infra/schema";

export class ShareableLinkRepository {
  static async listExpired(): Promise<Schema.SelectShareableLinks[]> {
    return [];
  }
}
