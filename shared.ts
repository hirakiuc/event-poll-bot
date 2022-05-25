// Internal shared types
import type {
  ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  ApplicationCommandTypes,
  Bot,
  Interaction,
} from "./deps.ts";

import type { Loggable } from "./src/logger/mod.ts";
import type { Config } from "./src/config/mod.ts";

import { CommandManager } from "./src/command/commander.ts";

export type { Loggable };

export interface HandlerOptions {
  logger: Loggable;
  config: Config;
  cmdMgr: CommandManager;
}

export type CommandHandler = (bot: Bot, interaction: Interaction) => unknown;

export interface Command {
  name: string;
  description: string;
  usage?: string[];
  options?: ApplicationCommandOption[];
  type: ApplicationCommandTypes;

  execute: CommandHandler;
  subcommands?: Array<SubCommand>;
}

export interface SubCommand {
  name: string;
  description: string;
  usage?: string[];

  getOption: () => ApplicationCommandOption;
  execute: (
    bot: Bot,
    interaction: Interaction,
    args: SubCommandArgument[],
  ) => any;
}

export interface SubCommandOptions {
  name: string;
  description: string;
  usage: string[];
}

export interface SubCommandArgument {
  value: any;
  type: ApplicationCommandOptionTypes;
  name: string;
}

export abstract class AbstractSubCommand {
  name: string;
  description: string;
  usage: string[];

  protected logger: Loggable;

  constructor(opts: SubCommandOptions, logger: Loggable) {
    this.name = opts.name;
    this.description = opts.description;
    this.usage = opts.usage;

    this.logger = logger;
  }

  abstract getOption(): ApplicationCommandOption;
  abstract execute(
    bot: Bot,
    interaction: Interaction,
    args: SubCommandArgument[],
  ): any;
}
