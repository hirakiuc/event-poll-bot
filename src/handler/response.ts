import { Context } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { Status } from "https://deno.land/std@0.137.0/http/http_status.ts";

const jsonResponse = (
  ctx: Context,
  jsonobj: Parameters<typeof JSON.stringify>[0],
  init?: ResponseInit,
): void => {
  const headers = init?.headers instanceof Headers
    ? init.headers
    : new Headers(init?.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }

  // TODO: merge the headers to ctx.response.headers

  ctx.response.type = "json";
  ctx.response.body = jsonobj;

  ctx.response.status = init?.status ?? Status.OK;
};

const json = (
  ctx: Context,
  jsonobj: Parameters<typeof JSON.stringify>[0],
): void => {
  jsonResponse(ctx, jsonobj, {
    status: Status.OK,
  });
};

const failed = (
  ctx: Context,
  jsonobj: Parameters<typeof JSON.stringify>[0],
  status: Status,
): void => {
  jsonResponse(ctx, jsonobj, {
    status: status,
  });
};

export { failed, json };
