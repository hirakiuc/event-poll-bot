import type { Bot, Interaction } from "../../deps.ts";
import type { Command } from "./mod.ts";

import { InteractionTypes, upsertApplicationCommands } from "../../deps.ts";
import { Loggable } from "../logger/mod.ts";
import { createEventPollCommand } from "./eventpoll/eventpoll.ts";

class CommandManager {
  private cache: Map<string, Command>;
  private logger: Loggable;

  constructor(logger: Loggable) {
    this.cache = new Map();
    this.logger = logger;
  }

  init(): void {
    const cmds = [
      createEventPollCommand(this.logger),
    ];

    for (const cmd of cmds) {
      this.cache.set(cmd.name, cmd);
    }
  }

  get commands(): Command[] {
    return Array.from(this.cache.values());
  }

  async registerGuildCommands(
    bot: Bot,
    guildIds: bigint[],
  ): Promise<Error | void> {
    const guildCommands = this.commands;

    if (guildCommands.length > 0) {
      for (const guildId of guildIds) {
        try {
          await upsertApplicationCommands(bot, guildCommands, guildId);
        } catch (err) {
          this.logger.error("failed to register guild commands", err);
          return Promise.reject(err);
        }
      }
    }

    return Promise.resolve();
  }

  async onInteraction(bot: Bot, interaction: Interaction): Promise<any> {
    // Guards
    if (!this.isInteractionForApplicationCommand(interaction)) {
      return Promise.resolve(false);
    }
    if (!interaction.data) {
      return Promise.resolve(false);
    }

    const cmd = this.cache.get(interaction.data.name);
    if (!cmd) {
      const msg = `command '${interaction.data.name}' not found`;
      const err = new Deno.errors.NotSupported(msg);
      return Promise.reject(err);
    }

    await cmd.execute(bot, interaction);

    return Promise.resolve();
  }

  private isInteractionForApplicationCommand(
    interaction: Interaction,
  ): boolean {
    return (interaction.type === InteractionTypes.ApplicationCommand);
  }
}

export { CommandManager };
