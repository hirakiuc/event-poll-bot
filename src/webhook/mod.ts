import type { Bot } from "../../deps.ts";
import type { HandlerOptions } from "../../shared.ts";

import { serve } from "../../deps.ts";

import { createMainHandler } from "./handler/main.ts";
import { createNotFoundHandler } from "./handler/notfound.ts";

const startServer = (bot: Bot, options: HandlerOptions): void => {
  return serve({
    "/": createMainHandler(bot, options),
    404: createNotFoundHandler(bot, options),
  });
};

export { startServer };
