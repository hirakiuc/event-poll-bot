import type { EventHandlers } from "../../../deps.ts";
import type { Loggable } from "../../logger/mod.ts";

/**
 * Create ready handler
 */
const readyHandler = (logger: Loggable): EventHandlers["ready"] => {
  return (): any => {
    logger.info("Successfully connected to Discord!");
  };
};

export { readyHandler };
