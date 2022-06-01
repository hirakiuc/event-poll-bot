import { Oak, Status } from "../../../deps.ts";

import type { Loggable } from "../../../shared.ts";

const createErrorHandler = (logger: Loggable): Oak.Middleware => {
  return (ctx: Oak.Context, next: () => Promise<unknown>): Promise<unknown> => {
    try {
      return next();
    } catch (err) {
      if (Oak.isHttpError(err)) {
        switch (err.status) {
          case Status.NotFound:
            // handle NotFound
            return Promise.resolve();

          default:
            // handle other statuses
            return Promise.resolve();
        }
      } else {
        logger.error("unexpected error", err);

        // throw if you can't handle the error.
        ctx.response.type = "json";
        ctx.response.body = {
          message: "Internal server error",
        };
        ctx.response.status = Status.InternalServerError;

        return Promise.resolve();
      }
    }
  };
};

export { createErrorHandler };
