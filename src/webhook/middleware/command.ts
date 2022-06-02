import type { Interaction } from "../../../deps.ts";

import type {
  CommandRegistry,
  ExecResult,
  Executor,
  Loggable,
} from "../../../shared.ts";

import {
  InteractionResponseTypes,
  InteractionTypes,
  Oak,
  Status,
} from "../../../deps.ts";

import { json, success } from "../response.ts";

interface Processable {
  // interaction & argument should be given on creating the instance of a Command object.
  beforeProcess(ctx: Oak.Context): Promise<Error | void>;
  process(ctx: Oak.Context): Promise<Error | void>;
  afterProcess(ctx: Oak.Context): Promise<Error | void>;
}

interface Argument {
  name: string;
  value: any;
  type: string;
}

const setResponse = (ctx: Oak.Context, result: ExecResult): void => {
  if (result instanceof Error) {
    json(ctx, { error: "Internal server error" }, Status.InternalServerError);
    return;
  }

  if (result instanceof Response) {
    json(ctx, result.body, result.status);
    return;
  }
};

const processCommand = async (
  ctx: Oak.Context,
  executor: Executor,
  next: () => Promise<unknown>,
): Promise<unknown> => {
  const before = await executor.beforeExec();
  if (before) {
    setResponse(ctx, before);
    return await next();
  }

  const ret = await executor.execute();
  if (ret) {
    setResponse(ctx, ret);
  }
  if (ret instanceof Error) {
    return await next();
  }

  const after = await executor.afterExec();
  if (after) {
    setResponse(ctx, after);
  }

  return await next();
};

const createCommandMiddleware = (
  cmdMgr: CommandRegistry,
  logger: Loggable,
): Oak.Middleware => {
  return async (
    ctx: Oak.Context,
    next: () => Promise<unknown>,
  ): Promise<unknown> => {
    const req = ctx.request;
    if (req.method !== "POST" || req.url.pathname !== "/") {
      logger.debug(
        "[command] it's not a POST request to the root path. ignore",
      );
      return await next();
    }

    // Invoke command when the POST request was sent to the "/"
    // (the body value has already been parsed by oak.)
    // TOOD: validation for the result is needed. (not type safe)
    const interaction = await ctx.request.body().value as Interaction;
    switch (interaction.type) {
      case InteractionTypes.Ping: {
        success(ctx, {
          type: InteractionResponseTypes.Pong,
        });
        return await next();
      }
      case InteractionTypes.ApplicationCommand: {
        const cmd = await cmdMgr.getCommand(interaction);
        if (cmd instanceof Error) {
          // BadRequest
          json(ctx, { error: cmd.message }, Status.BadRequest);
          return await next();
        }
        const executor = cmd.getExecutor(interaction);
        if (executor instanceof Error) {
          json(ctx, { error: executor.message }, Status.InternalServerError);
          return await next();
        }

        return await processCommand(ctx, executor, next);
      }
      default: {
        logger.warn(`Unexpected interaction type:${interaction.type}`);
        json(ctx, { error: "Bad request" }, Status.BadRequest);
        return await next();
      }
    }
  };
};

export { createCommandMiddleware };
