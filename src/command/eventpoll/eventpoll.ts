import type {
  ApplicationCommandOption,
  Bot,
  Interaction,
  InteractionDataOption,
} from "../../../deps.ts";

import type {
  Command,
  Executor,
  Loggable,
  SubCommand,
} from "../../../shared.ts";

import { ApplicationCommandTypes } from "../../../deps.ts";

import { createEventPollStartCmd } from "./eventpoll_start.ts";
import { createEventPollStopCmd } from "./eventpoll_stop.ts";

interface CommandArgument {
  name: string;
  options: InteractionDataOption[];
}

class EventPollCommand implements Command {
  readonly description: string;
  readonly name: string;
  readonly type: ApplicationCommandTypes;

  private cache: Map<string, SubCommand>;
  private logger: Loggable;

  private bot: Bot;

  constructor(bot: Bot, logger: Loggable) {
    this.description = "poll a schedule of an event.";
    this.name = "event-poll";
    this.type = ApplicationCommandTypes.ChatInput;

    this.cache = new Map();
    this.logger = logger;

    this.bot = bot;

    // initialize subcommands
    const subs = [
      createEventPollStartCmd(bot, logger),
      createEventPollStopCmd(bot, logger),
    ];
    for (const c of subs) {
      this.cache.set(c.name, c);
    }
  }

  get usage(): string[] | undefined {
    return this.subcommands
      .map((v: SubCommand) => v.usage)
      .reduce((acc: string[], y: string[]) => acc.concat(y), []);
  }

  get options(): ApplicationCommandOption[] {
    return this.subcommands
      .map((v: SubCommand): ApplicationCommandOption => v.getOption())
      .reduce((acc: ApplicationCommandOption[], v) => {
        acc.push(v);
        return acc;
      }, []);
  }

  get subcommands(): SubCommand[] {
    return Array.from(this.cache.values());
  }

  getExecutor(interaction: Interaction): Executor | Error {
    const args = this.parseArguments(interaction);

    if (args.name.length === 0) {
      return new Deno.errors.NotSupported(
        "Invalid options:no sub command name",
      );
    }

    this.logger.debug({ subcmd: args.name });
    const subcmd = this.cache.get(args.name);
    if (!subcmd) {
      return new Deno.errors.NotSupported(
        `need to be implemented:subcmd(${args.name})`,
      );
    }

    return subcmd.getExecutor(interaction, args.options);
  }

  private parseArguments(interaction: Interaction): CommandArgument {
    this.logger.debug({ method: "parseArguments", interaction: interaction });
    if (!interaction.data || !interaction.data.options) {
      this.logger.debug("interaction didn't have any data.options...");
      return {
        name: "",
        options: [],
      };
    }

    const args = interaction.data.options;
    this.logger.debug({ method: "parseArguments", args: args });
    if (args.length === 0) {
      this.logger.debug("invalid event-poll request:No arguments");
      return {
        name: "",
        options: [],
      };
    }

    return {
      name: args[0].name as string,
      options: (args[0].options) ? args[0].options : [],
    };
  }
}

const createEventPollCommand = (bot: Bot, logger: Loggable): Command => {
  return new EventPollCommand(bot, logger);
};

export { createEventPollCommand };
