import type { Bot, EventHandlers, Message } from "../../../deps.ts";
import type { HandlerOptions } from "../../../shared.ts";

import { sendMessage } from "../../../deps.ts";

const messageCreateHandler = (
  options: HandlerOptions,
): EventHandlers["messageCreate"] => {
  const logger = options.logger;

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
