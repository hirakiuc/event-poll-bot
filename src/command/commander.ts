import type {
  Bot,
  CreateApplicationCommand,
  MakeRequired,
} from "../../deps.ts";

import { upsertApplicationCommands } from "../../deps.ts";

import { Loggable } from "../logger/mod.ts";
import { createEventPollCommand } from "./eventpoll/eventpoll.ts";

const registerGuildCommands = async (
  bot: Bot,
  guildIds: bigint[],
  logger: Loggable,
): Promise<Error | void> => {
  const guildCommands: MakeRequired<CreateApplicationCommand, "name">[] = [
    createEventPollCommand(logger),
  ];

  if (guildCommands.length > 0) {
    for (const guildId of guildIds) {
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

export { registerGuildCommands };
