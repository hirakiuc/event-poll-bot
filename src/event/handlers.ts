import type { EventHandlers } from "../../deps.ts";
import type { HandlerOptions } from "../../shared.ts";

import { createEventHandlers } from "../../deps.ts";

// Load handlers statically.
import {
  guildCreateHandler,
  interactionCreateHandler,
  messageCreateHandler,
  readyHandler,
} from "./handlers/mod.ts";

const eventHandlers = (options: HandlerOptions): Partial<EventHandlers> => {
  return createEventHandlers({
    guildCreate: guildCreateHandler(options),
    interactionCreate: interactionCreateHandler(options),
    messageCreate: messageCreateHandler(options),
    ready: readyHandler(options),
  });
};

export { eventHandlers };
