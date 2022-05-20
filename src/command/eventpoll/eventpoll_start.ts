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

// /event-poll start ...
const option: ApplicationCommandOption = {
  name: "start",
  description: "Start polling a schedule of an event.",
  type: ApplicationCommandOptionTypes.SubCommand,
  required: false,
  options: [
    {
      name: "title",
      description: "title of this poll",
      type: ApplicationCommandOptionTypes.String,
      required: true,
    },
    {
      name: "option1",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option2",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option3",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option4",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
    {
      name: "option5",
      description: "Candidate Event Time",
      type: ApplicationCommandOptionTypes.String,
      required: false,
    },
  ],
};

const createExecute = (logger: Loggable): CommandHandler => {
  return async (bot: Bot, interaction: Interaction): Promise<Error | void> => {
    logger.debug("Invoke /event-poll start command");

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

const createEventPollStartCmd = (logger: Loggable): SubCommand => {
  return {
    name: "start",
    description: "start an event poll",
    usage: ["/event-poll start title option1..."],

    getOption: (): ApplicationCommandOption => {
      return option;
    },
    execute: createExecute(logger),
  };
};

export { createEventPollStartCmd };
