import { Oak, Status } from "../../deps.ts";

const json = (ctx: Oak.Context, msg: any, status: Status): Promise<unknown> => {
  ctx.response.type = "json";
  ctx.response.body = msg;
  ctx.response.status = status;

  return Promise.resolve();
};

const success = (ctx: Oak.Context, msg: any): Promise<unknown> => {
  return json(ctx, msg, Status.OK);
};

export { json, success };
