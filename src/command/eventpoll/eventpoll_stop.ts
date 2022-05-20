import type {
  ApplicationCommandOption,
  Bot,
  Interaction,
} from "../../../deps.ts";
import type { CommandHandler, SubCommand } from "../../../shared.ts";
import type { Loggable } from "../../logger/mod.ts";

import {
  ApplicationCommandOptionTypes,
  InteractionResponseTypes,
} from "../../../deps.ts";

// /event-poll stop ...
const option: ApplicationCommandOption = {
  name: "stop",
  description: "Stop a poll with a poll id",
  type: ApplicationCommandOptionTypes.SubCommand,
  required: false,
  options: [
    {
      name: "id",
      description: "poll id",
      type: ApplicationCommandOptionTypes.Number,
      required: true,
    },
  ],
};

const createExecute = (logger: Loggable): CommandHandler => {
  return async (bot: Bot, interaction: Interaction): Promise<Error | void> => {
    logger.debug("Invoke /event-poll stop command");

    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Invoked /event-poll start command",
        },
      },
    );
  };
};

const createEventPollStopCmd = (logger: Loggable): SubCommand => {
  return {
    name: "stop",
    description: "stop an event poll",
    usage: ["/event-poll stop id"],

    getOption: (): ApplicationCommandOption => {
      return option;
    },
    execute: createExecute(logger),
  };
};

export { createEventPollStopCmd };
