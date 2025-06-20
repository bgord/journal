import { basicAuth } from "hono/basic-auth";
import { Env } from "./env";

export const BasicAuthShield = basicAuth({
  username: Env.BASIC_AUTH_USERNAME,
  password: Env.BASIC_AUTH_PASSWORD,
});
