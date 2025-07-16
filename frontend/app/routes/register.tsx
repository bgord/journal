import { useState } from "react";
import { Form } from "react-router";
import { authClient } from "../../auth";

export default function SignUp() {
  const [email, setEmail] = useState("example@test.com");
  const [password, setPassword] = useState("123123123");

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("submit");
    await authClient.signUp.email(
      { email, password, name: email },
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
    <div>
      <h2>Sign Up</h2>
      <Form onSubmit={signUp}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign Up</button>
      </Form>
    </div>
  );
}
