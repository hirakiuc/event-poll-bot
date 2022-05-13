import type {
  Bot,
  CreateApplicationCommand,
  MakeRequired,
} from "../../deps.ts";

import { upsertApplicationCommands } from "../../deps.ts";

import { Loggable } from "../logger/mod.ts";

const updateGuildCommands = async (
  bot: Bot,
  logger: Loggable,
): Promise<Error | void> => {
  const guildCommands: MakeRequired<CreateApplicationCommand, "name">[] = [];

  if (guildCommands.length > 0) {
    for (const guildId of bot.activeGuildIds) {
      try {
        await upsertApplicationCommands(bot, guildCommands, guildId);
      } catch (err) {
        logger.error("failed to register guild commands", err);
        return Promise.reject(err);
      }
    }
  }

  return Promise.resolve();
};

export { updateGuildCommands };
