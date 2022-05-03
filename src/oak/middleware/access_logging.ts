import { Context } from "../../../deps.ts";

import { Logger } from "../../logger/mod.ts";

const HeaderXResponseTime = "X-Response-Time";
const HeaderUserAgent = "User-Agent";

const access_logging = async (ctx: Context, next: any) => {
  const start = Date.now();
  await next();
  const ms: number = Date.now() - start;
  // Set X-Response-Time response header
  ctx.response.headers.set(HeaderXResponseTime, `${ms}ms`);

  const ua = ctx.request.headers.get(HeaderUserAgent);

  const req = {
    path: ctx.request.url.pathname,
    method: ctx.request.method,
    useragent: ua,
    ipaddress: ctx.request.ips,
  };

  const res = {
    status: ctx.response.status,
  };

  const duration = {
    duration: ms,
  };

  Logger.debug({
    request: req,
    response: res,
    duration: duration,
  });
};

export { access_logging };
