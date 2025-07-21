// infra/adapter.ts  (works on Bun, Deno, Node, Cloudflare)

import type { Handler, Env as HonoEnv } from "hono";
import { ZodTypeAny } from "zod";

type RouteShape = {
  pathParams?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
  headers?: ZodTypeAny;
};

type Infer<T> = T extends ZodTypeAny ? ReturnType<T["parse"]> : never;

export type Validated<TRoute extends RouteShape> = {
  params: Infer<NonNullable<TRoute["pathParams"]>>;
  query: Infer<NonNullable<TRoute["query"]>>;
  body: Infer<NonNullable<TRoute["body"]>>;
  headers: Infer<NonNullable<TRoute["headers"]>>;
};

const badRequest = (err: any) =>
  new Response(JSON.stringify({ error: err.flatten?.() }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });

export function adopt<TRoute extends RouteShape, THonoEnv extends HonoEnv = HonoEnv>(
  route: TRoute,
  domain: (v: Validated<TRoute>, c: Parameters<Handler<THonoEnv>>[0]) => Promise<Response> | Response,
): Handler<THonoEnv> {
  return async (c) => {
    try {
      const params = route.pathParams?.parse?.(c.req.param()) ?? undefined;

      const query = route.query?.parse?.(c.req.query()) ?? undefined;

      const body =
        route.body?.parse?.(
          await (async () => {
            try {
              return await c.req.json();
            } catch {
              return {};
            }
          })(),
        ) ?? undefined;

      const headers = route.headers?.parse?.(c.req.raw.headers.toJSON()) ?? undefined;

      return await domain({ params, query, body, headers } as Validated<TRoute>, c);
    } catch (err) {
      if ((err as any)?.flatten) return badRequest(err);
      throw err;
    }
  };
}
