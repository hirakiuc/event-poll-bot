// Internal shared types
import type {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  Bot,
  Interaction,
} from "./deps.ts";

import type { InteractionDataOption, InteractionResponse } from "./deps.ts";

import type { Loggable } from "./src/logger/mod.ts";
import type { Config } from "./src/config/mod.ts";

export type { Config, Loggable };

export interface CommandRegistry {
  init: (bot: Bot, config: Config) => void;
  getCommand: (interaction: Interaction) => Command | Error;

  registerGuildCommands: (
    bot: Bot,
    guildIds: bigint[],
  ) => Promise<Error | void>;
}

export interface HandlerOptions {
  logger: Loggable;
  config: Config;
  cmdMgr: CommandRegistry;
}

export interface Argument {
  name: string;
  type: InteractionDataOption;
  value: any;
}

export type ExecResult = InteractionResponse | void | Error;

export interface Executor {
  beforeExec(): Promise<ExecResult>;
  execute(): Promise<ExecResult>;
  afterExec(): Promise<ExecResult>;
}

export interface Command {
  description: string;
  name: string;
  options?: ApplicationCommandOption[];
  type: ApplicationCommandTypes;
  usage?: string[];

  subcommands: Array<SubCommand>;
  getExecutor: (interaction: Interaction) => Executor | Error;
}

export interface SubCommand {
  name: string;
  description: string;
  usage: string[];

  getOption: () => ApplicationCommandOption;
  getExecutor: (
    interaction: Interaction,
    args: InteractionDataOption[],
  ) => Executor | Error;
}

export interface CommandOptions {
  name: string;
  description: string;
  usage?: string[];
  options?: ApplicationCommandOption[];
  type: ApplicationCommandTypes;
}
