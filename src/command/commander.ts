import type { Bot, Interaction } from "../../deps.ts";
import type {
  Command,
  CommandRegistry,
  Config,
  Loggable,
} from "../../shared.ts";

import { InteractionTypes, upsertApplicationCommands } from "../../deps.ts";
import { createEventPollCommand } from "./eventpoll/eventpoll.ts";

class CommandManager implements CommandRegistry {
  private cache: Map<string, Command>;
  private logger: Loggable;

  constructor(logger: Loggable) {
    this.cache = new Map();
    this.logger = logger;
  }

  init(bot: Bot, _config: Config): void {
    const cmds = [
      createEventPollCommand(bot, this.logger),
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

  getCommand(interaction: Interaction): Command | Error {
    // Guards
    if (!this.isInteractionForApplicationCommand(interaction)) {
      const msg = `This interaction does not seem to be a application command.`;
      return new Deno.errors.NotSupported(msg);
    }
    if (!interaction.data) {
      const msg = `This interaction does not have enough request data.`;
      return new Deno.errors.NotSupported(msg);
    }

    const cmd = this.cache.get(interaction.data.name);
    if (!cmd) {
      const msg = `command '${interaction.data.name}' not found`;
      return new Deno.errors.NotSupported(msg);
    }

    return cmd;
  }

  private isInteractionForApplicationCommand(
    interaction: Interaction,
  ): boolean {
    return (interaction.type === InteractionTypes.ApplicationCommand);
  }
}

export { CommandManager };
