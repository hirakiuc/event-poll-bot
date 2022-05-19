import type { Bot, EventHandlers, User } from "../../../deps.ts";
import type { Loggable } from "../../logger/mod.ts";

import { registerGuildCommands } from "../../command/mod.ts";

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
const readyHandler = (logger: Loggable): EventHandlers["ready"] => {
  return async (bot: Bot, payload: ReadyPayload, _rawPayload): Promise<any> => {
    logger.info("Successfully connected to Discord!");

    // NOTE: Call this function here for test purpose.
    // TODO: Remove this function call after testing this app. :pray:
    await registerGuildCommands(bot, payload.guilds, logger);
    logger.info("finished to register guild commands");
  };
};

export { readyHandler };
