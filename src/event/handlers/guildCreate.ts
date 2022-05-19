import type { Bot, EventHandlers, Guild } from "../../../deps.ts";
import type { Loggable } from "../../logger/mod.ts";

import { registerGuildCommands } from "../../command/mod.ts";

// Create a handler which is invoked when this bot will join to a discord server(= guild).
const guildCreateHandler = (
  logger: Loggable,
): EventHandlers["guildCreate"] => {
  return async (bot: Bot, guild: Guild): Promise<any> => {
    logger.debug("guildCreate Event");

    await registerGuildCommands(bot, [guild.id], logger);
    logger.info("finished to register guild commands");
  };
};

export { guildCreateHandler };
