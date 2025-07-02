import { Env } from "+infra";
import { basicAuth } from "hono/basic-auth";

export const BasicAuthShield = basicAuth({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});
