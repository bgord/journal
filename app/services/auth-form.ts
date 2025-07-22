import { Password } from "../../modules/auth/value-objects/password";

export type * as AuthTypes from "../../modules/auth/value-objects";

/** @public */
export class AuthForm {
  static get() {
    return {
      password: { min: Password.MinimumLength, max: Password.MaximumLength },
    };
  }
}
