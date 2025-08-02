import * as Auth from "+auth";

export class CountShareableLinksPerOwner {
  static async execute(_ownerid: Auth.VO.UserIdType): Promise<{ count: number }> {
    // TODO: Implement it
    return { count: 0 };
  }
}
