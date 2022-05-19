import type { Bot, EventHandlers, User } from "../../../deps.ts";
import type { HandlerOptions } from "../../../shared.ts";

interface ReadyPayload {
  shardId: number;
  v: number;
  user: User;
  guilds: bigint[];
  sessionId: string;
  shard?: number[];
  applicationId: bigint;
}

/**
 * Create ready handler
 */
const readyHandler = (options: HandlerOptions): EventHandlers["ready"] => {
  const logger = options.logger;
  const cmdMgr = options.cmdMgr;

  return async (bot: Bot, payload: ReadyPayload, _rawPayload): Promise<any> => {
    logger.info("Successfully connected to Discord!");

    // NOTE: Call this function here for test purpose.
    // TODO: Remove this function call after testing this app. :pray:
    await cmdMgr.registerGuildCommands(bot, payload.guilds);
    logger.info("finished to register guild commands");
  };
};

export { readyHandler };
