import type {
  ApplicationCommandOption,
  ApplicationCommandOptionTypes,
  Bot,
  Interaction,
} from "../../deps.ts";

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
  type: ApplicationCommandOptionTypes;
  execute: (bot: Bot, interaction: Interaction) => unknown;
  subcommands?: Array<subCommandGroup | subCommand>;
}
