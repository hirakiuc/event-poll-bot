import type {
  ApplicationCommandOption,
  Bot,
  Interaction,
} from "../../../deps.ts";
import type { SubCommand, SubCommandArgument } from "../../../shared.ts";
import type { Loggable } from "../../logger/mod.ts";

import {
  ApplicationCommandOptionTypes,
  InteractionResponseTypes,
} from "../../../deps.ts";

import { AbstractSubCommand } from "../../../shared.ts";

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

class EventPollStopCommand extends AbstractSubCommand {
  constructor(logger: Loggable) {
    super({
      name: "stop",
      description: "stop an event poll",
      usage: ["/event-poll stop id"],
    }, logger);
  }

  getOption(): ApplicationCommandOption {
    return option;
  }

  async execute(
    bot: Bot,
    interaction: Interaction,
    args: SubCommandArgument[],
  ): Promise<Error | void> {
    this.logger.debug({
      message: "Invoke /event-poll stop command",
      arguments: args,
    });

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
  }
}

const createEventPollStopCmd = (logger: Loggable): SubCommand => {
  return new EventPollStopCommand(logger);
};

export { createEventPollStopCmd };
