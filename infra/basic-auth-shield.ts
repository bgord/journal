import { Env } from "+infra/env";
import { basicAuth } from "hono/basic-auth";

export const BasicAuthShield = basicAuth({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});
