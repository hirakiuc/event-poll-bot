import type {
  ApplicationCommandOption,
  Bot,
  Interaction,
} from "../../../deps.ts";
import type {
  Command,
  SubCommand,
  SubCommandArgument,
} from "../../../shared.ts";
import type { Loggable } from "../../logger/mod.ts";

import { ApplicationCommandTypes } from "../../../deps.ts";

import { createEventPollStartCmd } from "./eventpoll_start.ts";
import { createEventPollStopCmd } from "./eventpoll_stop.ts";

class EventPollCommand implements Command {
  description: string;
  name: string;
  type: number;

  private cache: Map<string, SubCommand>;
  private logger: Loggable;

  constructor(logger: Loggable) {
    this.name = "event-poll";
    this.description = "poll a schedule of an event.";
    this.type = ApplicationCommandTypes.ChatInput;
    this.cache = new Map();

    const subs = [
      createEventPollStartCmd(logger),
      createEventPollStopCmd(logger),
    ];
    for (const c of subs) {
      this.cache.set(c.name, c);
    }

    this.logger = logger;
  }

  get subcommands(): SubCommand[] {
    return Array.from(this.cache.values());
  }

  get usage(): string[] {
    return this.subcommands
      .map((v: SubCommand) => v.usage ? v.usage : [])
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

  async execute(bot: Bot, interaction: Interaction): Promise<Error | unknown> {
    this.logger.debug("event-poll invoked!");

    if (!interaction.data || !interaction.data.options) {
      const err = new Deno.errors.NotSupported("invalid event-poll request");
      return Promise.reject(err);
    }

    const args = interaction.data.options;
    if (args.length == 0) {
      const err = new Deno.errors.NotSupported(
        "invalid event-poll request:No arguments",
      );
      return Promise.reject(err);
    }

    const name = args[0].name;
    const subcmd = this.cache.get(name);
    if (!subcmd) {
      const err = new Deno.errors.NotSupported(
        "invalid event-poll request:unsupported sub command",
      );
      return Promise.reject(err);
    }

    // parse rest of options for sub command.
    // FIXME: need to be improved for more dedicated logic
    const subArgs: SubCommandArgument[] = [];
    const restOfOptions = args[0].options;
    if (Array.isArray(restOfOptions)) {
      for (const opt of restOfOptions) {
        subArgs.push({
          name: opt.name,
          type: opt.type,
          value: opt.value,
        });
      }
    }

    await subcmd.execute(bot, interaction, subArgs);

    return Promise.resolve();
  }
}

const createEventPollCommand = (logger: Loggable): Command => {
  return new EventPollCommand(logger);
};

export { createEventPollCommand };
