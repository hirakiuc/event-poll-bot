import type {
  ApplicationCommandOption,
  Bot,
  Interaction,
} from "../../../deps.ts";
import type { Command } from "../mod.ts";

import type { Loggable } from "../../logger/mod.ts";

import { ApplicationCommandTypes } from "../../../deps.ts";

import * as startcmd from "./eventpoll_start.ts";
import * as stopcmd from "./eventpoll_stop.ts";

class EventPollCommand implements Command {
  name: string;
  description: string;
  usage: string[];
  options: ApplicationCommandOption[];
  type: number;

  private logger: Loggable;

  constructor(logger: Loggable) {
    this.name = "event-poll";
    this.description = "poll a schedule of an event.";
    this.usage = [
      startcmd.usage,
      stopcmd.usage,
    ];
    this.options = (startcmd.options).concat(stopcmd.options);
    this.type = ApplicationCommandTypes.ChatInput;

    this.logger = logger;
  }

  execute(_bot: Bot, _interaction: Interaction): void {
    this.logger.debug("event-poll invoked!");
  }
}

export { EventPollCommand };
