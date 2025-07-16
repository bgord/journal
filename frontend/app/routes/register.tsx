import * as UI from "@bgord/ui";
import { Form } from "react-router";
import { authClient } from "../../auth";

// TODO: translations
export default function SignUp() {
  const email = UI.useField({ name: "email", defaultValue: "" });
  const password = UI.useField({ name: "password", defaultValue: "" });

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("submit");
    await authClient.signUp.email(
      { email: email.value, password: password.value, name: email.value },
      {
        onSuccess: (ctx) => {
          console.log("success");
          console.log(ctx);
        },
        onError: (ctx) => {
          console.log("err");
          console.log(ctx);
        },
      },
    );
  };

  return (
    <main data-display="flex" data-direction="column">
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

          <input className="c-input" type="text" placeholder="admin@example.com" {...email.input.props} />
        </div>

        <div data-display="flex" data-direction="column">
          <label className="c-label" {...password.label.props}>
            Password
          </label>

          <input className="c-input" type="password" placeholder="**********" {...password.input.props} />
        </div>

        <button className="c-button" data-variant="primary" data-mt="24" type="submit">
          Sign Up
        </button>
      </Form>
    </main>
  );
}
