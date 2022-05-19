import type { Bot, EventHandlers, Guild } from "../../../deps.ts";
import type { HandlerOptions } from "../../../shared.ts";

// Create a handler which is invoked when this bot will join to a discord server(= guild).
const guildCreateHandler = (
  options: HandlerOptions,
): EventHandlers["guildCreate"] => {
  const logger = options.logger;
  const cmdMgr = options.cmdMgr;

  return async (bot: Bot, guild: Guild): Promise<any> => {
    logger.debug("guildCreate Event");

    await cmdMgr.registerGuildCommands(bot, [guild.id]);
    logger.info("finished to register guild commands");
  };
};

export { guildCreateHandler };
