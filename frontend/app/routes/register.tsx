import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import { Form, Link } from "react-router";
import { authClient } from "../../auth";

enum SignUpState {
  idle = "idle",
  success = "success",
  error = "error",
}

// TODO: translations
export default function SignUp() {
  const [state, setState] = React.useState<SignUpState>(SignUpState.idle);

  const email = UI.useField({ name: "email", defaultValue: "" });
  const password = UI.useField({ name: "password", defaultValue: "" });

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();

    await authClient.signUp.email(
      { email: email.value, password: password.value, name: email.value },
      {
        onSuccess: () => setState(SignUpState.success),
        onError: () => setState(SignUpState.error),
      },
    );
  };

  return (
    <main data-display="flex" data-direction="column" data-gap="24">
      <Form
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-mx="auto"
        data-p="48"
        data-pt="24"
        data-bc="gray-200"
        data-bw="1"
        data-br="4"
        data-shadow="sm"
        onSubmit={signUp}
        style={{ ...UI.Rhythm(400).times(1).width, ...UI.Colorful("surface-card").background }}
      >
        <legend data-fs="24" data-transform="center">
          Register
        </legend>

        <div data-display="flex" data-direction="column">
          <label className="c-label" {...email.label.props}>
            Email
          </label>

          <input
            className="c-input"
            type="email"
            placeholder="admin@example.com"
            disabled={state === SignUpState.success}
            {...email.input.props}
          />
        </div>

        <div data-display="flex" data-direction="column">
          <label className="c-label" {...password.label.props}>
            Password
          </label>

          <input
            className="c-input"
            type="password"
            placeholder="**********"
            disabled={state === SignUpState.success}
            {...password.input.props}
          />
        </div>

        <button
          className="c-button"
          data-variant="primary"
          data-mt="24"
          type="submit"
          disabled={UI.Fields.allUnchanged([email, password]) || state === SignUpState.success}
        >
          Sign Up
        </button>

        {state === SignUpState.success && (
          <div
            data-display="flex"
            data-main="baseline"
            data-gap="12"
            data-mt="24"
            data-mx="auto"
            data-bg="green-100"
            data-color="green-600"
            data-py="12"
            data-px="24"
          >
            <Icons.CheckCircle height={20} width={20} />
            Account created successfully!
            <br />
            <span>
              Check your inbox and{" "}
              <Link data-transform="center" to="/login">
                login
              </Link>
            </span>
          </div>
        )}

        {state === SignUpState.error && (
          <div
            data-display="flex"
            data-gap="12"
            data-mt="24"
            data-mx="auto"
            data-bg="red-100"
            data-color="red-600"
            data-p="12"
          >
            <Icons.WarningCircle height={20} width={20} />
            Error while creating an account
          </div>
        )}
      </Form>
    </main>
  );
}
