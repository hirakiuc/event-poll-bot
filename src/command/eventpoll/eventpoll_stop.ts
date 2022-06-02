import type {
  ApplicationCommandOption,
  Bot,
  Interaction,
  InteractionDataOption,
  InteractionResponse,
} from "../../../deps.ts";

import type { Executor, Loggable, SubCommand } from "../../../shared.ts";

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

class EventPollStopCommand implements SubCommand {
  name: string;
  description: string;
  usage: string[];

  private logger: Loggable;
  private bot: Bot;

  constructor(bot: Bot, logger: Loggable) {
    this.name = "stop";
    this.description = "stop an event poll";
    this.usage = ["/event-poll stop id"];

    this.logger = logger;
    this.bot = bot;
  }

  getOption(): ApplicationCommandOption {
    return option;
  }

  getExecutor(
    interaction: Interaction,
    args: InteractionDataOption[],
  ): Executor | Error {
    return new EventPollStopExecutor(
      this,
      interaction,
      args,
      this.bot,
      this.logger,
    );
  }
}

class EventPollStopExecutor implements Executor {
  private subcmd: SubCommand;
  private interaction: Interaction;
  private options: InteractionDataOption[];
  private logger: Loggable;

  private bot: Bot;

  constructor(
    subcmd: SubCommand,
    interaction: Interaction,
    options: InteractionDataOption[],
    bot: Bot,
    logger: Loggable,
  ) {
    this.subcmd = subcmd;
    this.interaction = interaction;
    this.options = options;
    this.bot = bot;

    this.logger = logger;
  }

  beforeExec(): Promise<InteractionResponse | void | Error> {
    return Promise.resolve();
  }

  execute(): Promise<InteractionResponse | void | Error> {
    this.logger.debug({
      message: "Invoke /event-poll stop command",
      arguments: this.options,
    });

    return Promise.resolve({
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "Invoked /event-poll stop command",
      },
    });
  }

  afterExec(): Promise<InteractionResponse | void | Error> {
    return Promise.resolve();
  }
}

const createEventPollStopCmd = (bot: Bot, logger: Loggable): SubCommand => {
  return new EventPollStopCommand(bot, logger);
};

export { createEventPollStopCmd };
