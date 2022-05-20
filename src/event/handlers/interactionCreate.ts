import type { Bot, EventHandlers, Interaction } from "../../../deps.ts";
import type { HandlerOptions } from "../../../shared.ts";

import { sendMessage } from "../../../deps.ts";

const interactionCreateHandler = (
  options: HandlerOptions,
): EventHandlers["interactionCreate"] => {
  const logger = options.logger;
  const cmdMgr = options.cmdMgr;

  return async (
    bot: Bot,
    interaction: Interaction,
  ): Promise<Error | unknown> => {
    if (!interaction.channelId) {
      // TODO: Send a reply to the interaction event.
      logger.debug("this app does not support DM, yet");
      return Promise.resolve();
    }

    try {
      await cmdMgr.onInteraction(bot, interaction);
    } catch (err) {
      logger.error("failed to execute the command:", err);

      // TODO: Send a reply to the interaction event.
      const channelId = interaction.channelId;
      sendMessage(bot, channelId, {
        content: `failed to execute the command: ${err.message}`,
      });

      return Promise.reject(err);
    }

    return Promise.resolve();
  };
};

export { interactionCreateHandler };
