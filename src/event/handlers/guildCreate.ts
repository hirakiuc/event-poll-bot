import type { Bot, EventHandlers, Guild } from "../../../deps.ts";
import type { Loggable } from "../../logger/mod.ts";

// Create a handler which is invoked when this bot will join to a discord server(= guild).
const guildCreateHandler = (
  logger: Loggable,
): EventHandlers["guildCreate"] => {
  return (_bot: Bot, _guild: Guild): any => {
    logger.debug("guildCreate");
  };
};

export { guildCreateHandler };
