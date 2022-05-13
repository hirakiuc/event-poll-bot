import type { EventHandlers } from "../../../deps.ts";
import type { Loggable } from "../../logger/mod.ts";

import { createEventHandlers } from "../../../deps.ts";

// Load handlers statically.
import { readyHandler } from "./ready.ts";
import { messageCreateHandler } from "./messageCreate.ts";

const eventHandlers = (logger: Loggable): EventHandlers => {
  return createEventHandlers({
    ready: readyHandler(logger),
    messageCreate: messageCreateHandler(logger),
  });
};

export { eventHandlers };
