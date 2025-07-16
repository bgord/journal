import { Password } from "../../modules/auth/value-objects/password";

export type * as types from "../../modules/auth/value-objects";

/** @public */
export class RegisterForm {
  static get() {
    return {
      password: { min: Password.MaximumLength, max: Password.MaximumLength },
    };
  }
}
