type ShareableLinkType = { id: string; revision: number };

export class ShareableLinkRepository {
  static async listExpired(): Promise<ShareableLinkType[]> {
    return [];
  }
}
