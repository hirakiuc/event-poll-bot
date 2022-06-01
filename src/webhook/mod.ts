import { Oak, Status } from "../../deps.ts";

import type { HandlerOptions } from "../../shared.ts";

import { createCommandMiddleware } from "./middleware/command.ts";
import { createErrorHandler } from "./middleware/error.ts";
import { createVerifierMiddleware } from "./middleware/verifier.ts";

const createServer = (opts: HandlerOptions): Oak.Application => {
  const router = new Oak.Router();
  router
    .get("/", (ctx: Oak.Context) => {
      // For the health check.
      ctx.response.type = "json";
      ctx.response.body = { message: "OK" };
      ctx.response.status = Status.OK;
    });

  const app = new Oak.Application();
  app.addEventListener("error", (evt) => {
    opts.logger.error({ event: evt });
  });

  app.use(createErrorHandler(opts.logger));
  // Verify the request header when it's the POST request.
  app.use(
    createVerifierMiddleware(opts.logger, opts.config.discordBotPublicKey),
  );
  // Execute command if it's available.
  app.use(
    createCommandMiddleware(opts.cmdMgr, opts.logger),
  );
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};

export { createServer };
