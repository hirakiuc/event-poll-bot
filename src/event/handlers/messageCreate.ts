import type { Bot, EventHandlers, Message } from "../../../deps.ts";
import type { Loggable } from "../../logger/mod.ts";

import { sendMessage } from "../../../deps.ts";

const messageCreateHandler = (
  logger: Loggable,
): EventHandlers["messageCreate"] => {
  return (bot: Bot, message: Message): any => {
    logger.debug({ message });

    if (message.content == "Hello") {
      sendMessage(bot, message.channelId, {
        content: "Hi!",
      });
    } else {
      logger.debug("ignore a message...");
    }
  };
};

export { messageCreateHandler };
