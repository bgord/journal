import * as VO from "+auth/value-objects";

export type EmailContact = { type: "email"; address: string };

export interface UserContactPort {
  getPrimary(userId: VO.UserIdType): Promise<EmailContact | undefined>;
}
