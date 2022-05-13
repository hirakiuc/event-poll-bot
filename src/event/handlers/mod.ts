import type { EventHandlers } from "../../../deps.ts";
import type { Loggable } from "../../logger/mod.ts";

import { createEventHandlers } from "../../../deps.ts";

// Load handlers statically.
import { readyHandler } from "./ready.ts";
import { messageCreateHandler } from "./messageCreate.ts";
import { guildCreateHandler } from "./guildCreate.ts";

const eventHandlers = (logger: Loggable): EventHandlers => {
  return createEventHandlers({
    guildCreate: guildCreateHandler(logger),
    messageCreate: messageCreateHandler(logger),
    ready: readyHandler(logger),
  });
};

export { eventHandlers };
