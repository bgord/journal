import * as VO from "+auth/value-objects";

export type EmailContact = { type: "email"; address: string };

export interface UserContactOHQ {
  getPrimary(userId: VO.UserIdType): Promise<EmailContact | undefined>;
}
