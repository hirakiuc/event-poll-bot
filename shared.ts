// Internal shared types
import type {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  Bot,
  Interaction,
} from "./deps.ts";

import type { Loggable } from "./src/logger/mod.ts";
import type { Config } from "./src/config/mod.ts";

import { CommandManager } from "./src/command/commander.ts";

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
  execute: CommandHandler;
}