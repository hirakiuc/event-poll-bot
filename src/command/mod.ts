import type {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  Bot,
  Interaction,
} from "../../deps.ts";

import { registerGuildCommands } from "./commander.ts";

export type subCommand = Omit<Command, "subcommands">;
export type subCommandGroup = {
  name: string;
  subCommands: subCommand[];
};

export interface Command {
  name: string;
  description: string;
  usage?: string[];
  options?: ApplicationCommandOption[];
  type: ApplicationCommandTypes;
  execute: (bot: Bot, interaction: Interaction) => unknown;
  subcommands?: Array<subCommandGroup | subCommand>;
}

export { registerGuildCommands };
