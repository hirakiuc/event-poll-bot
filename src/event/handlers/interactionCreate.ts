import type { Bot, EventHandlers, Interaction } from "../../../deps.ts";
import type { HandlerOptions } from "../../../shared.ts";

import { sendMessage } from "../../../deps.ts";

const interactionCreateHandler = (
  options: HandlerOptions,
): EventHandlers["interactionCreate"] => {
  const logger = options.logger;

  return (bot: Bot, interaction: Interaction): any => {
    logger.debug({ interaction });

    if (!interaction.channelId) {
      logger.debug("this app does not support DM, yet");
      return Promise.resolve();
    }

    const channelId = interaction.channelId;
    sendMessage(bot, channelId, {
      content: "Hi!, I received your request, but not implemented yet.",
    });
  };
};

export { interactionCreateHandler };
