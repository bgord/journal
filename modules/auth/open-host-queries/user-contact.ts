import type * as VO from "+auth/value-objects";

type EmailContact = { type: "email"; address: string };

export interface UserContactOHQ {
  getPrimary(userId: VO.UserIdType): Promise<EmailContact | undefined>;
}
